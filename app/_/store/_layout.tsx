import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { StoreNav } from "@/src/components";
import { useDevice } from "@/src/hooks/use-device";

const StoreLayout = () => {
  const { type } = useDevice();

  return (
    <View className="flex-1 flex-row bg-white">
      {type !== "PHONE" ? (
        <View className="divide-x-4 divide-gray-400">
          <StoreNav />
        </View>
      ) : null}
      <Stack
        screenOptions={{
          headerShown: false,
          presentation: "formSheet",
        }}
      >
        <Stack.Screen
          name="main"
          options={{
            presentation: undefined,
          }}
        />
        <Stack.Screen
          name="invoice"
          options={{
            presentation: undefined,
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            title: "Efectuar pagamento",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="payment-status"
          options={{
            headerShown: true,
          }}
        />
      </Stack>
    </View>
  );
};

export default StoreLayout;
