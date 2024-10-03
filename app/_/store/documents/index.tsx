import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOrder } from "@/src/hooks/use-order";
import { formatMoney } from "@/src/utils/format-money";
import { Button, Input, Orders } from "@/src/components";
import { ScrollView } from "react-native-gesture-handler";
import {
  AntDesign,
  EvilIcons,
  Feather,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";

import { split, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CREDIT_NOTE,
  CREATE_INVOICE,
  CREATE_RECEIPT,
  CREATE_SALE,
} from "@/src/graphql/mutations";
import { client } from "@/src/api/client";
import { useRouter } from "expo-router";
import { GET_CLIENTS, GET_INVOICES } from "@/src/graphql/queries";
import { useStore } from "@/src/hooks/use-store";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { useDevice } from "@/src/hooks/use-device";
import { Select } from "@/src/components/select";
import { Controller, useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompany } from "@/src/hooks/use-company";
import { getDueDate } from "@/src/utils/due-date";
import { getInvoiceStatus } from "@/src/utils/invoice-status";
import { prepareOrders } from "@/src/utils/generate-html";

const schema = z.object({
  state: z.string().optional(),
  documentType: z.string(),
  observation: z.string().optional(),
  dueDate: z.number(),
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

const Documents = () => {
  const [multiFieldValue, setMultiFieldValue] = useState<string>();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType>();

  const [currentPayment, setCurrentPayment] = useState<PaymentsType>({
    amount: 0,
    type: "CASH",
  });
  const [payments, setPayments] = useState<PaymentsType[]>([]);

  const [orders, setOrders] = useState<OrderType[]>([]);

  const [newItems, setNewItems] = useState<ProductType[] | ServiceType[]>([]);

  const [deletedItems, setDeletedItems] = useState<
    ProductType[] | ServiceType[]
  >([]);

  const { type } = useDevice();

  const { store } = useStore();

  const router = useRouter();

  const { totalPrice } = useOrder();

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

  const { data } = useQuery(GET_INVOICES, {
    client: client,
    variables: {
      filter: {
        number: multiFieldValue ? parseInt(multiFieldValue) : "",
      },
    },
    fetchPolicy: "no-cache",
  });

  const [createReceipt] = useMutation(CREATE_RECEIPT, {
    client: client,
  });

  const [createCreditNote] = useMutation(CREATE_CREDIT_NOTE, {
    client: client,
  });

  const [createDebitNote] = useMutation(CREATE_CREDIT_NOTE, {
    client: client,
  });

  const { control, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
    values: {
      state: selectedInvoice?.status?.toString() ?? "DRAFT",
      documentType: "RECEIPT",
      retention: 0,
      dueDate: 15,
      observation: selectedInvoice?.observation?.toString(),
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

  const ordersList = useMemo(() => prepareOrders(orders), [orders]);

  useEffect(() => {
    if (selectedInvoice?.id) setOrders(selectedInvoice?.sale?.orders ?? []);
    else setOrders([]);
  }, [selectedInvoice, watch("documentType")]);

  const handleAddOrder = useCallback(
    (item: ProductType | ServiceType) => {
      setOrders((prev) => [
        ...prev,
        {
          id: watch("documentType").toLocaleLowerCase(),
          products: item.category?.type === "PRODUCT" ? [item] : [],
          services: item.category?.type === "SERVICE" ? [item] : [],
        },
      ]);
      setNewItems((prev) => [...prev, item]);
    },
    [orders, watch("documentType")]
  );

  const handleRemoveOrder = useCallback(
    (_: string, item?: ProductType | ServiceType) => {
      if (!item) return;
      setDeletedItems((prev) => [...prev, item]);
    },
    [orders, watch("documentType")]
  );

  const handleDeleteOrder = useCallback(
    (id: string) => {
      const newOrders = orders
        .map(({ products, services, ...order }) => {
          return {
            products: products?.filter((item) => item.id !== id),
            services: services?.filter((item) => item.id !== id),
            ...order,
          };
        })
        .filter(
          ({ products, services }) => products?.length || services?.length
        );
      setOrders(newOrders);
    },
    [orders, watch("documentType")]
  );

  const { newTotal, deletedTotal } = useMemo(() => {
    let total = 0;
    let deletedTotal = 0;

    Object.keys(ordersList.products).forEach((key: string) => {
      const product = ordersList.products[key];

      total += product.total + product.totalChargers;

      if (deletedItems.filter(({ id }) => id === product.extra.id).length) {
        const ct = deletedItems.filter(
          ({ id }) => id === product.extra.id
        ).length;
        deletedTotal += (product.extra.price + product.totalChargers) * ct;
      }
    });
    Object.keys(ordersList.services).forEach((key: string) => {
      const service = ordersList.services[key];

      total += service.total + service.totalChargers;

      if (deletedItems.filter(({ id }) => id === service.extra.id).length) {
        const ct = deletedItems.filter(
          ({ id }) => id === service.extra.id
        ).length;
        deletedTotal += (service.extra.price + service.totalChargers) * ct;
      }
    });

    total = total - deletedTotal;

    return {
      newTotal:
        total -
        ((selectedInvoice?.retention ?? 0 + Number(watch("retention") ?? 0)) *
          total) /
          100,
      deletedTotal: deletedItems.length
        ? deletedTotal -
          ((selectedInvoice?.retention ?? 0 + Number(watch("retention") ?? 0)) *
            total) /
            100
        : 0,
    };
  }, [
    selectedInvoice,
    ordersList,
    watch("retention"),
    watch("documentType"),
    deletedItems,
  ]);

  const handleNewReceipt = useCallback(
    async ({ documentType, dueDate, ...values }: z.infer<typeof schema>) => {
      switch (documentType) {
        case "RECEIPT":
          createReceipt({
            variables: {
              invoiceId: selectedInvoice?.id,
              payments,
              amount: selectedInvoice?.amount,
              change: totalPaid - selectedInvoice?.amount,
              dueDate: getDueDate(dueDate),
              ...values,
            },
            onCompleted(data) {
              const url = `/_/store/payment-proof/${
                data?.createReceipt?.invoiceId
              }?type=${watch("documentType").toLowerCase()}`;
              router.push(url as any);
            },
          });
          break;
        case "CREDIT_NOTE":
          createCreditNote({
            variables: {
              invoiceId: selectedInvoice?.id,
              payments,
              change: selectedInvoice?.amount - newTotal,
              amount: newTotal,
              orders: deletedItems.map((item) => {
                if (item.category?.type === "PRODUCT")
                  return { productId: item.id };
                else return { serviceId: item.id };
              }),
              dueDate: getDueDate(dueDate),
              ...values,
            },
            onCompleted(data) {
              const url = `/_/store/payment-proof/${
                data.createCreditNote.invoiceId
              }?type=${watch("documentType").toLowerCase()}`;
              router.push(url as any);
            },
          });
          break;
        case "DEBIT_NOTE":
          createDebitNote({
            variables: {
              invoiceId: selectedInvoice?.id,
              payments,
              amount: newTotal,
              change: 0,
              dueDate: getDueDate(dueDate),
              orders: newItems.map((item) => {
                if (item.category?.type === "PRODUCT")
                  return { productId: item.id };
                else return { serviceId: item.id };
              }),
              ...values,
            },
            onCompleted(data) {
              const url = `/_/store/payment-proof/${
                data.createCreditNote.invoiceId
              }?type=${watch("documentType").toLowerCase()}`;
              router.push(url as any);
            },
          });
          break;
        default:
          break;
      }
      setSelectedInvoice(undefined);
      setPayments([]);
      setNewItems([]);
    },
    [
      deletedItems,
      totalPaid,
      selectedInvoice,
      newTotal,
      deletedTotal,
      payments,
      watch("documentType"),
    ]
  );

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
                    placeholder="Nº da fatura"
                    className="h-12"
                    leftElement={
                      <Ionicons name="receipt" size={20} color={"#ccc"} />
                    }
                    value={multiFieldValue}
                    onChangeText={(text) => {
                      const isFullInvoiceNumber = /^FT \d{4}\/\d+$/.test(text);
                      const isNoTFullInvoiceNumber = /^\d+$/.test(text);

                      if (!isFullInvoiceNumber && !isNoTFullInvoiceNumber) {
                        setMultiFieldValue(undefined);
                        setSelectedInvoice(undefined);
                        return;
                      }

                      if (isFullInvoiceNumber) {
                        const number =
                          text.split("/")?.[text.split("/").length - 1];

                        if (Number(number))
                          setMultiFieldValue(number.toString());
                      }

                      if (isNoTFullInvoiceNumber) {
                        setMultiFieldValue(text);
                      }
                    }}
                  />
                </View>
                <TouchableOpacity
                  disabled={!selectedInvoice?.id}
                  onPress={() => {
                    router.push(
                      `/_/store/payment-proof/${selectedInvoice?.id}`
                    );
                  }}
                >
                  <View
                    className={`flex flex-row items-center justify-center p-3 ${
                      selectedInvoice?.id ? "bg-blue-500" : "bg-gray-500"
                    } rounded-lg h-12`}
                  >
                    <EvilIcons name="external-link" size={24} color={"#fff"} />
                    <Text className="text-white ml-1">Ver fatura</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {data?.getInvoices?.length >= 1
                  ? ((data?.getInvoices ?? []) as InvoiceType[]).map(
                      (item, index) => {
                        const iv: InvoiceType = item;
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              setSelectedInvoice(iv);
                            }}
                          >
                            <View
                              className={`flex flex-col p-3 hover:bg-gray-200 gap-y-1 ${
                                index !== data?.getInvoices?.length - 1
                                  ? "border-b border-b-gray-200"
                                  : "mt-3"
                              } pb-2 rounded-md ${
                                iv.id === selectedInvoice?.id
                                  ? "border border-blue-400"
                                  : ""
                              }`}
                            >
                              <Text
                                className={`text-base font-medium ${
                                  iv.id === selectedInvoice?.id
                                    ? "text-blue-400"
                                    : ""
                                }`}
                              >
                                Fatura nº FT{" "}
                                {new Date(iv?.createdAt).getFullYear() +
                                  "/" +
                                  multiFieldValue}
                              </Text>
                              <View className="flex flex-row">
                                <Text className="text-xs">Estado:</Text>
                                <View
                                  style={{
                                    backgroundColor: getInvoiceStatus(
                                      iv?.status
                                    ).color,
                                  }}
                                  className="ml-1 py-1 rounded px-2"
                                >
                                  <Text className="text-white font-semibold text-[8px]">
                                    {getInvoiceStatus(iv?.status).name}
                                  </Text>
                                </View>
                              </View>

                              <Text className="flex items-center text-xs opacity-60">
                                <View className="mr-2">
                                  <Ionicons name="person" />
                                </View>
                                {iv.sale?.client?.fullName}
                              </Text>
                              <Text className="flex items-center text-xs opacity-60">
                                <View className="mr-2">
                                  <Ionicons name="id-card" />
                                </View>
                                {iv?.sale?.client?.nif}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    )
                  : null}
              </ScrollView>
            </View>
            {(Object.keys(ordersList.products).length ||
              Object.keys(ordersList.services).length) &&
            watch("documentType") &&
            watch("documentType") != "RECEIPT" ? (
              <View
                className={`flex ${
                  type !== "PHONE" ? "p-4 w-[400px]" : "p-4"
                } flex-col bg-white shadow-sm rounded-lg mt-4`}
              >
                <View className="flex flex-row mb-6">
                  <View className="flex-1">
                    <Text className="font-bold text-lg">Pedidos</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setNewItems([]);
                      setDeletedItems([]);
                      setPayments([]);
                      if (selectedInvoice?.id)
                        setOrders(selectedInvoice?.sale?.orders ?? []);
                    }}
                  >
                    <View className="flex flex-row gap-x-2">
                      <AntDesign name="back" />
                      <Text className="ml-2">Refazer</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <Orders
                  canDelete={watch("documentType") === "CREDIT_NOTE"}
                  canRemove={watch("documentType") === "CREDIT_NOTE"}
                  canAdd={watch("documentType") === "DEBIT_NOTE"}
                  list={Object.keys(ordersList.products)
                    .map((item) => ({
                      qtd: ordersList.products[item].qtd,
                      total: ordersList.products[item].total,
                      extra: ordersList.products[item].extra,
                    }))
                    .concat(
                      Object.keys(ordersList.services).map((item) => ({
                        qtd: ordersList.services[item].qtd,
                        total: ordersList.services[item].total,
                        extra: ordersList.services[item].extra,
                      }))
                    )}
                  deletedList={deletedItems.map((item) => {
                    return item.id;
                  })}
                  addItem={handleAddOrder}
                  removeItem={handleRemoveOrder}
                  deleteItem={handleDeleteOrder}
                />
              </View>
            ) : null}
          </View>
          <View
            className={`${
              type !== "PHONE" ? "flex-[2] p-6" : "p-4"
            } bg-white shadow-sm rounded-lg`}
          >
            <View className="p-6 items-center justify-center">
              <Text className={`${type !== "PHONE" ? "text-6xl" : "text-2xl"}`}>
                {formatMoney(newTotal)}
              </Text>
              <Text className="mt-2 text-xs text-primary-500">Valor total</Text>
            </View>
            <View>
              <View>
                <Text className="font-semibold text-base mb-2">Cliente</Text>
              </View>
              <View
                className={`flex ${
                  type !== "PHONE" ? "flex-row gap-x-4" : "flex-col gap-y-10"
                }`}
              >
                <View className="flex-1">
                  <Input
                    placeholder="Nome do cliente"
                    value={
                      multiFieldValue
                        ? selectedInvoice?.sale?.client?.fullName?.toString()
                        : ""
                    }
                    editable={false}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    placeholder="Contribuente"
                    value={
                      multiFieldValue
                        ? selectedInvoice?.sale?.client?.nif?.toString()
                        : ""
                    }
                    editable={false}
                  />
                </View>
              </View>
              <View>
                <Text className="font-semibold text-base my-2">Documento</Text>
              </View>
              <View
                className={`flex ${
                  type !== "PHONE" ? "flex-row gap-x-4" : "flex-col gap-y-10"
                }`}
              >
                <View className="flex-1">
                  <Input
                    placeholder="Fatura nº FT XXXX/X"
                    value={
                      selectedInvoice && multiFieldValue
                        ? "Fatura nº FT " +
                          new Date(
                            selectedInvoice?.createdAt || ""
                          ).getFullYear() +
                          "/" +
                          multiFieldValue
                        : ""
                    }
                    editable={false}
                  />
                </View>
                <View className="flex flex-row flex-1 items-center">
                  <View className="flex-1">
                    <Controller
                      control={control}
                      render={({ field: { onChange, value }, formState }) => (
                        <Select
                          value={value}
                          placeholder="Tipo de documento (nenhum)"
                          items={
                            selectedInvoice?.status === "PAID"
                              ? [
                                  {
                                    label: "Nota de crédito",
                                    value: "CREDIT_NOTE",
                                  },
                                  {
                                    label: "Nota de débito",
                                    value: "DEBIT_NOTE",
                                  },
                                ]
                              : [
                                  {
                                    label: "Recibo",
                                    value: "RECEIPT",
                                  },
                                  {
                                    label: "Nota de crédito",
                                    value: "CREDIT_NOTE",
                                  },
                                  {
                                    label: "Nota de débito",
                                    value: "DEBIT_NOTE",
                                  },
                                ]
                          }
                          onValueChange={onChange}
                          errorMessage={formState.errors.state?.message}
                        />
                      )}
                      name="documentType"
                    />
                  </View>
                </View>
              </View>

              <View
                className={`flex ${
                  type !== "PHONE" ? "flex-row gap-x-4" : "flex-col gap-y-10"
                }`}
              >
                <View className="flex-1 flex flex-row items-center">
                  {store.saleType !== "PRODUCT" ? (
                    <View className="flex-1 mr-4">
                      <Controller
                        control={control}
                        render={({ field: { value, onChange }, formState }) => (
                          <Input
                            placeholder="Taxa de Retenção"
                            editable={
                              selectedInvoice?.status === "DRAFT" &&
                              watch("documentType") === "RECEIPT"
                                ? false
                                : true
                            }
                            value={value?.toString()}
                            onChangeText={(value) =>
                              onChange(Number(value ?? 0))
                            }
                            keyboardType="numbers-and-punctuation"
                            errorMessage={formState.errors.retention?.message}
                          />
                        )}
                        name="retention"
                      />
                    </View>
                  ) : null}
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
              </View>

              {watch("state") === "PAID" &&
              watch("documentType") !== "CREDIT_NOTE" ? (
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
                    errorMessage={formState.errors.observation?.message}
                  />
                )}
                name="observation"
              />
            </View>
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
                    Imprimir documento
                  </Text>
                </View>
              </Button>
              {watch("state") === "PAID" ? (
                <View className="flex flex-col mb-4">
                  {watch("documentType") === "RECEIPT" ? (
                    <View className="flex flex-row items-center gap-x-2">
                      <Text className="font-bold">Troco: </Text>
                      <Text>
                        {formatMoney(totalPaid - selectedInvoice?.amount)}
                      </Text>
                    </View>
                  ) : null}
                  {watch("documentType") === "CREDIT_NOTE" ? (
                    <View className="flex flex-row items-center gap-x-2">
                      <Text className="font-bold">Valor subtraído: </Text>
                      <Text>
                        {formatMoney(selectedInvoice?.amount - newTotal)}
                      </Text>
                    </View>
                  ) : null}
                  {watch("documentType") === "DEBIT_NOTE" ? (
                    <View className="flex flex-col gap-y-2">
                      <View className="flex flex-row items-center gap-x-2 m">
                        <Text className="font-bold">
                          {totalPaid - newTotal > 0 ? "Troco:" : "Faltou:"}{" "}
                        </Text>
                        <Text>{formatMoney(totalPaid - newTotal)}</Text>
                      </View>
                      <View className="flex flex-row items-center gap-x-2">
                        <Text className="font-bold">Valor adicionado: </Text>
                        <Text>
                          {formatMoney(newTotal - selectedInvoice?.amount)}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  <View className="flex flex-row mt-2 items-center gap-x-2">
                    <Text className="font-bold">Valor pago:</Text>
                    <Text>
                      {watch("documentType") !== "CREDIT_NOTE"
                        ? formatMoney(totalPaid)
                        : formatMoney(selectedInvoice?.amount)}
                    </Text>
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

export default Documents;
