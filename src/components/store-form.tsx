import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import * as z from "zod";
import { StatusBar } from "expo-status-bar";
import { useDevice } from "../hooks/use-device";
import { Select } from "./select";
import { Input } from "./input";
import { Button } from "./button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_STORE } from "../graphql/mutations";
import { client } from "../api/client";
import { router, useRouter } from "expo-router";
import { useStore } from "../hooks/use-store";
import { GET_STORE_BY_ID } from "../graphql/queries";
import { Feather } from "@expo/vector-icons";

const schema = z.object({
  designation: z.string(),
  phone: z.string(),
  address: z.string(),
  saleType: z.string(),
});

export interface StoreFormProps {
  storeId?: string;
}

export const StoreForm = ({ storeId }: StoreFormProps) => {
  const { store } = useStore();
  const { type } = useDevice();
  const [Store, setStore] = useState<StoreType>();
  const route = useRouter();

  const [createStore, { loading: createLoading }] = useMutation(CREATE_STORE, {
    client: client,
    onCompleted(data) {
      if (data.createStore?.id) route.back();
    },
    onError(error) {
      console.log(error.message);
    },
  });

  useQuery(GET_STORE_BY_ID, {
    client: client,
    variables: {
      id: storeId,
    },
    onCompleted(data) {
      delete data.getStore.__typename;
      setStore(data.getStore);
    },
  });

  const handleSaveStore = useCallback(
    (values: z.infer<typeof schema>) => {
      if (!storeId)
        createStore({
          variables: {
            ...values,
            storeId: store.id,
          },
        });
      else {
        console.log("edit with: ", values);
      }
    },
    [createStore, route, store, storeId]
  );

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    values: {
      ...Store,
    } as any,
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex flex-col  bg-white p-6 rounded-xl shadow-sm">
        <View
          className={`flex ${
            type !== "PHONE" ? "flex-row gap-x-4" : "flex-col"
          } mt-4`}
        >
          <View
            className={`flex flex-col ${type !== "PHONE" ? "flex-1" : ""} `}
          >
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Designação"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.designation?.message}
                  />
                )}
                name="designation"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value ?? ""}
                    placeholder="Endereço"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.address?.message}
                  />
                )}
                name="address"
              />
            </View>
          </View>
          <View
            className={`flex flex-col ${type !== "PHONE" ? "flex-1" : ""} `}
          >
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, value }, formState }) => (
                  <Select
                    value={value}
                    placeholder="Tipo de venda (nenhum)"
                    items={[
                      {
                        label: "Produtos",
                        value: "PRODUCT",
                      },
                      {
                        label: "Serviços",
                        value: "SERVICE",
                      },
                      {
                        label: "Produtos & Serviços",
                        value: "DEFAULT",
                      },
                    ]}
                    onValueChange={onChange}
                    errorMessage={formState.errors.saleType?.message}
                  />
                )}
                name="saleType"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, value }, formState }) => (
                  <Input
                    value={value?.toString()}
                    placeholder="Telemóvel"
                    onChangeText={(value) => onChange(value)}
                    errorMessage={formState.errors.phone?.message}
                    keyboardType="numbers-and-punctuation"
                    isPhone
                  />
                )}
                name="phone"
              />
            </View>
          </View>
        </View>

        <View className="flex mt-4">
          <View>
            <Button
              isLoading={createLoading}
              onPress={handleSubmit(handleSaveStore)}
              className={type !== "PHONE" ? `w-[100px] mt-12` : ``}
            >
              Salvar
            </Button>
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
};
