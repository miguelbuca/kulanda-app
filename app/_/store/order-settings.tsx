// import component
import { Button, Input } from "@/src/components";
import { formatMoney } from "@/src/utils/format-money";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const OrderSettings = () => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView horizontal={false}>
        <View className="flex-1 flex-col p-8">
          <View className="flex flex-col">
            <Text className="text-base mb-2 ml-3 font-semibold">Desconto</Text>
            <Input
              placeholder={formatMoney(0)}
              clearButtonMode="while-editing"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-8">
        <Button>
          <Text className="text-white text-base">
            <Text className="text-lg font-bold">Aplicar</Text>
          </Text>
        </Button>
      </View>
    </View>
  );
};
export default OrderSettings;
