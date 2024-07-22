import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { UserForm } from "@/src/components";
import { useAuth } from "@/src/hooks/use-auth";

const Update = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    if (params.slug === user.id)
      navigation.setOptions({
        title: "Editar informações",
      });
  }, [user, params]);

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <UserForm userId={params.slug as string} />
    </View>
  );
};

export default Update;
