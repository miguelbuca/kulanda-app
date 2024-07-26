import { zodResolver } from "@hookform/resolvers/zod";
import { Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import * as z from "zod";
import { StatusBar } from "expo-status-bar";
import { useDevice } from "../hooks/use-device";
import { Select } from "./select";
import { Input } from "./input";
import { Button } from "./button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_USER } from "../graphql/mutations";
import { client } from "../api/client";
import { useRouter } from "expo-router";
import { useStore } from "../hooks/use-store";
import { GET_USER_BY_ID } from "../graphql/queries";

const schema = z.object({
  username: z
    .string()
    .min(4, "username is too short. Minimal length is 4 characters")
    .max(29, "username is too long. Maximal length is 20 characters"),
  fullName: z
    .string()
    .min(2, "fullname is too short. Minimal length is 4 characters")
    .max(29, "fullname is too long. Maximal length is 20 characters"),
  email: z.string().email(),
  access: z.string(),
  phone: z.string(),
  password: z.string().optional(),
});

export interface UserFormProps {
  userId?: string;
}

export const UserForm = ({ userId }: UserFormProps) => {
  const { store } = useStore();
  const { type } = useDevice();
  const [user, setUser] = useState<UserType>();
  const [passwordChange, setPasswordChange] = useState(!!userId);
  const route = useRouter();

  const [signUp, { loading: createLoading }] = useMutation(CREATE_USER, {
    client: client,
    onCompleted(data) {
      if (data.signUp?.access_token) route.back();
    },
    onError(error) {
      console.log(error.message);
    },
  });

  useQuery(GET_USER_BY_ID, {
    client: client,
    variables: {
      id: userId,
    },
    onCompleted(data) {
      delete data.getUser.__typename;
      setUser(data.getUser);
    },
  });

  const handleSaveTenant = useCallback(
    (values: z.infer<typeof schema>) => {
      if (!userId)
        signUp({
          variables: {
            ...values,
            storeId: store.id,
          },
        });
      else {
        console.log("edit with: ", values);
      }
    },
    [signUp, route, store, userId]
  );

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    values: {
      ...user,
    } as any,
    resolver: zodResolver(schema),
  });

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
                    placeholder="Nume completo"
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
            {((["OWNER"].includes(user?.access ?? "") && userId) ||
              !userId) && (
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, value }, formState }) => (
                    <Select
                      value={value}
                      placeholder="Permição de acesso"
                      items={[
                        {
                          label: "Proprietário",
                          value: "OWNER",
                        },
                        {
                          label: "Gerente",
                          value: "MANAGER",
                        },
                        {
                          label: "Vendedor",
                          value: "SELLER",
                        },
                      ]}
                      onValueChange={onChange}
                      errorMessage={formState.errors.access?.message}
                    />
                  )}
                  name="access"
                />
              </View>
            )}
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Nome de usuário"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.username?.message}
                  />
                )}
                name="username"
              />
            </View>
          </View>
        </View>
        <View
          className={`flex  ${
            type !== "PHONE" ? "flex-1 flex-row gap-x-4" : " flex-col"
          } `}
        >
          <View className={type !== "PHONE" ? `flex-1` : `w-full`}>
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
          {passwordChange ? (
            <View className={type !== "PHONE" ? `flex-1` : `w-full`}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value ?? ""}
                    placeholder="Palavra passe"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.password?.message}
                  />
                )}
                name="password"
              />
            </View>
          ) : (
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={() => setPasswordChange((prev) => !prev)}
            >
              <View className="flex items-center justify-center py-4 mt-4">
                <Text className="text-blue-500 font-semibold">
                  Alterar palavra passe
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
    </>
  );
};
