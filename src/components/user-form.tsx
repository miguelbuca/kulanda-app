import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text, SafeAreaView } from "react-native";
import React, { useCallback, useState } from "react";
import { SplashScreen, useRouter } from "expo-router";
import { Button, Input } from "@/src/components";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

import * as z from "zod";
import { storage } from "@/src/services";
import { StatusBar } from "expo-status-bar";

const schema = z.object({
  xTenantUserName: z
    .string()
    .min(4, "Client username is too short. Minimal length is 4 characters")
    .max(29, "Client username is too long. Maximal length is 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Client username can only contain letters, numbers, and underscores"
    ),
  xTenantKey: z.string().regex(/^k_tnt_[a-zA-Z0-9]{8}$/, "Invalid key format"),
});

export interface UserFormProps {
  userId?: string;
}

export const UserForm = ({}: UserFormProps) => {
  const handleSaveTenant = useCallback((values: z.infer<typeof schema>) => {
    console.log(values);
  }, []);

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      xTenantUserName: "",
      xTenantKey: "",
    },
    resolver: zodResolver(schema),
  });

  return (
    <>
      <View className="flex flex-col  bg-white p-6 rounded-xl shadow-sm">
        <View className="flex flex-row gap-x-4 mt-4">
          <View className="flex flex-col gap-y-4 flex-1">
            <View className="my-2">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Nume completo"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={formState.errors.xTenantUserName?.message}
                  />
                )}
                name="xTenantUserName"
              />
            </View>
            <View className="my-2">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="E-mail"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={formState.errors.xTenantKey?.message}
                  />
                )}
                name="xTenantKey"
              />
            </View>
          </View>
          <View className="flex flex-col gap-y-4 flex-1">
            <View className="my-2">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="E-mail"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={formState.errors.xTenantUserName?.message}
                  />
                )}
                name="xTenantUserName"
              />
            </View>
            <View className="my-2">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="E-mail"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={formState.errors.xTenantKey?.message}
                  />
                )}
                name="xTenantKey"
              />
            </View>
          </View>
        </View>
        <View className="flex items-start mt-4">
          <View>
            <Button className="px-6" onPress={handleSubmit(handleSaveTenant)}>
              Salvar
            </Button>
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </>
  );
};
