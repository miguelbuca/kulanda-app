import React from "react";
import { Accordion, AccordionProps, Table, TableProps } from "@/src/components";
import {
  GET_CATEGORIES,
  GET_CHARGES_BY_STORE,
  GET_CLIENTS,
  GET_PRODUCTS_BY_STORE,
  GET_SALE_BY_STORE,
  GET_SERVICES_BY_STORE,
  GET_SUPPLIERS,
  GET_USERS,
} from "@/src/graphql/queries";
import { useDevice } from "@/src/hooks/use-device";
import { formatMoney } from "@/src/utils/format-money";
import { Feather, Ionicons } from "@expo/vector-icons";
import { parsePhoneNumber } from "libphonenumber-js";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import * as Linking from "expo-linking";
import { Barcode } from "expo-barcode-generator";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/use-auth";
import { useStore } from "@/src/hooks/use-store";
import { getApiFile } from "@/src/utils/get-api-file";
import { getStock } from "@/src/utils/product";

interface TablePropsList
  extends TableProps,
    Pick<AccordionProps, "withAddEvent"> {}

const Settings = () => {
  const { type } = useDevice();
  const route = useRouter();
  const { user } = useAuth();

  const { store } = useStore();

  const tables: TablePropsList[] = [
    {
      name: "Usuários",
      document: GET_USERS,
      withAddEvent() {
        route.push("_/store/user/create");
      },
      isValidRow(value: UserType) {
        return value.id !== user.id;
      },
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/user/" + value.id);
            break;

          default:
            break;
        }
      },
      renderColumn: {
        fullName: () => "Nome completo",
        phone: () => "Telemóvel",
        email: () => "E-mail",
        access: () => "Accesso",
      },
      renderCell: {
        phone: (value) => {
          return (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "tel:" + parsePhoneNumber(value).formatInternational()
                )
              }
            >
              <View className="flex flex-row">
                <Feather name="external-link" size={10} />
                <Text className="flex text-[10px] ml-1">
                  {parsePhoneNumber(value).formatInternational()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        },
        email: (value) => {
          return (
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:" + value)}
            >
              <View className="flex flex-row">
                <Feather name="external-link" size={10} />
                <Text className="flex text-[10px] ml-1">{value}</Text>
              </View>
            </TouchableOpacity>
          );
        },
      },
    },
    {
      name: "Clientes",
      document: GET_CLIENTS,
      withAddEvent() {
        route.push("_/store/customer/create");
      },
      withSearch: "fullName",
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/customer/" + value.id);
            break;

          default:
            break;
        }
      },
      renderCell: {
        phone: (value) => {
          return (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "tel:" + parsePhoneNumber(value).formatInternational()
                )
              }
            >
              <View className="flex flex-row">
                <Feather name="external-link" size={10} />
                <Text className="flex text-[10px] ml-1">
                  {parsePhoneNumber(value).formatInternational()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        },
        email: (value) => {
          return (
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:" + value)}
            >
              <View className="flex flex-row">
                <Feather name="external-link" size={10} />
                <Text className="flex text-[10px] ml-1">{value}</Text>
              </View>
            </TouchableOpacity>
          );
        },
      },
      renderColumn: {
        fullName: () => "Nome completo",
        phone: () => "Telemóvel",
        email: () => "E-mail",
        access: () => "Accesso",
        type: () => "Tipo de pessoa",
        address: () => "Endereço",
      },
    },
    {
      name: "Fornecedores",
      document: GET_SUPPLIERS,
      withAddEvent() {
        route.push("_/store/supplier/create");
      },
      withSearch: "fullName",
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/supplier/" + value.id);
            break;

          default:
            break;
        }
      },
      renderCell: {
        phone: (value) => {
          return (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "tel:" + parsePhoneNumber(value).formatInternational()
                )
              }
            >
              <View className="flex flex-row">
                <Feather name="external-link" size={10} />
                <Text className="flex text-[10px] ml-1">
                  {parsePhoneNumber(value).formatInternational()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        },
        email: (value) => {
          return (
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:" + value)}
            >
              <View className="flex flex-row">
                <Feather name="external-link" size={10} />
                <Text className="flex text-[10px] ml-1">{value}</Text>
              </View>
            </TouchableOpacity>
          );
        },
      },
      renderColumn: {
        fullName: () => "Nome completo",
        phone: () => "Telemóvel",
        email: () => "E-mail",
        access: () => "Accesso",
        type: () => "Tipo de pessoa",
        address: () => "Endereço",
      },
    },
    {
      name: "Emolumentos",
      document: GET_CHARGES_BY_STORE,
      withAddEvent() {
        route.push("_/store/charges/create");
      },
      isValidRow(value) {
        return value.type !== "DISCOUNT";
      },
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/charges/" + value.id);
            break;

          default:
            break;
        }
      },
      renderColumn: {
        name: () => "Nome",
        percentage: () => "(%) Percentagem",
        type: () => "Tipo",
        acronym: () => "acrônimo",
      },
    },
    {
      name: "Categorias",
      document: GET_CATEGORIES,
      withAddEvent() {
        route.push("_/store/category/create");
      },
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/category/" + value.id);
            break;

          default:
            break;
        }
      },
      renderColumn: {
        name: () => "Nome",
        description: () => "Descrição",
        type: () => "Tipo",
      },
    },
    {
      name: "Produtos",
      document: GET_PRODUCTS_BY_STORE,
      withAddEvent() {
        route.push("_/store/product/create");
      },
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/product/" + value.id);
            break;

          default:
            break;
        }
      },
      withSearch: "name",
      excludColumns: ["category", "charges"],
      renderCell: {
        image: (value) => {
          return (
            <Image
              className="w-10 h-10 rounded-xl"
              resizeMode="stretch"
              source={{
                uri: getApiFile(value),
              }}
            />
          );
        },
        price: (value) => {
          return formatMoney(Number(value));
        },
        stock: (stock) => {
          const value = getStock(stock);
          return (
            <Text
              className={`text-xs font-bold ${
                Number(value) < 10 ? "text-red-700" : "text-green-700"
              }`}
            >
              {Number(value)}
            </Text>
          );
        },
      },
      renderColumn: {
        name: () => "Nome",
        category: () => "Categoria",
        image: () => "Imagem",
        description: () => "Descrição",
        price: () => "Preço unitário",
        stock: () => "Quantidade em estoque",
      },
    },
    {
      name: "Serviços",
      document: GET_SERVICES_BY_STORE,
      withAddEvent() {
        route.push("_/store/service/create");
      },
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/service/" + value.id);
            break;

          default:
            break;
        }
      },
      withSearch: "name",
      excludColumns: ["category", "charges"],
      renderCell: {
        image: (value) => {
          return (
            <Image
              className="w-10 h-10 rounded-xl"
              resizeMode="stretch"
              source={{
                uri: getApiFile(value),
              }}
            />
          );
        },
        price: (value) => {
          return formatMoney(Number(value));
        },
        stock: (value) => {
          return (
            <Text
              className={`text-xs font-bold ${
                Number(value) < 10 ? "text-red-700" : "text-green-700"
              }`}
            >
              {Number(value)}
            </Text>
          );
        },
      },
      renderColumn: {
        name: () => "Nome",
        category: () => "Categoria",
        image: () => "Imagem",
        description: () => "Descrição",
        price: () => "Preço unitário",
        stock: () => "Quantidade em estoque",
      },
    },
    {
      name: "Descontos",
      document: GET_CHARGES_BY_STORE,
      withAddEvent() {
        route.push("_/store/discont/create");
      },
      excludColumns: ["type", "acronym"],
      isValidRow(value) {
        return value.type === "DISCOUNT";
      },
      onEventHandler(type, value: UserType) {
        switch (type) {
          case "edit":
            route.push("_/store/discont/" + value.id);
            break;

          default:
            break;
        }
      },
      renderColumn: {
        name: () => "Nome",
        percentage: () => "(%) Percentagem",
      },
    },
    {
      name: "Vendas",
      document: GET_SALE_BY_STORE,
      withAddEvent() {
        route.push("_/store/main");
      },
      canDeleteRow: false,
      withPrint: true,
      renderCell: {
        client: (client: Pick<ClientType, "id" | "fullName">) => {
          return client.fullName;
        },
        change: (value) => {
          return formatMoney(Number(value));
        },
        cash: (value) => {
          return formatMoney(Number(value));
        },
        bankCard: (value) => {
          return formatMoney(Number(value));
        },
        totalPrice: (value) => {
          return formatMoney(Number(value));
        },
        seller: (value: UserType) => {
          return (
            <Text className="flex text-[10px] ml-1">{value.fullName}</Text>
          );
        },
        orders: (values: OrderType[]) => {
          let _products: {
            [Symbol in string]: number;
          } = {};

          let _services: {
            [Symbol in string]: number;
          } = {};

          values.forEach(({ products, services }) => {
            products.forEach(({ name }) => {
              if (_products[name]) _products[name] = _products[name] + 1;
              else _products[name] = 1;
            });
            services.forEach(({ name }) => {
              if (_services[name]) _services[name] = _services[name] + 1;
              else _services[name] = 1;
            });
          });

          return (
            <View className="flex flex-col">
              {Object.keys(_products) && (
                <View className="flex flex-row flex-wrap justify-end">
                  {Object.keys(_products).map((value, index, arr) => (
                    <Text className="flex text-[10px] ml-1" key={index}>
                      {value}({_products[value]})
                      {index + 1 !== arr.length ? "," : ""}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          );
        },
        code: (value: number) => {
          return (
            <Barcode
              value={String(value)}
              options={{
                format: "CODE128",
                background: "#ffffff",
                height: 40,
                width: 2,
                displayValue: false,
              }}
            />
          );
        },
      },
      onEventHandler(type, value) {
        switch (type) {
          case "print":
            route.push("_/store/invoice/" + value.id);
            break;

          default:
            break;
        }
      },
      renderColumn: {
        client: () => "Cliente",
        change: () => "Troco",
        cash: () => "Dinheiro",
        bankCard: () => "Transação bancária",
        totalPrice: () => "Total",
        seller: () => "Vendedor",
        orders: () => "Pedidos",
      },
    },
  ];

  return (
    <FlatList
      className="flex-1 p-6 bg-gray-50 pb-8"
      data={tables.filter((item) => {
        if (item.name === "Produtos" && store.saleType === "SERVICE")
          return false;
        if (item.name === "Serviços" && store.saleType === "PRODUCT")
          return false;
        return true;
      })}
      renderItem={({ item, index }) => (
        <>
          <Accordion
            style={{
              marginBottom: tables.length - 1 === index ? 30 : 15,
            }}
            title={item.name}
            icon={item.icon}
            key={index}
            withAddEvent={item.withAddEvent}
          >
            <Table
              limit={
                type === "PHONE" || type === "UNKNOWN"
                  ? 3
                  : type === "TABLET"
                  ? 5
                  : 10
              }
              {...item}
            />
          </Accordion>
        </>
      )}
    />
  );
};
export default Settings;
