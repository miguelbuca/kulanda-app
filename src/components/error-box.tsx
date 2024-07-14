import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

export interface ErrorBoxProps {
  title?: string;
  message: string;
}

export const ErrorBox = ({ title, message }: ErrorBoxProps) => {
  return (
    <View
      className={`flex items-center w-full bg-red-500/60 border-[1.5px] border-red-500/70 ${
        title
          ? "flex-col justify-center pt-[9px] pb-[10px] rounded-[21px]"
          : "flex-row px-[16px] py-[4px] rounded-[11px]"
      }`}
    >
      <Ionicons color={"#ffffff"} name="warning-outline" size={23} />
      {title && (
        <Text className="font-montserrat-700 text-[14px] text-white my-[16px] text-center">
          {title}
        </Text>
      )}
      <Text
        className={`font-montserrat-500 text-[14px] text-white ${
          title ? "text-center" : "ml-[14px]"
        }`}
      >
        {message}
      </Text>
    </View>
  );
};
