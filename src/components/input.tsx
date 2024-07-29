import {
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewProps,
  Pressable,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import CurrencyInput, { CurrencyInputProps } from "react-native-currency-input";

import PhoneInput from "react-native-phone-input";

import RNDateTimePicker, {
  DateTimePickerProps,
} from "react-native-modal-datetime-picker";

import { useColorScheme } from "nativewind";
import {
  formatNumber,
  isPossibleNumber,
  parseNumber,
  parsePhoneNumber,
} from "libphonenumber-js";

export interface InputProps extends TextInputProps {
  errorMessage?: string;
  leftElement?: JSX.Element;
  currencyProps?: CurrencyInputProps;
  isPhone?: boolean;
}
export const Input = ({
  leftElement,
  currencyProps,
  errorMessage,
  className,
  isPhone,
  ...args
}: InputProps) => {
  return (
    <>
      <View
        className={`bg-[#f8f8f8] my-2 flex flex-row items-center border ${
          errorMessage ? `border-red-500` : `border-transparent`
        } rounded-lg focus:border focus:rounded-lg focus:border-primary-500 ${className}`}
      >
        {leftElement ? <View className="ml-2">{leftElement}</View> : null}
        {!currencyProps && !isPhone ? (
          <TextInput
            placeholderTextColor={"#aeaeae"}
            className={`h-12 px-4 text-black flex-1 rounded-lg dark:text-white`}
            {...args}
          />
        ) : currencyProps ? (
          <CurrencyInput
            className="h-12 px-4 flex-1 rounded-lg dark:text-white"
            {...(args as any)}
            {...(currencyProps as any)}
          />
        ) : (
          <PhoneInput
            textProps={
              args.value
                ? {
                    value: isPossibleNumber(args.value)
                      ? parsePhoneNumber(args.value ?? "").formatInternational()
                      : args.value,
                  }
                : undefined
            }
            initialCountry="ao"
            className="h-12 px-2 flex-1 rounded-lg dark:text-white"
            autoFormat
            onChangePhoneNumber={(value) => {
              if (!value) return;
              args?.onChangeText?.(value?.split(" ").join(""));
            }}
          />
        )}
      </View>
      {errorMessage && (
        <Text className="text-red-600 text-[10px] my-2">{errorMessage}</Text>
      )}
    </>
  );
};

export const InputDataPicker = ({
  label,
  leftElement,
  errorMessage,
  onChange,
  value,
  ...args
}: Omit<DateTimePickerProps, "onConfirm" | "onCancel"> & {
  label?: string;
  value?: Date;
} & Pick<InputProps, "leftElement" | "errorMessage">) => {
  const { colorScheme } = useColorScheme();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    onChange?.(date);
    hideDatePicker();
  };

  return (
    <View className="my-2">
      <Pressable
        onPress={showDatePicker}
        className="bg-[#f8f8f8] rounded-lg  h-12 px-2 flex-row  items-center"
      >
        {leftElement ? <View className="mr-2">{leftElement}</View> : null}
        {label || value ? (
          <View className="flex-1 mr-2">
            <Text
              className={`${
                value ? "text-black" : "text-[#aeaeae]"
              } text-[16px]`}
            >
              {value?.toLocaleDateString() || label}
            </Text>
          </View>
        ) : null}
       { <RNDateTimePicker
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          collapsable={false}
          {...args}
          themeVariant={colorScheme}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />}
      </Pressable>
      {errorMessage && (
        <Text className="text-red-600 text-[10px] my-2">{errorMessage}</Text>
      )}
    </View>
  );
};
