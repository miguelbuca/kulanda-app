import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_SERVICES_BY_STORE } from "../graphql/queries";
import { useStore } from "../hooks/use-store";
import { client } from "../api/client";
import { formatMoney } from "../utils/format-money";
import { useOrder } from "../hooks/use-order";
import { useDevice } from "../hooks/use-device";

export interface ServicesProps {
  filter?: FilterServiceInput;
}

export const Services = ({ filter }: ServicesProps) => {
  const [data, setData] = useState<ProductType[]>([]);
  const { store } = useStore();
  const { addItem, qtd } = useOrder();
  const { type } = useDevice();

  useQuery(GET_SERVICES_BY_STORE, {
    client: client,
    variables: {
      storeId: store.id,
      filter,
    },
    onCompleted: ({ getServices }) => {
      setData(getServices);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <View
      className={`${
        type !== "PHONE"
          ? "px-10 gap-3 mx-2 flex-row flex-wrap justify-between"
          : "px-4 gap-2 flex-col"
      } p-5 pb-24  `}
    >
      {data.map((item, index) => (
        <TouchableOpacity
          style={
            type !== "PHONE"
              ? {
                  width: "48.5%",
                }
              : {}
          }
          onPress={() => {
            if (!qtd.includes(item.id ?? "")) addItem?.(item);
          }}
          key={index}
        >
          <View className={`flex flex-row bg-white shadow-sm p-2 rounded-md`}>
            {item.image ? (
              <View className={`relative items-center justify-center`}>
                <Image
                  className="h-20 w-20 rounded-md"
                  source={{
                    uri: item.image,
                  }}
                />
              </View>
            ) : null}
            <View className="flex flex-col flex-1 px-3">
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
