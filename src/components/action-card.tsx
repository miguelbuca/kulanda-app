import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

export interface ActionCardProps extends TouchableOpacityProps {
  icon: ReactNode;
  description: string;
  title: string;
}

export const ActionCard = ({
  icon,
  description,
  title,
  ...args
}: ActionCardProps) => {
  return (
    <TouchableOpacity {...args}>
      <View className="flex flex-row items-center bg-white p-4 py-6 rounded-lg border transition-colors hover:bg-black/50 cursor-pointer border-primary-400">
        <View>
          {typeof icon === "string" ? (
            <Ionicons name={icon as any} size={44} />
          ) : (
            icon
          )}
        </View>
        <View className="ml-4">
          <Text className="text-lg text-primary-400">{title}</Text>
          <Text className="text-xs opacity-50">{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
