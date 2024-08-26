import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserView } from "@/src/components/browser-view";
import { jsPDF } from "jspdf";
import { Buffer } from "buffer"; // Importa o Buffer do pacote buffer
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_INVOICE } from "@/src/graphql/queries";
import { client } from "@/src/api/client";
import autoTable from "jspdf-autotable";
import { useCompany } from "@/src/hooks/use-company";
import { useStore } from "@/src/hooks/use-store";
import { theme } from "@/tailwind.config";
import { imgToBase64 } from "@/src/utils/get-base64-image";
import { calCharges, totalCharges } from "@/src/hooks/use-order";
import { formatMoney } from "@/src/utils/format-money";
import { parsePhoneNumber } from "libphonenumber-js";
import { useAssets } from "expo-asset";
import { fontVFS } from "../../../../src/utils/font";

const Proof = () => {
  const { params } = useRoute<any>();
  const { company } = useCompany();
  const { store } = useStore();
  const { data } = useQuery(GET_INVOICE, {
    client: client,
    variables: {
      id: params?.slug,
    },
  });

  const prepareOrders = useCallback((orders: OrderType[]) => {
    const _products: {
      [Symbol in string]: {
        extra: ProductType | ServiceType;
        qtd: number;
        totalChargers: number;
        total: number;
        charges: number;
      };
    } = {};

    const _services: typeof _products = {};

    orders.forEach(({ products, services }) => {
      products.forEach((product) => {
        const keys = Object.keys(_products);

        if (keys.includes(product.id)) {
          const qtd = _products[product.id].qtd + 1;
          const total = qtd * product.price;
          _products[product.id] = {
            ..._products[product.id],
            totalChargers: qtd * _products[product.id].totalChargers,
            qtd,
            total,
          };
        } else {
          _products[product.id] = {
            extra: product,
            qtd: 1,
            totalChargers:
              calCharges(product.price, product.charges) +
              calCharges(product.price, product.category.charges),
            total: product.price,
            charges:
              totalCharges(product.charges) +
              totalCharges(product.category.charges),
          };
        }
      });
      services.forEach((service) => {
        const keys = Object.keys(_services);

        if (keys.includes(service.id)) {
          const qtd = _services[service.id].qtd + 1;
          _services[service.id] = {
            ..._services[service.id],
            totalChargers: qtd * _services[service.id].totalChargers,
            qtd,
            total: qtd * service.price,
          };
        } else {
          _services[service.id] = {
            extra: service,
            qtd: 1,
            totalChargers:
              calCharges(service.price, service.charges) +
              calCharges(service.price, service.category.charges),
            total: service.price,
            charges:
              totalCharges(service.charges) +
              totalCharges(service.category.charges),
          };
        }
      });
    });

    return {
      products: _products,
      services: _services,
    };
  }, []);

  const getItemsBody = (data: any) =>
    Object.keys(data as any).map((key, index) => {
      const item = data[key];

      return [
        index + 1,
        item.extra.name,
        item.qtd + " UN",
        formatMoney(item.extra.price),
        Number(item.charges).toFixed(2) + " %",
        formatMoney(item.total),
      ];
    });

  const generateBase64 = async (data: InvoiceType) => {
    const doc = new jsPDF();
    try {
      doc.addFileToVFS("Roboto-Medium-normal.ttf", fontVFS);
      const imageURL =
        "https://scontent-cpt1-1.xx.fbcdn.net/v/t39.30808-6/420291050_345257294988593_8915488021909078464_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHCi2VqF5OPcqFYuoobYWzQIEN_T4wfY9EgQ39PjB9j0Wc6sreXxk5EPn4okXDymIOW5FlStxFm1GaPXVlaYF5X&_nc_ohc=vSoyoKYLLNsQ7kNvgHycd9B&_nc_ht=scontent-cpt1-1.xx&cb_e2o_trans=t&oh=00_AYDamVBAPNH_pe8jtCtwF50gphBtVq4UkX5sYqSBk_L88g&oe=66CF5DF1";

      doc.addFont("Roboto-Medium-normal.ttf", "Roboto-Medium", "normal");

      var img = new Image();

      img.src = imageURL;

      doc.addImage(img, "JPG", doc.internal.pageSize.width - 35, 15, 20, 20);

      const { products, services } = prepareOrders(data.sale.orders);

      let total = 0;
      let totalCharges = 0;

      Object.keys(products).map((key) => {
        total = total + products[key].total;
        totalCharges = totalCharges + products[key].totalChargers;
      });

      Object.keys(services).map((key) => {
        total = total + services[key].total;
        totalCharges = totalCharges + services[key].totalChargers;
      });

      autoTable(doc, {
        head: [
          [
            {
              title: company?.name,
              styles: {
                fontSize: 12,
                font: "Roboto-Medium",
                fontStyle: "bold",
                textColor: "black",
              },
            },
            null,
          ],
        ],
        body: [
          [
            {
              title: `Contribuente Nº ${company?.nif}\nEndereço: ${company?.address}`,
              styles: {
                fontSize: 9,
                font: "Roboto-Medium",
                textColor: "gray",
              },
            },
            null,
          ],
        ],
        theme: "plain",
      });

      autoTable(doc, {
        head: [
          [
            {
              title:
                "\n\nFatura nº FT " +
                new Date(data.createdAt).getFullYear() +
                "/" +
                data.number,
              styles: {
                fontSize: 9,
                textColor: "black"
              },
            },
            "",
          ],
        ],
        styles: {
          fontSize: 9,
          font: "Roboto-Medium",
          textColor: "gray",
        },
        body: [
          [
            {
              title: `Data de entrega: ${new Date()
                .toLocaleDateString()
                .split("/")
                .join(".")}\nLocal de entrega: ${
                store.designation
              }\nData de emissão: ${new Date(data.createdAt)
                .toLocaleDateString()
                .split("/")
                .join(".")}\n\nEntidade: ${
                data.sale.client?.type === "LEGAL" ? "Jurídica" : "Física"
              }\nDoc.: ${data.sale.client?.nif}`,
              styles: {
                halign: "left",
                fontSize: 9,
              },
            },
            {
              title: `Sr.\n${data.sale.client?.fullName}\n${
                data.sale.client?.address
              }\n${parsePhoneNumber(
                data.sale.client?.phone ?? "+244999999999"
              ).formatInternational()}`,
              styles: {
                halign: "left",
                fontSize: 9,
                cellWidth: "wrap",
                lineWidth: 0.1,
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(doc, {
        head: [
          [
            "#",
            "Denominação",
            "Qtd.",
            "Preço unitário",
            "Imposto",
            "Valor total s/ Imposto",
          ],
        ],
        styles: {
          fontSize: 9,
          font: "Roboto-Medium",
          fontStyle: "normal",
        },
        body: getItemsBody(products).concat(getItemsBody(services)),
        headStyles: {
          fillColor: theme.extend.colors.primary[400],
        },
        theme: "striped",
      });

      autoTable(doc, {
        startY: doc.internal.pageSize.height - 40,
        head: [
          [
            {
              title: "ILIQUIDO: " + formatMoney(total),
              styles: {
                valign: "middle",
                halign: "left",
                fontStyle: "bold",
              },
            },
            {
              title: "MONTANTE IMP. DEVIDO: " + formatMoney(totalCharges),
              styles: {
                valign: "middle",
                halign: "center",
                fontStyle: "bold",
              },
            },
            {
              title: "VALOR TOTAL: " + formatMoney(total + totalCharges),
              styles: {
                valign: "middle",
                halign: "right",
                fontStyle: "bold",
              },
            },
          ],
        ],
        foot: [
          [
            {
              title:
                "\n\n\n\nKulanda - processado por programa valido, SAP n.º XXX/AGT/2024",
              colSpan: 3,
              styles: {
                fontSize: 7,
                halign: "center",
              },
            },
          ],
        ],
        styles: {
          fontSize: 9,
          font: "Roboto-Medium",
          fontStyle: "bold",
          lineWidth: 0.05,
        },
        theme: "plain",
      });

      doc.save(data.id + ".pdf");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 mt-2.5">
      <TouchableOpacity
        onPress={() => {
          if (data?.getInvoice && Platform.OS === "web") {
            generateBase64(data?.getInvoice);
          }
        }}
      >
        <Text>Imprimir</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Proof;
