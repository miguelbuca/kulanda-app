import {
  View,
  Text,
  TouchableOpacityProps,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";

export const Button = ({
  isLoading,
  children,
  className,
  ...props
}: TouchableOpacityProps & { isLoading?: boolean }) => {
  return (
    <TouchableOpacity disabled={isLoading} {...props}>
      <View
        className={`bg-primary-500 h-14 py-3 w-full flex items-center justify-center rounded-xl ${className}`}
      >
        {!isLoading ? (
          typeof children === "string" ? (
            <Text className="font-bold text-white text-base">{children}</Text>
          ) : (
            <View className="mx-5">{children}</View>
          )
        ) : (
          <ActivityIndicator size={"small"} color={"#ffffff"} />
        )}
      </View>
    </TouchableOpacity>
  );
};
