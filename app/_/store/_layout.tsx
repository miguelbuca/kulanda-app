import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, Tabs } from "expo-router";
import { Order, StoreNav } from "@/src/components";
import { GET_STORE, GET_USER } from "@/src/graphql/queries";
import { useQuery } from "@apollo/client";
import { client } from "@/src/api/client";
import { useStore } from "@/src/hooks/use-store";

import { StatusBar } from "expo-status-bar";
import { theme } from "@/tailwind.config";
import { Ionicons } from "@expo/vector-icons";
import { useDevice } from "@/src/hooks/use-device";
import { useAuth } from "@/src/hooks/use-auth";
import { useOrder } from "@/src/hooks/use-order";

const StoreLayout = () => {
  const { user } = useAuth();
  const { store, setStore } = useStore();
  const { type } = useDevice();

  useQuery(GET_STORE, {
    client: client,
    variables: {
      id: store.id,
    },
    onCompleted: (data) => {
      setStore({
        ...data.getStore,
      });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  return (
    <>
      {type !== "PHONE" ? (
        <View className="flex-1 flex-row bg-white">
          <View className="divide-x-4 divide-emerald-400">
            <StoreNav />
          </View>
          <View className="flex-1">
            <Stack
              initialRouteName="main"
              screenOptions={{
                headerShown: false,
                animation: "fade_from_bottom",
              }}
            >
              <Stack.Screen
                name="settings"
                options={{
                  title: "Gestão do estabelecimento",
                  headerShown: true,
                }}
              />
            </Stack>
          </View>
        </View>
      ) : (
        <>
          <Tabs
            initialRouteName="main"
            screenOptions={{
              tabBarActiveTintColor: theme.extend.colors.primary[500],
              tabBarShowLabel: false,
              headerShown: true,
            }}
          >
            <Tabs.Screen
              name="main"
              options={{
                headerLeft: () => (
                  <View className="flex items-center justify-center ml-4">
                    <Image
                      className="w-5 h-5"
                      source={require("@/assets/images/icon.png")}
                    />
                  </View>
                ),
                headerTitle: () => (
                  <View className="flex-1 flex flex-col mb-0.5 items-center justify-center">
                    <Text className="text-md font-semibold">
                      {store.designation}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Text className="flex items-center text-[9px]  font-semibold opacity-30">
                        <Ionicons name="lock-closed-outline" /> {user.access}
                      </Text>
                      <Text className="flex items-center text-[9px] font-semibold text-primary-500">
                        {" - "}
                        {user.fullName}
                      </Text>
                    </View>
                  </View>
                ),
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                    name={focused ? "storefront" : "storefront-outline"}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="chart"
              options={{
                title: "Relatório de Vendas",
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                    name={focused ? "pie-chart" : "pie-chart-outline"}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="scan"
              options={{
                title: "Leia o QrCode",
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                    name={focused ? "qr-code" : "qr-code-outline"}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                headerShown: true,
                title: "Gestão do estabelecimento",
                tabBarItemStyle: {
                  display: ["OWNER", "MANAGER"].includes(user.access)
                    ? "flex"
                    : "none",
                },
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                    name={focused ? "settings" : "settings-outline"}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Minha conta",
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                    name={focused ? "person" : "person-outline"}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </Tabs>
        </>
      )}
      <StatusBar style="dark" />
    </>
  );
};

export default StoreLayout;
