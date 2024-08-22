import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useDevice } from "../hooks/use-device";
import { useStore } from "../hooks/use-store";

export type SwitchServiceOrProducType = "PRODUCT" | "SERVICE" | "DEFAULT";

export interface SwitchServiceOrProductProps {
  onTypeChange?: (value: SwitchServiceOrProducType) => void;
}

export const SwitchServiceOrProduct = ({
  onTypeChange,
}: SwitchServiceOrProductProps) => {
  const { type: device } = useDevice();
  const { store } = useStore();
  const [type, setType] = useState<SwitchServiceOrProducType>(
    store.saleType ?? "DEFAULT"
  );

  useEffect(() => {
    onTypeChange?.(type);
  }, [type]);

  if (store.saleType !== "DEFAULT") return null;

  return (
    <View
      className={`flex flex-row w-[200px]  rounded-[100px] p-2 ${
        device === "PHONE" ? "bg-white shadow-lg" : "bg-white shadow-sm"
      }`}
    >
      <TouchableOpacity
        style={{
          flex: 1,
        }}
        onPress={() => setType("PRODUCT")}
      >
        <View
          className={`flex-1 flex items-center justify-center ${
            type === "PRODUCT" && "bg-primary-500"
          } py-2 px-3 rounded-[100px]`}
        >
          <Text
            className={`${
              type === "PRODUCT" ? "text-white font-semibold" : "text-black"
            } `}
          >
            Produtos
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
        }}
        onPress={() => setType("SERVICE")}
      >
        <View
          className={`flex-1 flex items-center justify-center ${
            type === "SERVICE" && "bg-primary-500"
          } py-2 px-3 rounded-[100px]`}
        >
          <Text
            className={`${
              type === "SERVICE" ? "text-white font-semibold" : "text-black"
            }`}
          >
            Serviços
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
