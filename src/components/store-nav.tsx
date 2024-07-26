import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/tailwind.config";

import { useNavigation, useRouter } from "expo-router";
import { useAuth } from "../hooks/use-auth";
import { storage } from "../services";
import { useDevice } from "../hooks/use-device";
import { useNav } from "../hooks/use-nav";

export type Tab = "PROFILE" | "MAIN" | "CHART" | "SCAN" | "SETTINGS";

export interface IStoreNavStore {
  currentTab: Tab;
  tintColor: string;
  setCurrentTab(value: Tab): void;
}

const tintColor = theme?.extend.colors.primary[500];

export const StoreNav = () => {
  const { user } = useAuth();
  const { ativeTab: currentTab, setActiveTab: setCurrentTab } = useNav();
  const route = useRouter();
  const { type } = useDevice();

  const logOut = useCallback(() => {
    storage.deleteValueFor("x-tenant-username");
    storage.deleteValueFor("x-tenant-key");
    storage.deleteValueFor("_kt");
    route.replace("/");
  }, [storage]);

  return (
    <SafeAreaView className="relative flex-1 border-r border-r-gray-200">
      <View className="flex-1 flex flex-col px-4 divide-y divide-gray-200">
        <View
          className={`py-4 ${type === "TABLET" ? "h-[60px]" : "h-[60px]"} w-10`}
        >
          <View className="flex flex-1 items-center justify-center">
            <Image
              className="w-8 h-8"
              source={require("@/assets/images/icon.png")}
            />
          </View>
        </View>
        <View className="flex-1 py-8">
          <View className="flex-1 flex-col items-center gap-y-8">
            <TouchableOpacity
              onPress={() => {
                setCurrentTab("MAIN");
                route.push("/_/store/main");
              }}
            >
              <View>
                <Ionicons
                  name={
                    currentTab === "MAIN" ? "storefront" : "storefront-outline"
                  }
                  size={25}
                  color={currentTab === "MAIN" ? tintColor : "rgba(0,0,0,0.5)"}
                />
                {currentTab === "MAIN" && (
                  <View
                    style={{
                      backgroundColor: tintColor,
                    }}
                    className="absolute -right-[30px] w-2 -bottom-1 h-9"
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCurrentTab("SCAN");
                route.push("/_/store/main/scan");
              }}
            >
              <View>
                <Ionicons
                  name={currentTab === "SCAN" ? "qr-code" : "qr-code-outline"}
                  size={25}
                  color={currentTab === "SCAN" ? tintColor : "rgba(0,0,0,0.5)"}
                />
                {currentTab === "SCAN" && (
                  <View
                    style={{
                      backgroundColor: tintColor,
                    }}
                    className="absolute -right-[30px] w-2 -bottom-1 h-9"
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCurrentTab("CHART");
                route.push("/_/store/main/chart");
              }}
            >
              <View>
                <Ionicons
                  name={
                    currentTab === "CHART" ? "pie-chart" : "pie-chart-outline"
                  }
                  size={25}
                  color={currentTab === "CHART" ? tintColor : "rgba(0,0,0,0.5)"}
                />
                {currentTab === "CHART" && (
                  <View
                    style={{
                      backgroundColor: tintColor,
                    }}
                    className="absolute -right-[30px] w-2 -bottom-1 h-9"
                  />
                )}
              </View>
            </TouchableOpacity>
            {["OWNER", "MANAGER"].includes(user.access) && (
              <TouchableOpacity
                onPress={() => {
                  setCurrentTab("SETTINGS");
                  route.push("/_/store/main/settings");
                }}
              >
                <View>
                  <Ionicons
                    name={
                      currentTab === "SETTINGS"
                        ? "settings"
                        : "settings-outline"
                    }
                    size={25}
                    color={
                      currentTab === "SETTINGS" ? tintColor : "rgba(0,0,0,0.5)"
                    }
                  />
                  {currentTab === "SETTINGS" && (
                    <View
                      style={{
                        backgroundColor: tintColor,
                      }}
                      className="absolute -right-[30px] w-2 -bottom-1 h-9"
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setCurrentTab("PROFILE");
                route.push("/_/store/main/profile");
              }}
            >
              <View>
                <Ionicons
                  name={currentTab === "PROFILE" ? "person" : "person-outline"}
                  size={25}
                  color={
                    currentTab === "PROFILE" ? tintColor : "rgba(0,0,0,0.5)"
                  }
                />
                {currentTab === "PROFILE" && (
                  <View
                    style={{
                      backgroundColor: tintColor,
                    }}
                    className="absolute -right-[30px] w-2 -bottom-1 h-9"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="py-8">
          <View className="flex items-center gap-y-8">
            <TouchableOpacity onPress={logOut}>
              <View className="opacity-50">
                <Ionicons name="log-out-outline" size={25} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
