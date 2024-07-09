import { TextInput, TextInputProps } from "react-native";
import React from "react";

export const Input = ({ className, ...props }: TextInputProps) => {
  return (
    <TextInput
      className={`text-black bg-gray-100/50 outline-none text-base border p-3 border-gray-100 focus:border-primary-500 rounded-xl ${className}`}
      {...props}
    />
  );
};
