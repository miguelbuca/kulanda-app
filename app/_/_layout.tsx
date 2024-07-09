import { useDevice } from "@/src/hooks/use-device";
import { Stack } from "expo-router";

export default function PrivateLayout() {
  const { type } = useDevice();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          title: "Loja",
        }}
        name="store"
      />
      <Stack.Screen name="switch" />
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
                title: "Comprovativo"
              }
            : {
                headerShown: false,
                presentation: "modal",
                title: "Comprovativo"
              }
        }
        name="payment-status"
      />
    </Stack>
  );
}
