import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import * as z from "zod";
import { StatusBar } from "expo-status-bar";
import { useDevice } from "../hooks/use-device";
import { Select } from "./select";
import { Input, InputDataPicker } from "./input";
import { Button } from "./button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PRODUCT } from "../graphql/mutations";
import { client } from "../api/client";
import { useRouter } from "expo-router";
import { useStore } from "../hooks/use-store";
import { GET_CATEGORIES_BY_STORE, GET_PRODUCT_BY_ID } from "../graphql/queries";
import { AvatarDinamic } from "./avatar-dinamic";
import { generateRNFile } from "../utils/rn-file-generate";

const schema = z.object({
  name: z.string().min(2, "Nome is too short. Minimal length is 4 characters"),
  description: z.string().optional(),
  image: z
    .object({
      fileName: z.string(),
      height: z.number(),
      mimeType: z.string(),
      uri: z.string(),
      width: z.number(),
    })
    .optional(),
  price: z.number(),
  expiresOn: z.date(),
  charges: z.string().optional(),
  categoryId: z.string(),
});

export interface ProductFormProps {
  productId?: string;
}

export const ProductForm = ({ productId }: ProductFormProps) => {
  const { store } = useStore();
  const { type } = useDevice();
  const [product, setProduct] = useState<ProductType>();
  const route = useRouter();

  const [createProduct, { loading: createLoading, error }] = useMutation(
    CREATE_PRODUCT,
    {
      client: client,
      onCompleted(data) {
        if (data.createProduct?.id) route.back();
      },
      onError(error) {
        console.log(JSON.stringify(error));
      },
    }
  );

  useQuery(GET_PRODUCT_BY_ID, {
    client: client,
    variables: {
      id: productId,
    },
    onCompleted(data) {
      delete data.getProduct.__typename;
      setProduct(data.getProduct);
    },
  });

  const { data: categories } = useQuery(GET_CATEGORIES_BY_STORE, {
    client: client,
    variables: {
      storeId: store.id,
    },
  });

  const handleSaveTenant = useCallback(
    ({ image: file, ...values }: any) => {
      values["image"] = generateRNFile(
        file?.uri,
        file?.fileName,
        file?.mimeType
      );

      if (!productId) {
        createProduct({
          variables: {
            ...values, // Envia o FormData como variável
            storeId: store.id,
          },
        });
      } else {
        console.log("edit with: ", values);
      }
    },
    [createProduct, route, store, productId]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    values: {
      ...product,
    } as any,
    resolver: zodResolver(schema),
  });

  const categoriesSelectData = useMemo(() => {
    return categories?.getCategoriesByStore
      ? categories?.getCategoriesByStore
          ?.filter((item: CategoryType) => item.type === "PRODUCT")
          ?.map((item: CategoryType) => ({
            label: item.name,
            value: item.id,
          }))
      : [];
  }, [categories]);

  return (
    <ScrollView className="flex-1 p-6">
      <View className="flex justify-center items-center py-6">
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <AvatarDinamic
              image={value?.uri}
              withUpload
              onUpload={(asset) => onChange(asset)}
            />
          )}
          name="image"
        />
      </View>
      <View className="flex flex-col  bg-white p-6 rounded-xl shadow-sm mb-28">
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
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    errorMessage={formState.errors.price?.message}
                    currencyProps={{
                      value: parseFloat(value?.toString() || "0"),

                      onChangeValue: (value) => {
                        try {
                          if (!value) return;
                          onChange(Number(value?.toString()));
                        } catch (error) {
                          console.log(error);
                        }
                      },
                      suffix: " Kz",
                      delimiter: ".",
                      separator: ",",
                      precision: 2,
                      minValue: 0,
                    }}
                  />
                )}
                name="price"
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
                    value={
                      categoriesSelectData.filter(
                        (item: any) => item?.value == value
                      )?.[0]?.value
                    }
                    placeholder="Categorias(nenhum)"
                    items={categoriesSelectData}
                    onValueChange={onChange}
                    errorMessage={formState.errors.categoryId?.message}
                  />
                )}
                name="categoryId"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <InputDataPicker
                    value={value ? new Date(value) : undefined}
                    label="Data de expiração"
                    onChange={onChange}
                    errorMessage={formState.errors.expiresOn?.message}
                  />
                )}
                name="expiresOn"
              />
            </View>
          </View>
        </View>

        <View className={`flex flex-col ${type !== "PHONE" ? "flex-1" : ""} `}>
          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value }, formState }) => (
                <Input
                  multiline
                  value={value}
                  placeholder="Descrição"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className="h-[200px]"
                  errorMessage={formState.errors.description?.message}
                />
              )}
              name="description"
            />
          </View>
        </View>

        <View className="flex mt-4">
          <View>
            <Button
              isLoading={createLoading}
              onPress={handleSubmit(handleSaveTenant)}
              className={type !== "PHONE" ? `w-[100px] mt-12` : ``}
            >
              Salvar
            </Button>
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
};
