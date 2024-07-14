import { client } from "@/src/api/client";
import { Button, ErrorBox, Input } from "@/src/components";
import { SIGN_IN } from "@/src/graphql/mutations";
import { GET_STORE, GET_USER } from "@/src/graphql/queries";
import { useAuth } from "@/src/hooks/use-auth";
import { useDevice } from "@/src/hooks/use-device";
import { useStore } from "@/src/hooks/use-store";
import { storage } from "@/src/services";
import { useMutation, useQuery } from "@apollo/client";
import { SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const route = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const [isValidTenant, setIsValidTenant] = useState(true);

  const { type } = useDevice();
  const { setUser } = useAuth();
  const { setStore } = useStore();

  const { data, refetch, error } = useQuery(GET_USER, {
    client: client,
  });

  const [login] = useMutation(SIGN_IN, {
    client: client,
    variables: {
      email: emailOrPhone,
      password,
    },
    onCompleted({ signIn }) {
      storage.save<string>("_kt", signIn.access_token);
      refetch();
    },
    onError({ message }) {
      Alert.alert(message);
    },
  });

  useFocusEffect(() => {
    checkTenant();
  });

  useEffect(() => {
    if (data?.user?.storeId && data?.user?.access !== "OWNER") {
      setUser(data?.user);
      client
        .query({
          query: GET_STORE,
          variables: {
            id: data?.user?.storeId,
          },
        })
        .then(({ data }) => {
          const store: StoreType = data?.getStore;

          if (!store.id) return;
          setStore(store);
          route.replace("/_/store/main");
        });
    } else if (data?.user?.access === "OWNER") {
      setUser(data?.user);
      route.replace("/_/establishment");
    }
  }, [data]);

  const checkTenant = useCallback(async () => {
    const xTenantUserName = await storage.getValueFor("x-tenant-username");
    const xTenantKey = await storage.getValueFor("x-tenant-key");
    if (xTenantUserName !== null || xTenantKey !== null) {
      setIsValidTenant(true);
    } else {
      setIsValidTenant(false);
    }
  }, []);

  useEffect(() => {
    if (type !== null) checkTenant();
  }, [error, type]);

  return (
    <View className="flex flex-col flex-1 justify-center items-center bg-gray-50">
      <View className="flex flex-col items-center justify-center w-full px-6">
        <View className="flex flex-col bg-white w-[320px] p-6 gap-y-4 rounded-xl shadow-sm">
          <Input
            placeholder="Telemóvel ou e-mail"
            onChangeText={(text) => setEmailOrPhone(text)}
          />
          <Input
            placeholder="Palavra passe"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <Button onPress={() => login()}>Iniciar sessão</Button>
          <View>
            {!isValidTenant && (
              <>
                <ErrorBox message="Não encontramos a assinatura do cliente" />
                <TouchableOpacity onPress={() => route.push("/tenant")}>
                  <Text className="mt-4 self-center text-base text-blue-500">
                    Adicionar assinatura
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}
