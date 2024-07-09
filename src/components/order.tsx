import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { formatMoney } from "../utils/format-money";
import { Orders } from "./orders";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../hooks/use-order";
import { useRouter } from "expo-router";
import { Button } from "./button";
import { useDevice } from "../hooks/use-device";

export interface OrderProps {
  onClose?(): void;
}

export const Order = ({ onClose }: OrderProps) => {
  const { subtotalPrice, totalPrice } = useOrder();
  const { type } = useDevice();
  const router = useRouter();

  return (
    <SafeAreaView
      className={
        type === "PHONE"
          ? "flex flex-col "
          : "flex flex-col bg-white border-l border-l-gray-200 max-w-[350px]"
      }
    >
      <View className={type === "PHONE" ? "mt-0" : "mt-6"}>
        <View className="flex items-center flex-row p-6">
          <View className="flex-1">
            <Text className="font-bold capitalize text-lg">Pedidos atuais</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("./order-settings")}>
            <View className="flex items-center justify-center p-2 bg-gray-100 rounded-lg">
              <Ionicons name="cog-outline" size={22} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 px-6">
        <Orders />
      </View>
      <View className="flex flex-col p-6 gap-y-4">
        <View className="flex flex-col">
          <View className="flex flex-col p-4 bg-gray-100 rounded-2xl gap-y-2">
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
                <Text className="text-base">-</Text>
              </View>
            </View>
          </View>
          <View className="flex items-center flex-row justify-between p-4 border-t border-t-gray-200/80 bg-gray-100 rounded-2xl">
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
              router.push("_/payment");
            }}
            className="flex-row items-center justify-center"
          >
            Efectuar pagamento
          </Button>
          <Image
            className="h-6 mt-2 w-28 self-center"
            source={require("@/assets/images/multicaixa.png")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
