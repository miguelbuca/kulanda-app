import { View, Text, Platform } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";

export interface BrowserViewProps {
  url: string;
}

export const BrowserView = ({ url }: BrowserViewProps) => {
  return Platform.OS !== "web" ? (
    <WebView
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: 'red'
      }}
      onError={(error) => console.log(error)}
      originWhitelist={['*']}
      source={{ html: '<h1><center>Hello world</center></h1>' }}
    />
  ) : (
    <iframe
      style={{
        flex: 1,
        border: "none",
      }}
      src={url}
    />
  );
};
