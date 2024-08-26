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
          options={{
            title: "Estabelecimento",
            headerShown: true,
            headerRight: () => (
              <View className={type !== "PHONE" ? "mr-6" : "mr-0"}>
                <Button className={type !== "PHONE" ? "h-11" : "h-10 bg-transparent p-0 m-0"}>
                  {type !== "PHONE" ? (
                    <Text className="text-white font-semibold">Adicionar</Text>
                  ) : (
                    <Ionicons name="add" size={22} color={"black"} />
                  )}
                </Button>
              </View>
            ),
          }}
          name="establishment"
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
