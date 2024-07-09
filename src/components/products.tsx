import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_STORE } from "../graphql/queries";
import { useStore } from "../hooks/use-store";
import { client } from "../api/client";
import { formatMoney } from "../utils/format-money";
import { useOrder } from "../hooks/use-order";
import { useDevice } from "../hooks/use-device";

export interface ProductsProps {
  filter?: FilterProductInput;
}

export const Products = ({ filter }: ProductsProps) => {
  const [data, setData] = useState<ProductType[]>([]);
  const { store } = useStore();
  const { addItem, qtd } = useOrder();
  const { type } = useDevice();

  useQuery(GET_PRODUCTS_BY_STORE, {
    client: client,
    variables: {
      storeId: store.id,
      filter,
    },
    onCompleted: ({ getProducts }) => {
      setData(getProducts);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <View
      className={`${
        type !== "PHONE" ? "px-10" : "px-4"
      } py-5 flex-row flex-wrap justify-between`}
    >
      {data.map((item, index) => (
        <TouchableOpacity
          style={
            type !== "PHONE"
              ? {
                  width: "32%",
                  marginBottom: 8,
                }
              : {
                  width: "49%",
                  marginBottom: 8,
                }
          }
          onPress={() => {
            if (!qtd.includes(item.id ?? "")) addItem?.(item);
          }}
          key={index}
        >
          <View className="flex max-h-fit flex-col bg-white shadow-sm p-2 w-full rounded-md">
            <View
              className={`relative ${
                type !== "PHONE" ? "h-48" : "h-28"
              } items-center justify-center`}
            >
              <Image
                className="h-full w-full rounded-md"
                source={{
                  uri: item.image,
                }}
              />
            </View>
            <View className="flex flex-col">
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                className={`mt-2 ${
                  type !== "PHONE" ? "text-lg" : "text-sm"
                } font-semibold`}
              >
                {item.name}
              </Text>

              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                className={`my-2 ${
                  type !== "PHONE" ? "text-md" : "text-xs"
                } opacity-50`}
              >
                {item.description}
              </Text>
              <View className="flex items-center flex-row">
                <Text
                  className={`text-primary-500 font-black ${
                    type !== "PHONE" ? "text-lg" : "text-base"
                  }`}
                >
                  {formatMoney(item.price ?? 0)}
                </Text>
                <Text className="ml-1 opacity-50 text-xs"> p/un.</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
