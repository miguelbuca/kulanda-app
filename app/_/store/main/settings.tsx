import React from "react";
import { Accordion, AccordionProps, Table, TableProps } from "@/src/components";
import {
  GET_CATEGORIES,
  GET_CHARGES_BY_STORE,
  GET_CLIENTS,
  GET_PRODUCTS_BY_STORE,
  GET_SALE_BY_STORE,
  GET_SERVICES_BY_STORE,
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

interface TablePropsList
  extends TableProps,
    Pick<AccordionProps, "withAddEvent"> {}

const Settings = () => {
  const { type } = useDevice();
  const route = useRouter();

  const tables: TablePropsList[] = [
    {
      name: "Usuários",
      icon: <Feather name="user" size={24} />,
      document: GET_USERS,
      withAddEvent() {
        route.push("_/store/user/create");
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
      icon: <Feather name="users" size={24} />,
      document: GET_CLIENTS,
      withAddEvent() {
        route.push("_/store/customer/create");
      },
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
    },
    {
      name: "Cobranças",
      icon: <Feather name="percent" size={22} />,
      document: GET_CHARGES_BY_STORE,
      withAddEvent() {
        route.push("_/store/charges/create");
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
    },
    {
      name: "Categorias",
      icon: <Ionicons name="git-pull-request-outline" size={24} />,
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
    },
    {
      name: "Produtos",
      icon: <Ionicons name="fast-food-outline" size={24} />,
      document: GET_PRODUCTS_BY_STORE,
      withAddEvent() {
        console.log("add new products!!");
      },
      withSearch: "name",
      excludColumns: ["category"],
      renderCell: {
        image: (value) => {
          return (
            <Image
              className="w-10 h-10 rounded-xl"
              resizeMode="stretch"
              source={{
                uri: value,
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
    },
    {
      name: "Serviços",
      icon: <Ionicons name="construct-outline" size={24} />,
      document: GET_SERVICES_BY_STORE,
      withAddEvent() {
        console.log("add new service!!");
      },
      withSearch: "name",
      renderCell: {
        image: (value) => {
          return (
            <Image
              className="w-10 h-10 rounded-xl"
              resizeMode="stretch"
              source={{
                uri: value,
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
    },
    {
      name: "Faturas",
      icon: <Ionicons name="receipt-outline" size={24} />,
      document: GET_SALE_BY_STORE,
      canDeleteRow: false,
      withPrint: true,
      renderCell: {
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
    },
  ];

  return (
    <FlatList
      className="flex-1 p-6 bg-gray-50 pb-8"
      data={tables}
      renderItem={({ item, index }) => (
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
      )}
    />
  );
};
export default Settings;
