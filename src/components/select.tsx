import { View, Text } from "react-native";
import React from "react";
import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";
export interface SelectInputProps extends PickerSelectProps {
  errorMessage?: string;
  leftElement?: JSX.Element;
  placeholder?: string;
}
export const Select = ({
  leftElement,
  errorMessage,
  placeholder,
  ...args
}: SelectInputProps) => {
  return (
    <>
      <View
        className={`text-black bg-gray-100/50 outline-none my-2 flex flex-row items-center border ${
          errorMessage ? `border-red-500` : `border-transparent`
        } rounded-lg focus:border focus:rounded-lg focus:border-primary-500`}
      >
        {leftElement ? <View className="ml-2">{leftElement}</View> : null}
        <View className="flex-1">
          <RNPickerSelect
            placeholder={{
              label: placeholder || "Nenhum",
              value: undefined,
            }}
            style={{
              inputIOS: {
                width: "100%",
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: "transparent",
                color: "#000",
                paddingRight: 30,
                minHeight: 50,
              },
              inputAndroid: {
                fontSize: 16,
                paddingHorizontal: 12,
                paddingVertical: 12,
                backgroundColor: "transparent",
                color: "#000",
                paddingRight: 30,
                minHeight: 50,
              },
            }}
            {...args}
          />
        </View>
      </View>
      {errorMessage && (
        <Text className="text-red-600 my-2 text-[10px]">{errorMessage}</Text>
      )}
    </>
  );
};
