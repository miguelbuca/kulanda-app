import { client } from "@/src/api/client";
import { Button } from "@/src/components";
import { GET_COMPANY } from "@/src/graphql/queries";
import { useAuth } from "@/src/hooks/use-auth";
import { useCompany } from "@/src/hooks/use-company";
import { useDevice } from "@/src/hooks/use-device";
import { storage } from "@/src/services";
import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function PrivateLayout() {
  const { user } = useAuth();
  const { replace } = useRouter();

  const { type } = useDevice();

  const { setCompany } = useCompany();

  useQuery(GET_COMPANY, {
    client: client,
    onCompleted(data) {
      if (!data.getCompany) {
        storage.deleteValueFor("x-tenant-username");
        storage.deleteValueFor("x-tenant-key");
        storage.deleteValueFor("_kt");
        return;
      }

      setCompany(data.getCompany);
    },
  });

  useFocusEffect(() => {
    if (!user.id) replace("/");
  });

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: "none",
        }}
      >
        <Stack.Screen
          options={{
            title: "Estabelecimento",
          }}
          name="index"
        />
        <Stack.Screen
          options={{
            title: "Criar estabelecimento",
          }}
          name="create"
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
