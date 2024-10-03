import { Platform, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserView } from "@/src/components/browser-view";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_INVOICE } from "@/src/graphql/queries";
import { client } from "@/src/api/client";
import { useCompany } from "@/src/hooks/use-company";
import { useStore } from "@/src/hooks/use-store";
import { calCharges, totalCharges } from "@/src/hooks/use-order";
import { formatMoney } from "@/src/utils/format-money";
import { jsPDF } from "jspdf";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { generateHTML } from "@/src/utils/generate-html";
import { Ionicons } from "@expo/vector-icons";

const Proof = () => {
  const iframe = useRef<HTMLIFrameElement>();
  const [html, setHtml] = useState("");

  const { params } = useRoute<any>();
  const { company } = useCompany();
  const { store } = useStore();

  const { data } = useQuery(GET_INVOICE, {
    client: client,
    variables: {
      id: params?.slug,
    },
  });

  const buildHTML = useCallback(async () => {
    setHtml(await generateHTML(company, data?.getInvoice, store, params?.type));
  }, [company, data, params]);

  useEffect(() => {
    buildHTML();
  }, [company, data]);

  return (
    <View className="flex-1 relative flex flex-col bg-gray-50">
      <View className="absolute z-50 right-10 bottom-10 bg-primary-400 h-16 w-16 shadow-lg justify-center items-center rounded-full">
        <TouchableOpacity
          onPress={() => {
            if (Platform.OS !== "web") {
              Print.printAsync({
                html,
                width: 794,
                height: 1123,
              });
            } else iframe.current?.contentWindow?.print();
          }}
        >
          <Ionicons name="print-outline" color={"#fff"} size={44}/>
        </TouchableOpacity>
      </View>
      {html ? (
        <BrowserView<typeof iframe>
          iframe={{
            ref: iframe,
          }}
          html={html}
        />
      ) : null}
    </View>
  );
};

export default Proof;
