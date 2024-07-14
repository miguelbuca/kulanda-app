import { Text, TextInput, TextInputProps, View } from "react-native";
import React from "react";

export const Input = ({
  className,
  ...props
}: TextInputProps & { error?: string }) => {
  return (
    <View className="flex flex-1 flex-col">
      <TextInput
        placeholderTextColor={"#ccc"}
        className={`text-black bg-gray-100/50 outline-none text-base border p-3 ${
          props.error ? "border-red-400" : "border-gray-100"
        } focus:border-primary-500 rounded-xl ${className}`}
        {...props}
      />
      {props.error && (
        <Text className="my-2 text-xs text-red-400">{props.error}</Text>
      )}
    </View>
  );
};
