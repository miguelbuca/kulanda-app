import { client } from "@/src/api/client";
import { Button, Input } from "@/src/components";
import { SIGN_IN } from "@/src/graphql/mutations";
import { GET_USER } from "@/src/graphql/queries";
import { useAuth } from "@/src/hooks/use-auth";
import { useDevice } from "@/src/hooks/use-device";
import { useStore } from "@/src/hooks/use-store";
import { storage } from "@/src/services";
import { useMutation, useQuery } from "@apollo/client";
import { SplashScreen, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function SignIn() {
  const route = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

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

  useEffect(() => {
    if (type === null) return;
    storage.getValueFor("_kt").then(async (token) => {
      if (token === null) SplashScreen.hideAsync();
    });
  }, [error, type]);

  useEffect(() => {
    if (!data?.user?.id || type === null) return;
    setUser(data.user);

    storage.getValueFor<StoreType>("_kst").then(async (store) => {
      if (!(await storage.getValueFor("_kt"))) {
        return;
      } else {
        store?.id && setStore(store);
        if (data.user.access === "OWNER" && !store?.id) route.replace("/_/switch");
        else route.replace("/_/store/main");
      }
    });
  }, [data, type]);

  return (
    <View className="flex flex-col flex-1 justify-center items-center bg-gray-50">
      <View className="flex flex-col items-center justify-center w-full px-6">
        {/* <View className="flex items-center justify-center mb-8">
          <Text className="text-base mb-4 font-semibold">Autenticação</Text>
        </View> */}
        <View className="flex flex-col bg-white min-w-[350px] p-6 gap-y-4 rounded-xl shadow-sm">
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
        </View>
      </View>
    </View>
  );
}
