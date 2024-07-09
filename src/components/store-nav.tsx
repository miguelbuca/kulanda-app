import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/tailwind.config";

import { useRouter } from "expo-router";

type Tab = "Profile" | "Main" | "Chart" | "Scan";

export interface IStoreNavStore {
  currentTab: Tab;
  tintColor: string;
  setCurrentTab(value: Tab): void;
}

const tintColor = theme?.extend.colors.primary[500];

export const StoreNav = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("Main");
  const route = useRouter();

  return (
    <SafeAreaView className="relative flex-1 border-r border-r-gray-200">
      <View className="flex-1 flex flex-col px-4 divide-y divide-gray-200">
        <View className="py-8 h-[80px] w-10 mt-8">
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
                setCurrentTab("Main");
                route.push("/_/store/main");
              }}
            >
              <View>
                <Ionicons
                  name={
                    currentTab === "Main" ? "storefront" : "storefront-outline"
                  }
                  size={25}
                  color={currentTab === "Main" ? tintColor : "rgba(0,0,0,0.5)"}
                />
                {currentTab === "Main" && (
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
                setCurrentTab("Scan");
              }}
            >
              <View>
                <Ionicons
                  name={currentTab === "Scan" ? "qr-code" : "qr-code-outline"}
                  size={25}
                  color={currentTab === "Scan" ? tintColor : "rgba(0,0,0,0.5)"}
                />
                {currentTab === "Scan" && (
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
                setCurrentTab("Chart");
                route.push("/_/store/chart");
              }}
            >
              <View>
                <Ionicons
                  name={
                    currentTab === "Chart" ? "pie-chart" : "pie-chart-outline"
                  }
                  size={25}
                  color={currentTab === "Chart" ? tintColor : "rgba(0,0,0,0.5)"}
                />
                {currentTab === "Chart" && (
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
                setCurrentTab("Profile");
                route.push("/_/store/profile");
              }}
            >
              <View>
                <Ionicons
                  name={currentTab === "Profile" ? "person" : "person-outline"}
                  size={25}
                  color={
                    currentTab === "Profile" ? tintColor : "rgba(0,0,0,0.5)"
                  }
                />
                {currentTab === "Profile" && (
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
            <TouchableOpacity>
              <View className="opacity-50">
                <Ionicons name="settings-outline" size={25} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
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
