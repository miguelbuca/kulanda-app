import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useRef, useState } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import Avatar from "@/src/components/avatar";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

import { storage } from "@/src/services";
import { SplashScreen, useRouter } from "expo-router";
import { Modalize } from "react-native-modalize";

const Switch = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<CompanyType>();
  const modalizeRef = useRef<Modalize>(null);

  return (
    <SafeAreaView
      onLayout={() => {
        SplashScreen.hideAsync();
      }}
      className="
    flex flex-col flex-1 bg-white"
    >
      <View className="flex flex-row items-center p-6 gap-x-8 border-b border-b-gray-50">
        <View>
          <Avatar user={user} />
        </View>
        <View className="flex-1 flex flex-col">
          <Text className="text-3xl">{user.fullName}</Text>
          <Text className="text-xs opacity-80">{user.email ?? user.phone}</Text>
        </View>
        <View>
          <TouchableOpacity>
            <View className="opacity-50">
              <Ionicons name="log-out-outline" size={30} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-col flex-1 bg-gray-50">
        <View className="flex-1 flex flex-col">
          <Text className="ml-8 mt-8 text-2xl opacity-30">Empresas</Text>
          <FlatList
            className="flex-1 h-full p-6"
            numColumns={3}
            data={user.companies}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  width: "33.3%",
                }}
                onPress={() => {
                  setSelectedCompany(item);
                  modalizeRef.current?.open();
                }}
                key={index}
              >
                <View className="flex flex-col bg-white w-full  shadow-2xl rounded-md overflow-hidden">
                  <View className="p-2">
                    <Image
                      className="h-48 w-full rounded-md"
                      source={{
                        uri: item.logo,
                      }}
                    />
                  </View>
                  <View className="p-4 gap-y-2">
                    <Text className="text-base font-semibold">{item.name}</Text>
                    <Text className="text-sm opacity-80">{item.cae?.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <Modalize ref={modalizeRef}>
        <FlatList
          data={selectedCompany?.stores}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                storage.save("_kst", item);
                modalizeRef.current?.open();
                push("/_/store/main");
              }}
              key={index}
            >
              <View
                className={`flex flex-col p-6 px-9 border-b ${
                  index !== (selectedCompany?.stores ?? [])?.length - 1
                    ? "border-b-gray-100"
                    : "border-b-transparent mb-2"
                }`}
              >
                <View className="flex flex-row gap-x-1">
                  <Text className="text-lg font-semibold">
                    {item.designation}
                  </Text>
                </View>
                <View className="flex flex-col opacity-50">
                  <View className="flex flex-row mt-3 items-center gap-x-2">
                    <Ionicons name="pin-outline" size={20} />
                    <Text className="text-md">{item.address}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </Modalize>
    </SafeAreaView>
  );
};

export default Switch;
