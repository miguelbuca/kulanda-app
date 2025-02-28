import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { CategoryForm } from "@/src/components";
const Update = () => {
  const params = useLocalSearchParams();

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <CategoryForm categoryId={params.slug as string} />
    </View>
  );
};

export default Update;
