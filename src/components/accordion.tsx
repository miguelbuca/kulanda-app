import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export interface AccordionProps extends ViewProps {
  title: ReactNode;
  icon?: ReactNode;
  withAddEvent?(): void;
}

export const Accordion = ({
  withAddEvent,
  title,
  icon,
  children,
  ...args
}: PropsWithChildren<AccordionProps>) => {
  const [height, setHeight] = useState<"auto" | number>(0);

  const toggle = () => setHeight((prev) => (prev === "auto" ? 0 : "auto"));

  return (
    <View className="p-3 shadow-sm bg-white rounded-lg mb-3" {...args}>
      <TouchableOpacity onPress={toggle}>
        {typeof title === "string" ? (
          <View
            className={`flex flex-row items-center py-2 ${
              height ? "border-b" : ""
            } border-gray-200`}
          >
            {icon && icon}
            <Text className="font-semibold ml-3">{title}</Text>
            {withAddEvent && (
              <View className="flex-1 justify-center items-end">
                <TouchableOpacity onPress={withAddEvent}>
                  <View className="flex h-8 w-8 bg-blue-500 items-center justify-center rounded-lg">
                    <Ionicons name="add-outline" color={"#ffffff"} size={18} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View className="flex flex-row items-center py-2">{title}</View>
        )}
      </TouchableOpacity>
      {height ? (
        <View>
          <View className=" py-2">{children}</View>
        </View>
      ) : null}
    </View>
  );
};
