import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text } from "react-native";
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

const Tenant = () => {
  const route = useRouter();
  const handleSaveTenant = useCallback((values: z.infer<typeof schema>) => {
    storage.save("x-tenant-username", values.xTenantUserName);
    storage.save("x-tenant-key", values.xTenantKey);

    route.canGoBack() && route.back();
  }, []);

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      xTenantUserName: "",
      xTenantKey: "",
    },
    resolver: zodResolver(schema),
  });

  return (
    <View
      onLayout={() => SplashScreen.hideAsync()}
      className="flex flex-col flex-1 justify-center items-center bg-gray-50"
    >
      <View className="flex flex-col items-center justify-center w-full px-6">
        <View className="flex flex-col bg-white w-[320px] p-6 gap-y-4 rounded-xl shadow-sm">
          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value }, formState }) => (
                <Input
                  value={value}
                  placeholder="Cliente"
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
                  placeholder="Chave de accesso"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={formState.errors.xTenantKey?.message}
                />
              )}
              name="xTenantKey"
            />
          </View>
          <Button onPress={handleSubmit(handleSaveTenant)}>
            Salvar e continuar
          </Button>
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  );
};

export default Tenant;
