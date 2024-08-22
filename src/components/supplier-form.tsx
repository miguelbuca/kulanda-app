import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import * as z from "zod";
import { StatusBar } from "expo-status-bar";
import { useDevice } from "../hooks/use-device";
import { Select } from "./select";
import { Input } from "./input";
import { Button } from "./button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SUPPLIER } from "../graphql/mutations";
import { client } from "../api/client";
import { useRouter } from "expo-router";
import { useStore } from "../hooks/use-store";
import { GET_CAES, GET_SUPPLIER_BY_ID } from "../graphql/queries";

const schema = z.object({
  fullName: z
    .string()
    .min(2, "fullname is too short. Minimal length is 4 characters")
    .max(29, "fullname is too long. Maximal length is 20 characters"),
  email: z.string().email().optional(),
  address: z.string(),
  phone: z.string(),
  type: z.string(),
  nif: z.string().optional(),
  caeId: z.string().optional(),
});

export interface SupplierFormProps {
  supplierId?: string;
}

export const SupplierForm = ({ supplierId }: SupplierFormProps) => {
  const { store } = useStore();
  const { type } = useDevice();
  const [supplier, setSupplier] = useState<ClientType>();
  const route = useRouter();

  const [createSupplier, { loading: createLoading }] = useMutation(
    CREATE_SUPPLIER,
    {
      client: client,
      onCompleted(data) {
        if (data.createSupplier?.id) route.back();
      },
      onError(error) {
        console.log(error.message);
      },
    }
  );

  const { data, error } = useQuery(GET_SUPPLIER_BY_ID, {
    client: client,
    variables: {
      id: supplierId,
    },
    onCompleted(data) {
      delete data.getSupplier.__typename;
      setSupplier(data.getSupplier);
    },
  });

  const { data: CAEs } = useQuery(GET_CAES, {
    client: client,
  });

  const handleSaveTenant = useCallback(
    (values: z.infer<typeof schema>) => {
      if (!supplierId)
        createSupplier({
          variables: {
            ...values,
            storeId: store.id,
          },
        });
      else {
        console.log("edit with: ", values);
      }
    },
    [createSupplier, route, store, supplierId]
  );

  const { control, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      type: "INDIVIDUAL",
    },
    values: {
      ...supplier,
    } as any,
    resolver: zodResolver(schema),
  });

  const caesSelectData = useMemo(() => {
    return CAEs?.getCAEs
      ? CAEs?.getCAEs?.map((item: CAEType) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id,
        }))
      : [];
  }, [CAEs]);

  return (
    <>
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
                    placeholder="Nome Completo ou Razão Social"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.fullName?.message}
                  />
                )}
                name="fullName"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Telemóvel"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.phone?.message}
                    isPhone
                  />
                )}
                name="phone"
              />
            </View>
          </View>
          <View
            className={`flex flex-col ${type !== "PHONE" ? "flex-1" : ""} `}
          >
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Número de Identificação Fiscal (NIF)"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.nif?.message}
                  />
                )}
                name="nif"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, value }, formState }) => (
                  <Select
                    value={value}
                    placeholder="Tipo de pessoa (nenhum)"
                    items={[
                      {
                        label: "Pessoa física",
                        value: "INDIVIDUAL",
                      },
                      {
                        label: "Pessoa jurídica",
                        value: "LEGAL",
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
          <View
            className={`flex flex-col ${type !== "PHONE" ? "flex-1" : ""} `}
          >
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Endereço"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.address?.message}
                  />
                )}
                name="address"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="E-mail"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.email?.message}
                  />
                )}
                name="email"
              />
            </View>
          </View>
          {watch("type") === "LEGAL" ? (
            <View className="flex flex-col">
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, value }, formState }) => (
                    <Select
                      value={
                        caesSelectData.filter(
                          (item: any) => item?.value == value
                        )?.[0]?.value
                      }
                      placeholder="Atividade Econômica (nenhum)"
                      items={caesSelectData}
                      onValueChange={onChange}
                      errorMessage={formState.errors.caeId?.message}
                    />
                  )}
                  name="caeId"
                />
              </View>
            </View>
          ) : null}
        </View>

        <View>
          <View className="mt-14">
            <Button
              isLoading={createLoading}
              onPress={handleSubmit(handleSaveTenant)}
              className={type !== "PHONE" ? `w-[100px] mt-12` : `w-full`}
            >
              Salvar
            </Button>
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </>
  );
};
