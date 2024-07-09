import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../services";
import { useNavigation, useRouter } from "expo-router";
import { StackActions } from "@react-navigation/native";

export interface ProfileTabProps {
  index?: number;
}

export const ProfileTab = ({ index }: ProfileTabProps) => {
  const navigation = useNavigation();
  const logOut = useCallback(() => {
    storage.deleteValueFor("_kt").then(() => {
      navigation.dispatch(StackActions.replace("index"));
    });
  }, [storage]);

  return index === 0 ? (
    <View className="flex flex-1 flex-col">
      <View className="flex-1">
        <Text>Geral</Text>
      </View>
      <View className="flex border-t border-t-gray-200 py-4">
        <TouchableOpacity onPress={logOut}>
          <View className="flex flex-row items-center ">
            <View className="mr-4">
              <Ionicons
                name="log-out-outline"
                size={23}
                color={"rgb(239 68 68)"}
              />
            </View>
            <Text className="text-red-500 text-base">Terminar sessão</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View>
      <Text>Editar</Text>
    </View>
  );
};
