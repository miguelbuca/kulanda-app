import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { CategoryForm } from "@/src/components";

const Add = () => {
  return (
    <View className="flex-1 bg-gray-50 p-6">
      <CategoryForm />
    </View>
  );
};

export default Add;
