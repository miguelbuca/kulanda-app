import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { GET_CATEGORIES_BY_STORE } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { client } from "../api/client";
import { useStore } from "../hooks/use-store";
import { useDevice } from "../hooks/use-device";

export interface CategoriesProps {
  onPress(item?: CategoryType): void;
  isFullView?: boolean;
}

export const Categories = ({ onPress, isFullView }: CategoriesProps) => {
  const [data, setData] = useState<CategoryType[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Todos");
  const { store } = useStore();
  const { type } = useDevice();

  useQuery(GET_CATEGORIES_BY_STORE, {
    client: client,
    variables: {
      storeId: store.id,
    },
    onCompleted: ({ getCategoriesByStore }) => {
      setData(getCategoriesByStore);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <View>
      <FlatList
        data={data}
        className={type !== "PHONE" ? "p-8 pt-0 pb-4" : "py-3 px-2"}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <TouchableOpacity
            onPress={() => {
              onPress(undefined);
              setSelectedCategoryName("Todos");
            }}
          >
            <View
              className={`${
                selectedCategoryName === "Todos" ? "bg-primary-500" : "bg-white"
              } shadow-sm ${
                type !== "PHONE" ? "p-4" : "px-4 py-2.5"
              } mx-2 rounded-lg`}
            >
              <Text
                className={`font-semibold text-xs ${
                  selectedCategoryName === "Todos" ? "text-white" : "text-black"
                }`}
              >
                Todos
              </Text>
            </View>
          </TouchableOpacity>
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              onPress(item);
              setSelectedCategoryName(item.name ?? "");
            }}
            key={index}
          >
            <View
              className={`${
                item.name === selectedCategoryName
                  ? "bg-primary-500"
                  : "bg-white"
              } flex-row shadow-sm  ${
                type !== "PHONE" ? "p-4" : "px-4 py-2.5"
              } mx-2 rounded-lg ${index + 1 === data.length && "mr-6"}`}
            >
              <Text
                className={`font-semibold text-xs ${
                  item.name === selectedCategoryName
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {item.name}
              </Text>
              {isFullView && (
                <Text
                  className={`font-thin ml-1 uppercase text-xs ${
                    item.name === selectedCategoryName
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {item.type === "PRODUCT" ? "Produto" : "Serviço"}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
