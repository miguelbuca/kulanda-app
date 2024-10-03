import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useOrder } from "@/src/hooks/use-order";
import { formatMoney } from "@/src/utils/format-money";
import { Button, Input } from "@/src/components";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_INVOICE,
  CREATE_RECEIPT,
  CREATE_SALE,
} from "@/src/graphql/mutations";
import { client } from "@/src/api/client";
import { useRouter } from "expo-router";
import { GET_CLIENTS } from "@/src/graphql/queries";
import { useStore } from "@/src/hooks/use-store";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { useDevice } from "@/src/hooks/use-device";
import { Select } from "@/src/components/select";
import { Controller, useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompany } from "@/src/hooks/use-company";
import { getDueDate } from "@/src/utils/due-date";

const schema = z.object({
  client: z.object({
    fullName: z.string().optional(),
    id: z.string().optional(),
  }),
  state: z.string().optional(),
  dueDate: z.number(),
  observation: z.string().optional(),
  retention: z.number().optional(),
});

type PaymentsType = {
  amount: number;
  type: keyof typeof paymentType;
};

const paymentType = {
  CASH: "Dinheiro",
  DEPOSIT: "Depósito",
  BANK_TRANSFER: "Transferencia Bancária",
  CREDIT_CARD: "Cartão de crédito",
  MULTICAIXA_EXPRESS: "Multicaixa Express",
};

const Payment = () => {
  const [multiFieldValue, setMultiFieldValue] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientType>();
  const { subtotalPrice, qtd, items, setLastSale, totalPrice, reset } =
    useOrder();

  const [currentPayment, setCurrentPayment] = useState<PaymentsType>({
    amount: 0,
    type: "CASH",
  });
  const [payments, setPayments] = useState<PaymentsType[]>([]);

  const { type } = useDevice();

  const { store } = useStore();

  const router = useRouter();

  const [createSale] = useMutation(CREATE_SALE, {
    client: client,
  });

  const [createReceipt] = useMutation(CREATE_RECEIPT, {
    client: client,
  });

  const [createInvoice] = useMutation(CREATE_INVOICE, {
    client: client,
    onCompleted({ createInvoice }) {
      if (createInvoice.status === "PAID") {
        createReceipt({
          variables: {
            invoiceId: createInvoice?.id,
            observation: createInvoice?.observation,
            dueDate: createInvoice?.dueDate,
            amount: createInvoice?.amount,
            change,
            payments,
          },
        });
      }
      router.navigate("/_/store/payment-proof/" + createInvoice.id);
    },
  });

  const { data } = useQuery(GET_CLIENTS, {
    client: client,
    variables: {
      storeId: store.id,
      filter: {
        fullName: multiFieldValue.length > 1 ? multiFieldValue : undefined,
        email: multiFieldValue.length > 1 ? multiFieldValue : undefined,
        phone: multiFieldValue.length > 1 ? multiFieldValue : undefined,
      },
    },
    fetchPolicy: "no-cache",
  });

  const handleNewReceipt = useCallback(
    async (values: z.infer<typeof schema>) => {
      const orders = qtd.map((id) => {
        const item = items.findLast((item) => item.id === id);

        return item?.category?.type === "PRODUCT"
          ? {
              productId: id,
            }
          : { serviceId: id };
      });

      const dueDate = getDueDate(values.dueDate);

      createSale({
        variables: {
          orders,
          clientId: values?.client.id,
        },
        onError(error) {
          console.log(error.graphQLErrors);
        },
        onCompleted({ createSale }) {
          createInvoice({
            variables: {
              saleId: createSale?.id,
              amount: totalPrice,
              status: values.state,
              dueDate,
              change,
              observation: values.observation,
              retention: values.retention,
            },
          });
        },
      });
    },
    [items, reset, totalPrice]
  );

  const { control, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      state: "DRAFT",
    },
    values: {
      dueDate: 0,
      client: {
        fullName: selectedClient?.fullName?.toString(),
        id: selectedClient?.id,
      },
      retention: 6.5,
    },
    resolver: zodResolver(schema),
  });

  const handleAddPayment = useCallback(() => {
    if (currentPayment?.amount && currentPayment.type) {
      setPayments((prev) => [...prev, currentPayment]);
      setCurrentPayment({
        amount: 0,
        type: "CASH",
      });
    }
  }, [currentPayment]);

  const handleRemovePayment = useCallback(
    (index: number) => {
      setPayments((prev) => prev.filter((_, key) => key !== index));
    },
    [currentPayment]
  );

  const { totalPaid, change } = useMemo(() => {
    let totalPaid = 0;

    payments.forEach((item) => {
      totalPaid = totalPaid + item.amount;
    });

    return {
      totalPaid,
      change: totalPaid - totalPrice,
    };
  }, [payments, totalPrice]);

  return (
    <ScrollView className="flex-1 bg-gray-50" style={{ flex: 1 }}>
      <View
        className={`flex flex-col flex-1 ${
          type !== "PHONE" ? "p-10" : "p-6 pb-24"
        }`}
      >
        <View
          className={`flex ${
            type !== "PHONE" ? "flex-row gap-x-10" : "flex-col gap-y-10"
          } `}
        >
          <View>
            <View
              className={`flex ${
                type !== "PHONE" ? "p-4 w-[400px]" : "p-4"
              } flex-col bg-white shadow-sm rounded-lg`}
            >
              <View className="flex items-center flex-row gap-x-3">
                <View className="flex-1">
                  <Input
                    placeholder="Encontrar cliente nome, email..."
                    value={multiFieldValue}
                    className="h-12"
                    leftElement={
                      <Ionicons name="person" size={20} color={"#ccc"} />
                    }
                    onChangeText={(text) => setMultiFieldValue(text)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => router.push("_/store/customer/create")}
                >
                  <View className="flex items-center justify-center p-3 bg-blue-500 rounded-lg h-12 w-12">
                    <Ionicons
                      name="person-add-outline"
                      size={24}
                      color={"#fff"}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View className={`flex-1`}>
                {data?.getClients?.length >= 1
                  ? ((data?.getClients ?? []) as ClientType[]).map(
                      (item, index) => {
                        const cl: ClientType = item;
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              setSelectedClient(cl);
                              setMultiFieldValue("");
                            }}
                          >
                            <View
                              className={`flex flex-col mx-3 hover:bg-gray-200 gap-y-1 ${
                                index !== data?.getClients?.length - 1
                                  ? "border-b border-b-gray-200"
                                  : ""
                              } pb-2`}
                            >
                              <Text className="text-base font-medium">
                                {cl.fullName}
                              </Text>
                              <Text className="flex items-center text-xs opacity-60">
                                <View className="mr-2">
                                  <Ionicons name="mail-outline" />
                                </View>
                                {cl.email}
                              </Text>
                              <Text className="flex items-center text-xs opacity-60">
                                <View className="mr-2">
                                  <Ionicons name="call-outline" />
                                </View>
                                {isValidPhoneNumber(cl.phone) &&
                                  parsePhoneNumber(
                                    cl.phone
                                  ).formatInternational()}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    )
                  : null}
              </View>
            </View>
          </View>
          <View
            className={`${
              type !== "PHONE" ? "flex-[2] p-6" : "p-4"
            } bg-white shadow-sm rounded-lg`}
          >
            <View className="p-6 items-center justify-center">
              <Text className={`${type !== "PHONE" ? "text-6xl" : "text-2xl"}`}>
                {formatMoney(subtotalPrice)}
              </Text>
              <Text className="mt-2 text-xs text-primary-500">Valor total</Text>
            </View>
            <View>
              <View
                className={`flex ${
                  type !== "PHONE" ? "flex-row gap-x-4" : "flex-col gap-y-10"
                }`}
              >
                <View className="flex-1">
                  <Controller
                    control={control}
                    render={({ field: { value, onChange }, formState }) => (
                      <Input
                        placeholder="Nome do cliente"
                        value={value?.fullName}
                        onChangeText={onChange}
                        editable={false}
                        errorMessage={formState.errors.client?.message}
                      />
                    )}
                    name="client"
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    render={({ field: { onChange, value }, formState }) => (
                      <Select
                        value={value}
                        placeholder="Data de vencimento (nenhum)"
                        items={[
                          {
                            label: "15 Dias",
                            value: 15,
                          },
                          {
                            label: "30 Dias",
                            value: 30,
                          },
                          {
                            label: "45 Dias",
                            value: 45,
                          },
                          {
                            label: "60 Dias",
                            value: 60,
                          },
                        ]}
                        onValueChange={onChange}
                        errorMessage={formState.errors.state?.message}
                      />
                    )}
                    name="dueDate"
                  />
                </View>
              </View>
              <View>
                <Controller
                  control={control}
                  render={({ field: { value: obs, onChange }, formState }) => (
                    <Input
                      placeholder="Observações"
                      value={obs}
                      onChangeText={onChange}
                      multiline
                      className="py-3"
                      errorMessage={formState.errors.client?.message}
                    />
                  )}
                  name="observation"
                />
              </View>
              <View
                className={`flex ${
                  type !== "PHONE" ? "flex-row gap-x-4" : "flex-col gap-y-10"
                }`}
              >
                <View className="flex-1">
                  <Controller
                    control={control}
                    render={({ field: { onChange, value }, formState }) => (
                      <Select
                        value={value}
                        placeholder="Situação da fatura (nenhum)"
                        items={[
                          {
                            label: "Pago",
                            value: "PAID",
                          },
                          {
                            label: "Não Pago",
                            value: "DRAFT",
                          },
                        ]}
                        onValueChange={onChange}
                        errorMessage={formState.errors.state?.message}
                      />
                    )}
                    name="state"
                  />
                </View>
                {store.saleType !== "PRODUCT" ? (
                  <View className="flex-1">
                    <Controller
                      control={control}
                      render={({ field: { value, onChange }, formState }) => (
                        <Input
                          placeholder="Taxa de Retenção"
                          value={value?.toString()}
                          onChangeText={(value) => onChange(Number(value))}
                          keyboardType="numbers-and-punctuation"
                          errorMessage={formState.errors.retention?.message}
                        />
                      )}
                      name="retention"
                    />
                  </View>
                ) : null}
              </View>

              {watch("state") === "PAID" ? (
                <>
                  <View className="my-3">
                    <Text className="ml-3 text-base font-semibold text-black/40">
                      Adicionar pagamento
                    </Text>
                  </View>
                  <View
                    className={`flex ${
                      type === "PHONE"
                        ? "flex-col"
                        : "flex-row items-center gap-2"
                    } `}
                  >
                    <View className="flex-1">
                      <Input
                        currencyProps={{
                          value: currentPayment?.amount ?? 0,
                          onChangeValue: (value) => {
                            setCurrentPayment((prev) => ({
                              ...prev,
                              amount: value ?? 0,
                            }));
                          },
                          suffix: " Kz",
                          delimiter: ".",
                          separator: ",",
                          precision: 2,
                          minValue: 0,
                        }}
                      />
                    </View>
                    <View className="flex flex-row items-center gap-x-2 flex-1">
                      <View className="flex-1">
                        <Select
                          value={currentPayment?.type}
                          placeholder="Forma de pagamento (nenhum)"
                          onValueChange={(value) => {
                            setCurrentPayment((prev) => ({
                              ...prev,
                              type: value,
                            }));
                          }}
                          items={[
                            {
                              label: "Dinheiro",
                              value: "CASH",
                            },
                            {
                              label: "Depósito",
                              value: "DEPOSIT",
                            },
                            {
                              label: "Transferência Bancária",
                              value: "BANK_TRANSFER",
                            },
                            {
                              label: "Cartão de Crédito",
                              value: "CREDIT_CARD",
                            },
                            {
                              label: "Multicaixa Express",
                              value: "MULTICAIXA_EXPRESS",
                            },
                          ]}
                        />
                      </View>
                      <View>
                        <TouchableOpacity onPress={handleAddPayment}>
                          <View className="flex items-center justify-center p-3 bg-black rounded-lg h-12 w-12">
                            <Ionicons name="add" size={24} color={"#fff"} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </>
              ) : null}
            </View>
            {payments.length ? (
              <View className="flex flex-row flex-wrap gap-2 mt-8">
                {payments.map(({ amount, type }, index) => (
                  <View
                    key={index}
                    className="flex flex-row rounded-lg items-center p-2 gap-x-2 border border-primary-500"
                  >
                    <Text className="font-bold">{paymentType[type]}</Text>
                    <Text>{formatMoney(amount ?? 0)}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemovePayment(index)}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={18}
                        color={"rgb(209 157 55)"}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
            <View
              className={`flex ${
                type === "PHONE"
                  ? "flex-col-reverse gap-3"
                  : "flex-row-reverse gap-3 items-center justify-between"
              }  mt-8 border-t border-gray-100`}
            >
              <Button onPress={handleSubmit(handleNewReceipt)}>
                <View className="flex flex-row items-center">
                  <Ionicons name="print-outline" size={25} color={"#ffffff"} />
                  <Text className="ml-4 font-semibold text-white text-base">
                    Imprimir comprovativo
                  </Text>
                </View>
              </Button>
              {watch("state") === "PAID" ? (
                <View className="flex flex-col mb-4">
                  <View className="flex flex-row items-center gap-x-2">
                    <Text className="font-bold">Troco: </Text>
                    <Text>{change > 0 ? formatMoney(change) : "-"}</Text>
                  </View>
                  <View className="flex flex-row mt-2 items-center gap-x-2">
                    <Text className="font-bold">Valor recebido: </Text>
                    <Text>{formatMoney(totalPaid)}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Payment;
