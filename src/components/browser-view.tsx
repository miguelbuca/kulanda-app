import { View, Text, Platform, ScrollView, Dimensions } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { Link } from "expo-router";

const { height } = Dimensions.get("window");

export interface BrowserViewProps<T> {
  html?: string;
  iframe?: {
    ref: T;
  };
}

export const BrowserView = <T,>({ iframe, html }: BrowserViewProps<T>) => {
  return Platform.OS !== "web" ? (
    <WebView
      style={{
        flex: 1,
        marginHorizontal: 16,
        marginVertical: 20,
        backgroundColor: "transparent",
      }}
      originWhitelist={["*"]}
      source={{ html: html ?? "" }}
    />
  ) : (
    <View className="relative justify-center items-center">
      <iframe
        ref={iframe?.ref as React.LegacyRef<HTMLIFrameElement>}
        style={{
          border: "none",
          width: "794px",
          height: height,
          top: 0,
          left: 0,
          padding: 0,
          margin: 0,
        }}
        srcDoc={html}
      />
    </View>
  );
};
