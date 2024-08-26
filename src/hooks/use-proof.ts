import { fontVFS } from "@/src/utils/font";
import { theme } from "@/tailwind.config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { parsePhoneNumber } from "libphonenumber-js";
import { useCallback, useState } from "react";
import { formatMoney } from "../utils/format-money";
import {
  calCharges,
  compactCharges,
  compactDisconts,
  totalCharges,
} from "./use-order";
import { client } from "../api/client";
import { GET_INVOICE } from "../graphql/queries";
import { getApiFile } from "../utils/get-api-file";
import QRCode from "qrcode";

export interface useProofDoc {
  store: StoreType;
  company?: CompanyType;
}

export const useProof = ({ company, store }: useProofDoc) => {
  const prepareOrders = useCallback((orders: OrderType[]) => {
    const _products: {
      [Symbol in string]: {
        extra: ProductType | ServiceType;
        qtd: number;
        totalChargers: number;
        total: number;
        charges: string;
        disconts: string;
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
              product.charges.filter(({ type }) => type !== "DISCONT").length ||
              product.category.charges.filter(({ type }) => type !== "DISCONT")
                .length
                ? compactCharges(product.charges).join(", ") +
                  compactCharges(product.category.charges).join(", ")
                : "0.00 %",
            disconts:
              product.charges.filter(({ type }) => type === "DISCONT").length ||
              product.category.charges.filter(({ type }) => type === "DISCONT")
                .length
                ? compactDisconts(product.charges).join(", ") +
                  compactDisconts(product.category.charges).join(", ")
                : "0.00 %",
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
              service.charges.filter(({ type }) => type !== "DISCONT").length ||
              service.category.charges.filter(({ type }) => type !== "DISCONT")
                .length
                ? compactCharges(service.charges).join(", ") +
                  compactCharges(service.category.charges).join(", ")
                : "0.00 %",
            disconts:
              service.charges.filter(({ type }) => type === "DISCONT").length ||
              service.category.charges.filter(({ type }) => type === "DISCONT")
                .length
                ? compactDisconts(service.charges).join(", ") +
                  compactDisconts(service.category.charges).join(", ")
                : "0.00 %",
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
        item.charges,
        item.disconts,
        formatMoney(item.total),
      ];
    });

  const generateWebPDF = async (id: string) => {
    try {
      const {
        data: { getInvoice: data },
      } = await client.query({
        query: GET_INVOICE,

        variables: {
          id,
        },
      });
      const doc = new jsPDF();
      doc.addFileToVFS("Roboto-Medium-normal.ttf", fontVFS);
      doc.addFont("Roboto-Medium-normal.ttf", "Roboto-Medium", "normal");

      var qrcode = new Image();

      qrcode.src = await QRCode.toDataURL(id);

      const imageURL = company?.logo ? getApiFile(company?.logo) : "";
      if (imageURL) {
        var img = new Image();

        img.src = imageURL;

        doc.addImage(img, "JPG", doc.internal.pageSize.width - 35, 15, 20, 20);
      }

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
                fontSize: 14,
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
                fontSize: 8,
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
                textColor: "black",
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
              title: `Data de entrega  : ${new Date()
                .toLocaleDateString()
                .split("/")
                .join(".")}\nLocal de entrega: ${
                store.designation + " - " + store.address
              }\nData de emissão: ${new Date(data.createdAt)
                .toLocaleDateString()
                .split("/")
                .join(".")}\n\Pessoa: ${
                data.sale.client?.type === "LEGAL" ? "Jurídica" : "Física"
              }\n\nDoc. Pessoal/Serviço: ${data.sale.client?.nif}`,
              styles: {
                halign: "left",
                fontSize: 8,
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
            "Disc.",
            "Valor total s/ Imposto",
          ],
        ],
        styles: {
          fontSize: 9,
          font: "Roboto-Medium",
          fontStyle: "normal",
        },
        body: getItemsBody(products).concat(getItemsBody(services)),
        foot: data?.observation
          ? [
              [
                {
                  title: "\n\n\n\n\n" + data?.observation,
                  colSpan: 7,
                  styles: {
                    halign: "justify",
                    valign: "middle",
                    font: "Roboto-Medium",
                    textColor: "black",
                    fontStyle: "normal",
                    fillColor: "white",
                  },
                },
              ],
            ]
          : undefined,
        headStyles: {
          fillColor: theme.extend.colors.primary[400],
        },
        theme: "striped",
      });

      autoTable(doc, {
        startY: doc.internal.pageSize.height - 55,
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
              title: "Assinatura:\n\n\n\n",
              colSpan: 2,
              styles: {
                fontSize: 9,
                halign: "left",
                valign: "top",
                font: "Roboto-Medium",
              },
            },
            "",
          ],
          [
            {
              title:
                "\nKulanda - processado por programa valido, SAP n.º XXX/AGT/2024",
              colSpan: 3,
              styles: {
                fontSize: 6,
                halign: "center",
                font: "Roboto-Medium",
                lineWidth: 0,
              },
            },
          ],
        ],
        willDrawCell: (data) => {
          if (data.column.index === 2 && data.section === "foot" && qrcode) {
            // Adicione a imagem dentro da célula
            const cellHeight = data.cell.height;
            const cellWidth = data.cell.width;
            const imgSize = Math.min(cellHeight, cellWidth); // Ajusta o tamanho da imagem conforme a célula

            const imgX = data.cell.x + (cellWidth - imgSize) / 2; // Centraliza horizontalmente
            const imgY = data.cell.y + (cellHeight - imgSize) / 2; // Centraliza verticalmente

            doc.addImage(qrcode, "PNG", imgX, imgY, imgSize, imgSize);
          }
        },
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

  return {
    prepareOrders,
    generateWebPDF,
    getItemsBody,
  };
};
