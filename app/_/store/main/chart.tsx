import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STORE_REPORT } from "@/src/graphql/queries";
import { client } from "@/src/api/client";
import { useStore } from "@/src/hooks/use-store";
import { useAuth } from "@/src/hooks/use-auth";
import { formatMoney } from "@/src/utils/format-money";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { ColorGenerator } from "@/src/utils/color-generator";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { theme } from "@/tailwind.config";

const { width } = Dimensions.get("screen");

const Chart = () => {
  const { store } = useStore();
  const { user } = useAuth();

  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(0);

  const [options, setOptions] = useState<ReportStoreOptionsInput>({
    period: "DAY",
    from: new Date(),
    sellerId: user.access !== "SELLER" ? undefined : user.id,
  });

  const [report, setReport] = useState<ReportStoreType>();

  useQuery(GET_STORE_REPORT, {
    client: client,
    variables: {
      id: store.id,
      options,
    },
    fetchPolicy: "no-cache",
    onCompleted: ({ getStoreReport }) => setReport(getStoreReport),
  });

  useEffect(() => {
    setOptions({
      period: "DAY",
      from: new Date(),
      sellerId: user.access !== "SELLER" ? undefined : user.id,
    });
  }, []);

  const { products, services } = useMemo(() => {
    let upSaleProduct: any;
    let downSaleProduct: any;

    let upSaleService: any;
    let downSaleService: any;

    const products: {
      [Symbol in string]: barDataItem & { data?: ProductType };
    } = {};
    const serives: {
      [Symbol in string]: barDataItem & { data?: ServiceType };
    } = {};

    report?.sales.forEach(({ orders }) => {
      orders.forEach(({ products: prod, services: serv }) => {
        prod.forEach((product) => {
          if (!Object.keys(products).includes(product.id)) {
            products[product.id] = {
              value: 1,
              label: product.name,
              data: product,
            };
          } else {
            products[product.id] = {
              value: products[product.id].value + 1,
              label: product.name,
              data: product,
            };
          }
        });
        serv.forEach((service) => {
          if (!Object.keys(products).includes(service.id)) {
            serives[service.id] = {
              value: 1,
              label: service.name,
              data: service,
            };
          } else {
            serives[service.id] = {
              value: products[service.id].value + 1,
              label: service.name,
              data: service,
            };
          }
        });
      });
    });

    const productsBarData = Object.keys(products).map((id) => {
      const barItemData = products[id];

      if (!upSaleProduct && barItemData.data) {
        upSaleProduct = {
          ...barItemData.data,
          qtd: barItemData.value,
        };
      } else if (barItemData.data) {
        if (barItemData.value >= downSaleProduct?.qtd)
          upSaleProduct = {
            ...barItemData.data,
            qtd: barItemData?.value,
          };
      }

      if (!downSaleProduct && barItemData.data) {
        downSaleProduct = {
          ...barItemData.data,
          qtd: barItemData?.value,
        };
      } else if (barItemData.data) {
        if (barItemData.value <= downSaleProduct?.qtd)
          downSaleProduct = {
            ...barItemData.data,
            qtd: barItemData.value,
          };
      }

      delete barItemData.data;

      return {
        ...products[id],
        frontColor: theme.extend.colors.primary[500],
        gradientColor: "red",
      };
    });

    const servicesBarData = Object.keys(serives).map((id) => {
      const barItemData = serives[id];

      if (!upSaleService && barItemData.data) {
        upSaleService = {
          ...barItemData.data,
          qtd: barItemData.value,
        };
      } else if (barItemData.data) {
        if (barItemData.value >= downSaleProduct?.qtd)
          upSaleService = {
            ...barItemData.data,
            qtd: barItemData?.value,
          };
      }

      if (!downSaleService && barItemData.data) {
        downSaleService = {
          ...barItemData.data,
          qtd: barItemData.value,
        };
      } else if (barItemData.data) {
        if (barItemData.value <= downSaleProduct?.qtd)
          downSaleService = {
            ...barItemData.data,
            qtd: barItemData?.value,
          };
      }

      delete barItemData.data;

      return { ...serives[id] };
    });

    return {
      products: {
        data: productsBarData,
        up: upSaleProduct as ProductType & { qtd: number },
        down: downSaleProduct as ProductType & { qtd: number },
      },
      services: {
        data: servicesBarData,
        up: upSaleService as ServiceType & { qtd: number },
        down: downSaleService as ServiceType & { qtd: number },
      },
    };
  }, [report, ColorGenerator]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        /*  refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() =>
              refetch({
                options,
              })
            }
          />
        } */
        className="flex-1 flex flex-col"
      >
        <View className="mx-6 bg-white shadow-sm rounded-2xl p-4 mb-8 mt-8">
          <View className="flex flex-col">
            <Text className="font-normal text-xs mb-2 text-primary-500">
              Total de vendas
            </Text>
            <Text className="text-3xl font-light">
              {formatMoney(report?.totalSalesBalance ?? 0)}
            </Text>
          </View>
          <View className="mt-8">
            <SegmentedControl
              values={["Dia", "Semana", "Mês", "Ano"]}
              tintColor={"white"}
              fontStyle={{
                color: "#000",
              }}
              activeFontStyle={{
                color: "#000",
              }}
              selectedIndex={selectedPeriodIndex}
              onChange={(event) => {
                setSelectedPeriodIndex(event.nativeEvent.selectedSegmentIndex);
                switch (event.nativeEvent.selectedSegmentIndex) {
                  case 0:
                    setOptions((prev) => ({
                      ...prev,
                      period: "DAY",
                    }));
                    break;

                  case 1:
                    setOptions((prev) => ({
                      ...prev,
                      period: "WEEK",
                    }));
                    break;

                  case 2:
                    setOptions((prev) => ({
                      ...prev,
                      period: "MONTH",
                    }));
                    break;

                  default:
                    setOptions((prev) => ({
                      ...prev,
                      period: "YEAR",
                    }));
                    break;
                }
              }}
            />
          </View>
        </View>
        {products.data.length || services.data.length ? (
          <View className="mx-6 bg-white shadow-sm rounded-2xl px-4 pb-4">
            <View className="flex-1 mt-8 overflow-hidden">
              <View className="flex flex-col gap-y-6">
                {products.data.length && (
                  <View className="flex flex-col">
                    <Text className="mb-3">Produtos</Text>
                    <BarChart
                      data={products.data}
                      width={width - 160}
                      barWidth={20}
                      minHeight={3}
                      barBorderRadius={3}
                      spacing={50}
                      noOfSections={4}
                      yAxisThickness={0}
                      xAxisThickness={0}
                      xAxisLabelTextStyle={{
                        color: "gray",
                        fontSize: 8,
                      }}
                      yAxisTextStyle={{
                        color: "gray",
                        fontSize: 10,
                      }}
                      isAnimated
                      animationDuration={300}
                    />
                  </View>
                )}
                {services.data.length && (
                  <View className="flex flex-col">
                    <Text className="mb-3">Serviços</Text>
                    <BarChart
                      data={services.data}
                      width={width - 160}
                      barWidth={20}
                      minHeight={3}
                      barBorderRadius={3}
                      spacing={50}
                      noOfSections={4}
                      yAxisThickness={0}
                      xAxisThickness={0}
                      xAxisLabelTextStyle={{
                        color: "gray",
                        fontSize: 8,
                      }}
                      yAxisTextStyle={{
                        color: "gray",
                        fontSize: 10,
                      }}
                      isAnimated
                      animationDuration={300}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : null}
        {(products.up || services.up) && (
          <View className="flex flex-col mx-6 my-4">
            <View className=" bg-white shadow-sm rounded-2xl p-4 ">
              <Text className="mb-4">Mais vendido</Text>
              {[products.up, services.up].map((item, index) =>
                item?.id ? (
                  <View
                    key={index}
                    className={`flex flex-row items-center gap-x-2 py-2 ${
                      index === 1 && "border-t border-t-gray-100"
                    }`}
                  >
                    <View>
                      <View className="h-14 w-14">
                        <Image
                          className="h-full w-full rounded-md"
                          source={{
                            uri: item.image,
                          }}
                        />
                      </View>
                    </View>
                    <View className="flex flex-col">
                      <Text className="font-semibold">{item?.name}</Text>
                      <Text className="text-xs opacity-50">
                        <Text className="font-semibold">Categoria: </Text>
                        {item?.category.name}
                      </Text>
                      <Text className="text-xs opacity-50">
                        <Text className="font-semibold">Tipo: </Text>
                        {item?.category.type === "PRODUCT"
                          ? "Produto"
                          : "Serviço"}
                      </Text>
                      <Text className="text-xs opacity-50">
                        <Text className="font-semibold">Quantidade: </Text>
                        {item?.qtd}
                      </Text>
                    </View>
                  </View>
                ) : null
              )}
            </View>
          </View>
        )}
        {(products.down?.id || services.down?.id) && (
          <View className="flex flex-col mx-6 my-4">
            <View className=" bg-white shadow-sm rounded-2xl p-4 ">
              <Text className="mb-4">Menos vendido</Text>
              {[products.down, services.down].map((item, index) =>
                item?.id ? (
                  <View
                    key={index}
                    className={`flex flex-row items-center gap-x-2 py-2 ${
                      index === 1 && "border-t border-t-gray-100"
                    }`}
                  >
                    <View>
                      <View className="h-14 w-14">
                        <Image
                          className="h-full w-full rounded-md"
                          source={{
                            uri: item.image,
                          }}
                        />
                      </View>
                    </View>
                    <View className="flex flex-col">
                      <Text className="font-semibold">{item?.name}</Text>
                      <Text className="text-xs opacity-50">
                        <Text className="font-semibold">Categoria: </Text>
                        {item?.category.name}
                      </Text>
                      <Text className="text-xs opacity-50">
                        <Text className="font-semibold">Tipo: </Text>
                        {item?.category.type === "PRODUCT"
                          ? "Produto"
                          : "Serviço"}
                      </Text>
                      <Text className="text-xs opacity-50">
                        <Text className="font-semibold">Quantidade: </Text>
                        {item?.qtd}
                      </Text>
                    </View>
                  </View>
                ) : null
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chart;
