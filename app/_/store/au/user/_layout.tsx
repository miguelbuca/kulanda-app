import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PrivateLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="create"
          options={{
            title: "Criar usuário",
          }}
        />
        <Stack.Screen
          name="[slug]"
          options={{
            title: "Editar usuário",
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
