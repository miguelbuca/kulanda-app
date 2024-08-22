import { View, Text, SafeAreaView, ScrollView, Platform } from "react-native";
import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { Receipt } from "@/src/templates";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const Invoice = () => {
  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html: Receipt({} as any) });
    console.log("File has been saved to:", uri);
    //await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  useEffect(() => {
    printToFile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-6">
        <View className="bg-white shadow-sm">
          {Platform.OS !== "web" ? (
            <WebView
              originWhitelist={["*"]}
              source={{ html: "<h1><center>Hello world</center></h1>" }}
            />
          ) : (
            <View>{Receipt({} as any)}</View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invoice;
