import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";

const PaymentLayout = () => {
  return (
    <View className="flex-1 flex-row bg-white">
      <Stack>
        <Stack.Screen
          options={{
            title: "Comprovativo",
          }}
          name="[slug]"
        />
      </Stack>
    </View>
  );
};

export default PaymentLayout;
