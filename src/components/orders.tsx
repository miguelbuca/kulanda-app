import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { OrderList, useOrder } from "../hooks/use-order";
import { formatMoney } from "../utils/format-money";
import { Button } from "./button";
import { Ionicons } from "@expo/vector-icons";
import { useDevice } from "../hooks/use-device";
import { getApiFile } from "../utils/get-api-file";
import { getStock } from "../utils/product";

export interface OrdersProps {
  canDelete?: boolean;
  canAdd?: boolean;
  canRemove?: boolean;
  list: OrderList[];
  deletedList?: string[];
  addItem?: (item: ProductType | ServiceType) => void;
  removeItem?: (id: string, item?: ProductType | ServiceType) => void;
  deleteItem?: (id: string) => void;
}

export const Orders = ({
  canDelete = true,
  canAdd = true,
  canRemove = true,
  list,
  deletedList = [],
  addItem,
  removeItem,
  deleteItem,
}: OrdersProps) => {
  const { type } = useDevice();

  if (type === null || type === undefined) return;

  const getQtd = (itemId: string, qtd = 0) => {
    return qtd - deletedList.filter((id) => id === itemId).length;
  };

  return type !== "PHONE" ? (
    <FlatList
      data={list}
      renderItem={({ item, index }) => {
        const stock = getStock(item.extra?.stock);
        const qtd = getQtd(item.extra.id, item.qtd);
        return (
          <View
            key={index}
            className={`flex flex-row items-end gap-4 mb-5 ${
              list.length - 1 == index
                ? "border-none"
                : "border-b pb-5 border-gray-100"
            }`}
          >
            {item.extra?.image ? (
              <View>
                <Image
                  className="h-20 w-20 rounded-md"
                  source={{
                    uri: getApiFile(item.extra?.image),
                  }}
                />
              </View>
            ) : null}
            <View className="flex flex-1 flex-col ">
              <View className="flex flex-row flex-1">
                <View className="flex-1">
                  <Text className="text-lg font-semibold">
                    {item.extra?.name}
                  </Text>
                  <Text className="text-xs font-light">
                    {item.extra.category?.type === "PRODUCT"
                      ? "Produto"
                      : "Serviço"}
                  </Text>
                </View>
                {canDelete ? (
                  <TouchableOpacity
                    onPress={() => item.extra.id && deleteItem?.(item.extra.id)}
                  >
                    <View>
                      <Ionicons name="trash-outline" color={"red"} size={20} />
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-md font-black text-primary-500">
                  {formatMoney(Number(Number(item.total).toFixed(2)))}
                </Text>

                <View className="flex flex-row flex-1 items-center justify-end">
                  <TouchableOpacity
                    disabled={
                      item.extra.category?.type !== "SERVICE" && canRemove
                        ? !!(qtd && qtd < 2)
                        : !canRemove
                    }
                    onPress={() => {
                      if (qtd && qtd < 2) return;
                      item.extra?.id && removeItem?.(item.extra.id, item.extra);
                    }}
                  >
                    <View
                      className={`${
                        (item.extra.category?.type !== "SERVICE" &&
                          qtd &&
                          qtd < 2) ||
                        (qtd && qtd < 2) ||
                        (!canRemove && item.extra.category?.type === "SERVICE")
                          ? "bg-primary-100"
                          : "bg-primary-500"
                      } h-6 w-6 rounded justify-start items-center`}
                    >
                      <Text className="text-white text-base font-black">-</Text>
                    </View>
                  </TouchableOpacity>
                  <View>
                    <Text className="mx-3 text-lg font-black">{qtd}</Text>
                  </View>
                  <TouchableOpacity
                    disabled={
                      item.extra.category?.type !== "SERVICE" && canAdd
                        ? !(qtd && stock > qtd)
                        : !canAdd
                    }
                    onPress={() => {
                      if (
                        (qtd && stock > qtd) ||
                        item.extra.category?.type === "SERVICE"
                      )
                        item.extra && addItem?.(item.extra);
                    }}
                  >
                    <View
                      className={`${
                        (item.extra.category?.type !== "SERVICE" &&
                          !(qtd && stock > qtd)) ||
                        (!canAdd && item.extra.category?.type === "SERVICE")
                          ? "bg-primary-100"
                          : "bg-primary-500"
                      } h-6 w-6 rounded justify-start items-center`}
                    >
                      <Text className="text-white text-base font-black">+</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
      }}
    />
  ) : (
    <View className="flex flex-col">
      {list.map((item, index, arr) => {
        const stock = getStock(item.extra?.stock);
        const qtd = getQtd(item.extra.id, item.qtd);

        return (
          <View
            key={index}
            className={`flex flex-row items-end py-3 gap-4 ${
              arr.length - 1 == index
                ? "border-none"
                : "border-b border-gray-100"
            }`}
          >
            {item.extra?.image ? (
              <View>
                <Image
                  className="h-20 w-20 rounded-md"
                  source={{
                    uri: getApiFile(item.extra?.image),
                  }}
                />
              </View>
            ) : null}
            <View className="flex flex-1 flex-col ">
              <View className="flex flex-row flex-1 items-center">
                <View className="flex-1">
                  <Text className="text-lg font-semibold">
                    {item.extra?.name}
                  </Text>
                  <Text className="text-xs font-light">
                    {item.extra.category?.type === "PRODUCT"
                      ? "Produto"
                      : "Serviço"}
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
                <View className="flex flex-row flex-1 items-center justify-end">
                  <TouchableOpacity
                    disabled={!!(qtd && qtd < 2) && canRemove}
                    onPress={() => {
                      if (qtd && qtd < 2) return;
                      item.extra?.id && removeItem?.(item.extra.id, item.extra);
                    }}
                  >
                    <View
                      className={`${
                        (qtd && qtd < 2) ||
                        (!canRemove && item.extra.category?.type === "SERVICE")
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
                      item.extra.category?.type !== "SERVICE"
                        ? !(qtd && stock > qtd)
                        : !canAdd
                    }
                    onPress={() => {
                      if (
                        (qtd && stock > qtd) ||
                        item.extra.category?.type === "SERVICE"
                      )
                        item.extra && addItem?.(item.extra);
                    }}
                  >
                    <View
                      className={`${
                        !(qtd && stock > qtd) &&
                        item.extra.category?.type === "PRODUCT" &&
                        !canAdd
                          ? "bg-primary-100"
                          : "bg-primary-500"
                      } h-6 w-6 rounded justify-start items-center`}
                    >
                      <Text className="text-white text-base font-black">+</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
