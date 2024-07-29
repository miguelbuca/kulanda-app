import { client } from "@/src/api/client";
import { GET_COMPANY } from "@/src/graphql/queries";
import { useAuth } from "@/src/hooks/use-auth";
import { useCompany } from "@/src/hooks/use-company";
import { useDevice } from "@/src/hooks/use-device";
import { storage } from "@/src/services";
import { useQuery } from "@apollo/client";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PrivateLayout() {
  const { type } = useDevice();
  const { user } = useAuth();
  const { replace } = useRouter();

  const { company, setCompany } = useCompany();

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
          headerShown: false,
          animation: "none",
        }}
      >
        <Stack.Screen
          options={{
            title: "Loja",
          }}
          name="store"
        />
        <Stack.Screen
          options={{ title: "Estabelecimento", headerShown: true }}
          name="establishment"
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
