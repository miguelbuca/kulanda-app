import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { ReactNode, useMemo, useState } from "react";
import { DocumentNode, OperationVariables, useQuery } from "@apollo/client";
import { client } from "../api/client";
import { Accordion } from "./accordion";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../hooks/use-store";
import { Input } from "./input";
import { useDevice } from "../hooks/use-device";
import { theme } from "@/tailwind.config";

export interface TableProps {
  name?: string;
  icon?: ReactNode;
  document: DocumentNode;
  variables?: OperationVariables;
  excludColumns?: string[];
  limit?: number;
  canDeleteRow?: boolean;
  withSearch?: string;
  withPrint?: boolean;
  isValidRow?(value: any): boolean;
  onEventHandler?(type: "edit" | "delete" | "print", value: any): void;
  renderCell?: {
    [Symbol in string]: (value: any, item?: any) => ReactNode;
  };
  renderColumn?: {
    [Symbol in string]: (value: any) => ReactNode;
  };
}

export const Table = <T,>({
  withPrint,
  canDeleteRow = true,
  withSearch,
  document,
  variables,
  excludColumns = [],
  renderCell,
  renderColumn,
  limit = 3,
  isValidRow,
  onEventHandler,
}: TableProps) => {
  const { store } = useStore();
  const { type } = useDevice();

  const [searchValue, setSearchValue] = useState("");
  const [searchFor, setSearchFor] = useState("");

  const [limitPerPage, setlimitPerPage] = useState(2);
  const [page, setPage] = useState(1);

  const filter = useMemo(() => {
    let vrbls: {
      [Symbol in string]: string | number;
    } = {};

    vrbls[withSearch as keyof typeof vrbls] = searchFor;

    return vrbls;
  }, [store, withSearch, searchFor]);

  const { data, error, loading } = useQuery(document, {
    client: client,
    variables: {
      ...variables,
      storeId: store.id,
      filter,
    },
    fetchPolicy: "no-cache",
  });

  const { items, columns } = useMemo(() => {
    try {
      const items: T[] = data?.[Object.keys(data)[0]];
      const allExcluded = excludColumns?.concat("__typename", "id");
      const columns: string[] = Object.keys(items?.[0] as object).filter(
        (key) => !allExcluded?.includes(key)
      );

      return {
        columns,
        items: isValidRow ? items.filter((item) => isValidRow(item)) : items,
      };
    } catch (error) {
      return {
        items: [],
        columns: [],
      };
    }
  }, [data, error, excludColumns, isValidRow]);

  return (
    <>
      <View className="flex flex-row items-center mt-3">
        <View className="flex-1 flex-row items-center gap-x-3">
          {withSearch && (
            <>
              <View className={` ${type === "PHONE" ? "flex-1" : "w-[310px]"}`}>
                <Input
                  className={`h-10 mr-3 py-0.5 ${
                    type === "PHONE" ? "flex-1" : "w-[310px]"
                  } `}
                  placeholder="Buscar por..."
                  onChangeText={setSearchValue}
                />
              </View>
              <TouchableOpacity onPress={() => setSearchFor(searchValue)}>
                <View className="flex flex-row px-3 h-10 bg-black items-center justify-center rounded-lg">
                  <Ionicons name="search-outline" color={"#ffffff"} size={18} />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      {items.length > 0 && !loading ? (
        <View className="mt-4">
          <View className="flex flex-row bg-gray-100 rounded-lg">
            {columns.map((column, index) =>
              index < limit ? (
                <View className="flex-1 px-3 py-4" key={index}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="font-bold uppercase text-[10px] "
                  >
                    {renderColumn?.[column]
                      ? renderColumn[column](column ?? "-")
                      : column ?? "-"}
                  </Text>
                </View>
              ) : null
            )}
          </View>
          <ScrollView>
            {items.map((item, index, arr) => {
              return (
                <Accordion
                  className="p-0 shadow-none m-0 border-0"
                  title={
                    <View
                      className={`flex flex-row items-center w-full ${
                        index + 1 !== arr.length ? "border-b" : ""
                      } border-b-gray-200`}
                    >
                      {columns.map((column, index) =>
                        index < limit ? (
                          <View className="flex-1 px-3 py-4" key={index}>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              className="text-[10px]"
                            >
                              {renderCell?.[column]
                                ? renderCell[column](
                                    (item as any)[column] ?? "-",
                                    item
                                  )
                                : (item as any)[column] ?? "-"}
                            </Text>
                          </View>
                        ) : null
                      )}
                    </View>
                  }
                  key={index}
                >
                  <View className="flex flex-col">
                    <View className="flex flex-row items-center gap-x-3 justify-end">
                      {withPrint && (
                        <TouchableOpacity
                          onPress={() => onEventHandler?.("print", item)}
                        >
                          <View className="flex-row px-2 h-10 bg-black items-center justify-center rounded-lg">
                            <Ionicons
                              name="print-outline"
                              color={"#ffffff"}
                              size={18}
                            />
                            <Text className="ml-2 text-white font-semibold">
                              Imprimir
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => onEventHandler?.("edit", item)}
                      >
                        <View className="flex flex-row px-2 h-10 bg-gray-400 items-center justify-center rounded-lg">
                          <Ionicons
                            name="pencil-outline"
                            color={"#ffffff"}
                            size={18}
                          />
                          <Text className="ml-2 text-white font-semibold">
                            Editar
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {canDeleteRow && (
                        <TouchableOpacity
                          onPress={() => onEventHandler?.("delete", item)}
                        >
                          <View className="flex-row px-2 h-10 bg-red-400 items-center justify-center rounded-lg">
                            <Ionicons
                              name="trash-bin-outline"
                              color={"#ffffff"}
                              size={18}
                            />
                            <Text className="ml-2 text-white font-semibold">
                              Eliminar
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View className="flex flex-col bg-gray-100 mt-4 p-3 rounded-lg">
                      {columns.map((column, index) => (
                        <View
                          className="flex flex-row items-center justify-between py-2"
                          key={index}
                        >
                          <Text className="font-bold uppercase text-[10px] ">
                            {renderColumn?.[column]
                              ? renderColumn[column](column ?? "-")
                              : column ?? "-"}
                          </Text>
                          <Text className="text-[10px] max-w-[70%]">
                            {renderCell?.[column]
                              ? renderCell[column]((item as any)[column] ?? "-")
                              : (item as any)[column] ?? "-"}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Accordion>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View className="flex justify-center items-center mt-3 p-3 bg-gray-100 rounded-lg">
          {loading ? (
            <ActivityIndicator
              size={"small"}
              color={theme.extend.colors.primary[500]}
            />
          ) : (
            <Text className="text-gray-400">Não há registros</Text>
          )}
        </View>
      )}
    </>
  );
};
