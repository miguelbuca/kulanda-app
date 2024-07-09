import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useOrder } from "../hooks/use-order";
import { formatMoney } from "../utils/format-money";
import { Button } from "./button";
import { Ionicons } from "@expo/vector-icons";
import { useDevice } from "../hooks/use-device";

export const Orders = () => {
  const { list, addItem, removeItem, deleteItem } = useOrder();
  const { type } = useDevice();

  if (type === null || type === undefined) return;

  return type !== "PHONE" ? (
    <FlatList
      data={list}
      renderItem={({ item, index }) => (
        <View key={index} className="flex flex-row items-end gap-4 mb-5">
          <View>
            <Image
              className="h-20 w-20 rounded-md"
              source={{
                uri: item.extra?.image,
              }}
            />
          </View>
          <View className="flex flex-1 flex-col ">
            <View className="flex flex-row flex-1 items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold">
                  {item.extra?.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => item.extra.id && deleteItem?.(item.extra.id)}
              >
                <View>
                  <Ionicons name="trash-outline" color={"red"} size={20} />
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row items-center">
              <Text className="text-md font-black text-primary-500">
                {formatMoney(Number(Number(item.total).toFixed(2)))}
              </Text>
              {item.extra?.category?.type === "PRODUCT" && (
                <View className="flex flex-row flex-1 items-center justify-end">
                  <TouchableOpacity
                    disabled={!!(item.qtd && item.qtd < 2)}
                    onPress={() => {
                      if (item.qtd && item.qtd < 2) return;
                      item.extra?.id && removeItem?.(item.extra.id);
                    }}
                  >
                    <View
                      className={`${
                        item.qtd && item.qtd < 2
                          ? "bg-primary-100"
                          : "bg-primary-500"
                      } h-6 w-6 rounded justify-start items-center`}
                    >
                      <Text className="text-white text-base font-black">-</Text>
                    </View>
                  </TouchableOpacity>
                  <View>
                    <Text className="mx-3 text-lg font-black">{item.qtd}</Text>
                  </View>
                  <TouchableOpacity
                    disabled={
                      !(item.qtd && (item.extra as any)?.stock > item.qtd)
                    }
                    onPress={() => {
                      if (item.qtd && (item.extra as any)?.stock > item.qtd)
                        item.extra && addItem?.(item.extra);
                    }}
                  >
                    <View
                      className={`${
                        !(item.qtd && (item.extra as any)?.stock > item.qtd)
                          ? "bg-primary-100"
                          : "bg-primary-500"
                      } h-6 w-6 rounded justify-start items-center`}
                    >
                      <Text className="text-white text-base font-black">+</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    />
  ) : (
    <View className="flex flex-col">
      {list.map((item, index) => (
        <View key={index} className="flex flex-row items-end gap-4 mb-5">
          <View>
            <Image
              className="h-20 w-20 rounded-md"
              source={{
                uri: item.extra?.image,
              }}
            />
          </View>
          <View className="flex flex-1 flex-col ">
            <View className="flex flex-row flex-1 items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold">
                  {item.extra?.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => item.extra.id && deleteItem?.(item.extra.id)}
              >
                <View>
                  <Ionicons name="trash-outline" color={"red"} size={20} />
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row items-center">
              <Text className="text-md font-black text-primary-500">
                {formatMoney(Number(Number(item.total).toFixed(2)))}
              </Text>
              {item.extra?.category?.type === "PRODUCT" && (
                <View className="flex flex-row flex-1 items-center justify-end">
                  <TouchableOpacity
                    disabled={!!(item.qtd && item.qtd < 2)}
                    onPress={() => {
                      if (item.qtd && item.qtd < 2) return;
                      item.extra?.id && removeItem?.(item.extra.id);
                    }}
                  >
                    <View
                      className={`${
                        item.qtd && item.qtd < 2
                          ? "bg-primary-100"
                          : "bg-primary-500"
                      } h-6 w-6 rounded justify-start items-center`}
                    >
                      <Text className="text-white text-base font-black">-</Text>
                    </View>
                  </TouchableOpacity>
                  <View>
                    <Text className="mx-3 text-lg font-black">{item.qtd}</Text>
                  </View>
                  <TouchableOpacity
                    disabled={
                      !(item.qtd && (item.extra as any)?.stock > item.qtd)
                    }
                    onPress={() => {
                      if (item.qtd && (item.extra as any)?.stock > item.qtd)
                        item.extra && addItem?.(item.extra);
                    }}
                  >
                    <View
                      className={`${
                        !(item.qtd && (item.extra as any)?.stock > item.qtd)
                          ? "bg-primary-100"
                          : "bg-primary-500"
                      } h-6 w-6 rounded justify-start items-center`}
                    >
                      <Text className="text-white text-base font-black">+</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
