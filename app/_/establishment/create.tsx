import { View, Text, ScrollView } from "react-native";
import React from "react";
import { StoreForm } from "@/src/components/store-form";

const create = () => {
  return (
    <View className="flex p-6 flex-1 bg-gray-50">
      <StoreForm />
    </View>
  );
};

export default create;
