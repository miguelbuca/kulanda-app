import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_STORE } from "../graphql/queries";
import { useStore } from "../hooks/use-store";
import { client } from "../api/client";
import { formatMoney } from "../utils/format-money";
import { useOrder } from "../hooks/use-order";
import { useDevice } from "../hooks/use-device";
import { theme } from "@/tailwind.config";
import { getApiFile } from "../utils/get-api-file";

export interface ProductsProps {
  filter?: FilterProductInput;
}

export const Products = ({ filter }: ProductsProps) => {
  const [data, setData] = useState<ProductType[]>([]);
  const { store } = useStore();
  const { addItem, qtd } = useOrder();
  const { type } = useDevice();

  const { loading } = useQuery(GET_PRODUCTS_BY_STORE, {
    client: client,
    variables: {
      storeId: store.id,
      filter,
    },
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getProducts }) => {
      setData(getProducts);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  if (loading)
    return (
      <View
        className={`absolute h-full w-full ${
          type !== "PHONE" ? "px-10 gap-3" : "px-4 gap-2"
        } py-5 pb-24`}
      >
        <ActivityIndicator
          size={"small"}
          color={theme.extend.colors.primary[500]}
        />
      </View>
    );

  return (
    <View
      className={`${
        type !== "PHONE" ? "px-10 gap-3" : "px-4 gap-2"
      } py-5 pb-24 flex-row flex-wrap justify-start`}
    >
      {data.map((item, index) => (
        <TouchableOpacity
          style={
            type !== "PHONE"
              ? {
                  width: 260,
                  marginBottom: 8,
                }
              : {
                  width: "47%",
                  marginBottom: 8,
                }
          }
          onPress={() => {
            if (!qtd.includes(item.id ?? "")) addItem?.(item);
          }}
          key={index}
        >
          <View
            className={`flex ${
              type !== "PHONE" ? "h-[340px]" : "h-[230px]"
            } flex-col bg-white shadow-sm p-2 w-full rounded-md`}
          >
            <View
              className={`relative ${
                type !== "PHONE" ? "h-48" : "h-28"
              } items-center justify-center`}
            >
              <Image
                className="h-full w-full rounded-md"
                source={{
                  uri: getApiFile(item.image ?? ""),
                }}
              />
            </View>
            <View className="flex flex-col flex-1">
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                className={`mt-2 ${
                  type !== "PHONE" ? "text-md" : "text-sm"
                } font-semibold`}
              >
                {item.name}
              </Text>

              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                className={`my-2 flex-1 ${
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
