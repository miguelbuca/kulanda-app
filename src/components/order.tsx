import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { formatMoney } from "../utils/format-money";
import { Orders } from "./orders";
import { useOrder } from "../hooks/use-order";
import { useRouter } from "expo-router";
import { Button } from "./button";
import { useDevice } from "../hooks/use-device";

export interface OrderProps {
  onClose?(): void;
}

export const Order = ({ onClose }: OrderProps) => {
  const { subtotalPrice, totalPrice, totalTaxes } = useOrder();
  const { type } = useDevice();

  const router = useRouter();

  return (
    <SafeAreaView
      className={
        type === "PHONE"
          ? "flex flex-col"
          : `flex flex-col bg-white border-l border-l-gray-200 ${
              type !== "DESKTOP" ? "w-[350px]" : "w-[400px]"
            }`
      }
    >
      <View className={type === "PHONE" ? "mt-0" : "mt-6"}>
        <View className="flex items-center flex-row p-6">
          <View className="flex-1">
            <Text className="font-bold text-lg">Pedidos atuais</Text>
          </View>
        </View>
      </View>
      <View className="flex-1 px-6">
        <Orders />
      </View>
      <View className="flex flex-col p-6 gap-y-4">
        <View className="flex flex-col">
          <View className="flex flex-col p-4 bg-gray-100 rounded-t-2xl gap-y-2">
            <View className="flex items-center flex-row justify-between rounded-2xl">
              <View>
                <Text className="text-base opacity-50">Subtotal</Text>
              </View>
              <View>
                <Text className="text-base">{formatMoney(subtotalPrice)}</Text>
              </View>
            </View>
            <View className="flex items-center flex-row justify-between rounded-2xl">
              <View>
                <Text className="text-base opacity-50">Total de tributos</Text>
              </View>
              <View>
                <Text className="text-base">{formatMoney(totalTaxes)}</Text>
              </View>
            </View>
          </View>
          <View className="flex items-center flex-row justify-between p-4 border-t border-t-gray-200/80 bg-gray-100 rounded-b-2xl">
            <View>
              <Text className="text-xl">Total</Text>
            </View>
            <View>
              <Text className="text-xl font-black">
                {formatMoney(totalPrice)}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-col">
          <Button
            onPress={() => {
              onClose?.();
              router.push("_/store/payment");
            }}
            className="flex-row items-center justify-center"
          >
            Efectuar pagamento
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
