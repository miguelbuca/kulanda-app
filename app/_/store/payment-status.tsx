import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import { useOrder } from "@/src/hooks/use-order";
import { Button } from "@/src/components";

import * as Print from "expo-print";
import { Receipt } from "@/src/templates";

const PaymentStatus = () => {
  const { lastSale } = useOrder();

  const print = async () => {
    if (!lastSale) return;
    await Print.printAsync({
      html: Receipt(lastSale),
      width: 210
    });
  };

  return (
    <SafeAreaView className="flex-1 p-8 bg-white">
      <View className="flex-1 flex items-center justify-center">
        <QRCode backgroundColor="transparent" size={200} value={lastSale?.id} />
      </View>
      <View className="px-6">
        <Button onPress={print}>Imprimir fatura</Button>
      </View>
    </SafeAreaView>
  );
};

export default PaymentStatus;
