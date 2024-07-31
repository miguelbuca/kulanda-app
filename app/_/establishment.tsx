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
import { GET_COMPANY } from "@/src/graphql/queries";
import { client } from "@/src/api/client";
import { useQuery } from "@apollo/client";
import { useStore } from "@/src/hooks/use-store";
import { Button } from "@/src/components";
import { useCompany } from "@/src/hooks/use-company";

const Switch = () => {
  const { replace } = useRouter();
  const { setStore } = useStore();
  const { company, setCompany } = useCompany();
  const [stores, setStores] = useState<StoreType[]>([]);

  useQuery(GET_COMPANY, {
    client: client,
    onCompleted(data) {
      if (!data.getCompany) {
        storage.deleteValueFor("x-tenant-username");
        storage.deleteValueFor("x-tenant-key");
        storage.deleteValueFor("_kt");
        return;
      }

      setCompany(data.getCompany);
      setStores(data.getCompany.stores || []);
    },
  });

  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync();
      }}
      className="flex flex-col flex-1 bg-gray-50"
    >
      <FlatList
        className="p-4"
        data={stores}
        ListHeaderComponent={() =>
          company?.id ? (
            <>
              <View className="flex flex-col items-center justify-center my-8 self-center">
                <View className="mb-3 p-3 bg-white rounded-full overflow-hidden">
                  <Image
                    className="h-24 w-24"
                    resizeMode="stretch"
                    source={{
                      uri: company?.logo,
                    }}
                  />
                </View>
                <Text className="text-base font-semibold text-primary-500">
                  {company?.name}
                </Text>
                <Text className="text-xs mt-2 font-light">
                  <Text className="font-normal">NIF: </Text>
                  {company?.nif}
                </Text>
              </View>
            </>
          ) : null
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setStore(item);
              replace("/_/store/main");
            }}
            key={index}
          >
            <View
              className={`bg-white shadow-sm flex flex-col p-6 px-9 border-b  ${
                index !== stores?.length - 1
                  ? "border-b-gray-100 rounded-t-xl"
                  : "border-b-transparent mb-2 rounded-b-xl"
              }`}
            >
              <View className="flex flex-row gap-x-1">
                <Text className="text-lg font-semibold">
                  {item.designation}
                </Text>
              </View>
              <View className="flex flex-col opacity-50">
                <View className="flex flex-row mt-3 items-center gap-x-2">
                  <Ionicons name="map-outline" size={12} />
                  <Text className="text-xs">{item.address}</Text>
                </View>
                <View className="flex flex-row mt-3 items-center gap-x-2">
                  <Ionicons name="call-outline" size={12} />
                  <Text className="text-xs">{item.phone}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Switch;
