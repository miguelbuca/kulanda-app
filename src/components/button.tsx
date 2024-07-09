import {
  View,
  Text,
  TouchableOpacityProps,
  TouchableOpacity,
} from "react-native";
import React from "react";

export const Button = ({
  children,
  className,
  ...props
}: TouchableOpacityProps) => {
  return (
    <TouchableOpacity {...props}>
      <View
        className={`bg-primary-500 py-4 w-full flex items-center justify-center rounded-xl ${className}`}
      >
        {typeof children === "string" ? (
          <Text className="font-bold text-white text-base">{children}</Text>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
};
