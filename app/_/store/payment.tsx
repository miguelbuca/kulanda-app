import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useOrder } from "@/src/hooks/use-order";
import { formatMoney } from "@/src/utils/format-money";
import { Button, Input } from "@/src/components";
import { ScrollView } from "react-native-gesture-handler";
import { Feather, Ionicons } from "@expo/vector-icons";

import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SALE } from "@/src/graphql/mutations";
import { client } from "@/src/api/client";
import { router, useNavigation, useRouter } from "expo-router";
import { GET_CLIENTS } from "@/src/graphql/queries";
import { useStore } from "@/src/hooks/use-store";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { useDevice } from "@/src/hooks/use-device";

const Payment = () => {
  const [multiFieldValue, setMultiFieldValue] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientType>();
  const {
    subtotalPrice,
    totalPrice,
    qtd,
    items,
    cash,
    bankCard,
    change,
    setFormData,
    setLastSale,
    reset,
  } = useOrder();

  const { type } = useDevice();

  const { store } = useStore();

  const [createSale] = useMutation(CREATE_SALE, {
    client: client,
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

  const handleNewReceipt = useCallback(async () => {
    const orders = qtd.map((id) => {
      const item = items.findLast((item) => item.id === id);

      return item?.category?.type === "PRODUCT"
        ? {
            productId: id,
          }
        : { serviceId: id };
    });

    createSale({
      variables: {
        bankCard,
        change,
        cash,
        totalPrice,
        orders,
        clientId: selectedClient?.id,
      },
      onError(error) {
        console.log(error.graphQLErrors);
      },
      onCompleted({ createSale }) {
        reset();
        setLastSale?.(createSale);
        router.push("_/store/payment-status");
      },
    });
  }, [totalPrice, items, bankCard, change, cash, reset]);

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
                    <Ionicons name="add" size={24} color={"#fff"} />
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
              <Text className="mt-2 text-xs text-primary-500">Valor todal</Text>
            </View>
            <View>
              <View>
                <Text className="m-4 font-semibold">Cliente</Text>
                <Input
                  className="focus:border-transparent"
                  placeholder="Nome do cliente"
                  editable={false}
                  value={selectedClient?.fullName}
                />
              </View>
              <View>
                <Text className="m-4 font-semibold">Dinheiro</Text>
                <Input
                  onChangeText={(value) => setFormData?.(Number(value), "cash")}
                  placeholder={formatMoney(0)}
                  keyboardType="decimal-pad"
                />
              </View>
              <View>
                <Text className="m-4 font-semibold">Multicaixa</Text>
                <Input
                  onChangeText={(value) =>
                    setFormData?.(Number(value), "bankCard")
                  }
                  placeholder={formatMoney(0)}
                  keyboardType="decimal-pad"
                />
              </View>
              <View>
                <Text className="m-4 font-semibold">Troco</Text>
                <Input
                  className="focus:border-transparent"
                  editable={false}
                  value={change > 0 ? formatMoney(change) : undefined}
                  placeholder={formatMoney(0)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View>
              <Button onPress={handleNewReceipt} className=" mt-5">
                <View className="flex flex-row items-center">
                  <Ionicons
                    name="receipt-outline"
                    size={25}
                    color={"#ffffff"}
                  />
                  <Text className="ml-4 font-semibold text-white text-base">
                    Gerar nova fatura
                  </Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Payment;
