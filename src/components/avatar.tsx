import { View, Text } from "react-native";
import React, { useMemo } from "react";

export interface AvatarProps {
  user: UserType;
}

const Avatar = ({ user }: AvatarProps) => {
  const letters = useMemo(() => {
    const arr = user.fullName?.split(" ");
    return `${arr?.[0]?.[0]}${arr?.[arr.length - 1]?.[0]}`;
  }, [user]);

  return (
    <View className="h-24 w-24 bg-primary-600 border-4 border-primary-100 items-center justify-center rounded-full">
      <Text className="text-primary-100 font-black text-3xl">{letters}</Text>
    </View>
  );
};

export default Avatar;
