import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";
import { useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import * as Font from "expo-font";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/hooks/use-auth";
import { useQuery } from "@apollo/client";
import { GET_STORE, GET_USER } from "@/src/graphql/queries";
import { client } from "@/src/api/client";
import { useStore } from "@/src/hooks/use-store";
import { storage } from "@/src/services";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  async function loadResources() {
    await Font.loadAsync({
      ...Ionicons.font,
      ...Feather.font,
    });
  }

  useEffect(() => {
    loadResources();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { setUser } = useAuth();
  const { replace } = useRouter();
  const { setStore } = useStore();

  useQuery(GET_USER, {
    client: client,
    onCompleted(data) {
      setUser(data?.user);
    },
    onError() {
      replace("/");
    },
  });

  const loadStore = useCallback(async () => {
    const id = await storage.getValueFor("_ksid");

    if (!id) return;

    const { data } = await client.query({
      query: GET_STORE,
      variables: { id },
    });

    if (data?.getStore?.id) {
      setStore(data?.getStore);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              title: "Autenticação",
            }}
          />
          <Stack.Screen
            name="tenant"
            options={{
              headerShown: true,
              title: "Assinatura",
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
