import { useDevice } from "@/src/hooks/use-device";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PrivateLayout() {
  const { type } = useDevice();
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
        <Stack.Screen
          options={
            type === "PHONE"
              ? {
                  title: "Pagamento",
                  headerShown: true,
                }
              : {
                  title: "Pagamento",
                  headerShown: true,
                  presentation: "formSheet",
                }
          }
          name="payment"
        />
        <Stack.Screen
          options={
            type === "PHONE"
              ? {
                  headerShown: true,
                  presentation: "modal",
                  title: "Comprovativo",
                }
              : {
                  headerShown: false,
                  presentation: "modal",
                  title: "Comprovativo",
                }
          }
          name="payment-status"
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
