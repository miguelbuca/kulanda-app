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
            title: "Criar cobrança",
          }}
        />
        <Stack.Screen
          name="[slug]"
          options={{
            title: "Editar cobrança",
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
