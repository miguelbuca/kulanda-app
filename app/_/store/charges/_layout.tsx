import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PrivateLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          presentation: 'modal'
        }}
      >
        <Stack.Screen
          name="create"
          options={{
            title: "Criar emolumentos",
          }}
        />
        <Stack.Screen
          name="[slug]"
          options={{
            title: "Editar emolumentos",
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
