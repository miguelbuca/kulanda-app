import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import * as z from "zod";
import { StatusBar } from "expo-status-bar";
import { useDevice } from "../hooks/use-device";
import { Select } from "./select";
import { Input } from "./input";
import { Button } from "./button";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../graphql/mutations";
import { client } from "../api/client";
import { useRouter } from "expo-router";
import { useStore } from "../hooks/use-store";

const schema = z.object({
  username: z
    .string()
    .min(4, "username is too short. Minimal length is 4 characters")
    .max(29, "username is too long. Maximal length is 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Client username can only contain letters, numbers, and underscores"
    ),
  fullName: z
    .string()
    .min(2, "fullname is too short. Minimal length is 4 characters")
    .max(29, "fullname is too long. Maximal length is 20 characters"),
  email: z.string().email(),
  access: z.string(),
  phone: z.string(),
  password: z.string(),
});

export interface UserFormProps {
  userId?: string;
}

export const UserForm = ({}: UserFormProps) => {
  const { store } = useStore();
  const { type } = useDevice();
  const route = useRouter();

  const [signUp, { loading }] = useMutation(CREATE_USER, {
    client: client,
    onCompleted(data) {
      if (data.signUp?.access_token) route.back();
    },
    onError(error) {
      console.log(error.message);
    },
  });

  const handleSaveTenant = useCallback(
    (values: z.infer<typeof schema>) => {
      signUp({
        variables: { ...values, storeId: store.id },
      });
    },
    [signUp, route, store]
  );

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    defaultValues: {},
    resolver: zodResolver(schema),
  });

  return (
    <>
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
          <View className="flex flex-col">
            <View>
              <Controller
                control={control}
                render={({ field: { onChange }, formState }) => (
                  <Select
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
        <View className="flex flex-col">
          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value }, formState }) => (
                <Input
                  value={value}
                  placeholder="Palavra passe"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={formState.errors.password?.message}
                />
              )}
              name="password"
            />
          </View>
        </View>
        <View className="flex mt-4">
          <View>
            <Button
              isLoading={loading}
              onPress={handleSubmit(handleSaveTenant)}
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