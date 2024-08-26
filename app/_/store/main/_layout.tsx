import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import { GET_STORE } from "@/src/graphql/queries";
import { useQuery } from "@apollo/client";
import { client } from "@/src/api/client";
import { useStore } from "@/src/hooks/use-store";

import { StatusBar } from "expo-status-bar";
import { theme } from "@/tailwind.config";
import { Ionicons } from "@expo/vector-icons";
import { useDevice } from "@/src/hooks/use-device";
import { useAuth } from "@/src/hooks/use-auth";

import { Image } from "expo-image";
import { useAssets } from "expo-asset";
import { useNav } from "@/src/hooks/use-nav";

const StoreLayout = () => {
  const { user } = useAuth();
  const { store, setStore } = useStore();
  const { type } = useDevice();
  const { setActiveTab } = useNav();

  const [assets] = useAssets([require("@/assets/images/icon.png")]);

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
          <View className="flex-1">
            <Stack
              initialRouteName="index"
              screenOptions={{
                headerShown: false,
                animation: "fade_from_bottom",
              }}
              screenListeners={({ route }) => ({
                state: () => {
                  setActiveTab(
                    route?.name !== "index"
                      ? (route?.name?.toUpperCase() as any)
                      : "MAIN"
                  );
                },
              })}
            >
              <Stack.Screen
                name="settings"
                options={{
                  title: "Gestão do estabelecimento",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="profile"
                options={{
                  title: "Minha conta",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="chart"
                options={{
                  title: "Relatório de Vendas",
                  headerShown: true,
                }}
              />
            </Stack>
          </View>
        </View>
      ) : (
        <>
          <Tabs
            initialRouteName="index"
            screenOptions={{
              tabBarActiveTintColor: theme.extend.colors.primary[500],
              tabBarShowLabel: false,
              headerShown: true,
              headerTitleAlign: "center",
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                headerLeft: () => (
                  <View className="py-4 h-[60px] w-10">
                    <View className="flex flex-1 ml-4 items-center justify-center">
                      <Image
                        className="h-7 w-7"
                        source={{
                          uri: assets?.[0]?.uri,
                        }}
                      />
                    </View>
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
