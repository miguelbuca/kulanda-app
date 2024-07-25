import { View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ProductForm } from "@/src/components";

const Update = () => {
  const params = useLocalSearchParams();

  return (
    <View className="flex-1 bg-gray-50">
      <ProductForm productId={params.slug as string} />
    </View>
  );
};

export default Update;
