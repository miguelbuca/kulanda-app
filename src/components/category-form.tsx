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
import { CREATE_CATEGORY } from "../graphql/mutations";
import { client } from "../api/client";
import { router, useRouter } from "expo-router";
import { useStore } from "../hooks/use-store";
import { GET_CATEGORY_BY_ID } from "../graphql/queries";

const schema = z.object({
  name: z
    .string()
    .min(4, "Categoryname is too short. Minimal length is 4 characters")
    .max(29, "Categoryname is too long. Maximal length is 20 characters"),
  description: z.string().optional(),
  type: z.string(),
});

export interface CategoryFormProps {
  categoryId?: string;
}

export const CategoryForm = ({ categoryId }: CategoryFormProps) => {
  const { store } = useStore();
  const { type } = useDevice();
  const [category, setCategory] = useState<CategoryType>();
  const route = useRouter();

  const [createCategory, { loading: createLoading }] = useMutation(
    CREATE_CATEGORY,
    {
      client: client,
      onCompleted(data) {
        if (data.createCategory?.id) route.back();
      },
      onError(error) {
        console.log(error.message);
      },
    }
  );

  useQuery(GET_CATEGORY_BY_ID, {
    client: client,
    variables: {
      id: categoryId,
    },
    onCompleted(data) {
      delete data.getCategory.__typename;
      setCategory(data.getCategory);
    },
  });

  const handleSaveTenant = useCallback(
    (values: z.infer<typeof schema>) => {
      if (!categoryId)
        createCategory({
          variables: {
            ...values,
            storeId: store.id,
          },
        });
      else {
        console.log("edit with: ", values);
      }
    },
    [createCategory, route, store, categoryId]
  );

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    values: {
      ...category,
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
          className={`flex ${type !== "PHONE" ? "flex-row" : "flex-col"} mt-4`}
        >
          <View className="flex flex-col">
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Nome"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.name?.message}
                  />
                )}
                name="name"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, value }, formState }) => (
                  <Select
                    value={value}
                    placeholder="Tipo (nenhum)"
                    items={[
                      {
                        label: "Produto",
                        value: "PRODUCT",
                      },
                      {
                        label: "Serviço",
                        value: "SERVICE",
                      },
                    ]}
                    onValueChange={onChange}
                    errorMessage={formState.errors.type?.message}
                  />
                )}
                name="type"
              />
            </View>
          </View>
          <View className="flex flex-col">
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value ?? ''}
                    placeholder="Descrição"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.description?.message}
                    multiline
                    style={{
                      height: 200,
                    }}
                  />
                )}
                name="description"
              />
            </View>
          </View>
        </View>

        <View className="flex mt-4">
          <View>
            <Button
              isLoading={createLoading}
              onPress={handleSubmit(handleSaveTenant)}
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
