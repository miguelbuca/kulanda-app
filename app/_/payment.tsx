import { View, Text, SafeAreaView } from "react-native";
import React, { useCallback } from "react";
import { useOrder } from "@/src/hooks/use-order";
import { formatMoney } from "@/src/utils/format-money";
import { Button, Input } from "@/src/components";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";


import { useMutation } from "@apollo/client";
import { CREATE_SALE } from "@/src/graphql/mutations";
import { client } from "@/src/api/client";
import { router } from "expo-router";

const Payment = () => {
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

  const [createSale] = useMutation(CREATE_SALE, {
    client: client,
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
      },
      onError(error) {
        console.log(error.graphQLErrors);
      },
      onCompleted({ createSale }) {
        reset();
        setLastSale?.(createSale);
        router.push("_/payment-status");
      },
    });
  }, [totalPrice, items, bankCard, change, cash, reset]);

  return (
    <SafeAreaView className="flex flex-col flex-1 p-6 bg-gray-100 gap-y-3">
      <ScrollView className="flex-1 p-6">
        <View className="p-6 items-center justify-center">
          <Text className="text-3xl">{formatMoney(subtotalPrice)}</Text>
          <Text className="mt-2 text-xs text-primary-500">Valor todal</Text>
        </View>
        <View>
          <View>
            <Text className="m-4 font-semibold">Dinheiro</Text>
            <Input
              onChangeText={(value) => setFormData?.(Number(value), "cash")}
              placeholder={formatMoney(0)}
              keyboardType="decimal-pad"
              className="bg-white"
            />
          </View>
          <View>
            <Text className="m-4 font-semibold">Multicaixa</Text>
            <Input
              onChangeText={(value) => setFormData?.(Number(value), "bankCard")}
              placeholder={formatMoney(0)}
              keyboardType="decimal-pad"
              className="bg-white"
            />
          </View>
          <View>
            <Text className="m-4 font-semibold">Troco</Text>
            <Input
              editable={false}
              value={change > 0 ? formatMoney(change) : undefined}
              placeholder={formatMoney(0)}
              keyboardType="decimal-pad"
              className="bg-white"
            />
          </View>
        </View>
      </ScrollView>
      <View className="p-6">
        <Button onPress={handleNewReceipt} className="bg-black">
          <View className="flex flex-row items-center">
            <Ionicons name="receipt-outline" size={25} color={"_ffffff"} />
            <Text className="ml-4 font-semibold text-white text-base">
              Gerar nova fatura
            </Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
