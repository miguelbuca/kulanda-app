import { client } from "@/src/api/client";
import { GET_SALE_BY_ID } from "@/src/graphql/queries";
import { Receipt } from "@/src/templates";
import { useQuery } from "@apollo/client";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Print from "expo-print";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [saleId, setSaleId] = useState("");

  useQuery(GET_SALE_BY_ID, {
    client: client,
    variables: {
      id: saleId,
    },
    onCompleted(data) {
      const sale = data?.getSale;
      if (sale) {
        print(sale);
      }
    },
    onError(error) {
      console.log(error);
    },
  });

  const print = useCallback(async (sale: SaleType) => {
    console.log(sale)
    await Print.printAsync({
      html: Receipt(sale),
      
    });
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 items-center justify-center flex-col">
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        className="flex-1"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={({ data }) => setSaleId(data)}
      ></CameraView>
    </View>
  );
}
