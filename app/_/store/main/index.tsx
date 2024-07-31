import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  Categories,
  Input,
  Order,
  Products,
  Services,
  SwitchServiceOrProduct,
  SwitchServiceOrProducType,
} from "@/src/components";
import { SplashScreen, useNavigation } from "expo-router";
import { useAuth } from "@/src/hooks/use-auth";
import { useStore } from "@/src/hooks/use-store";
import { theme } from "@/tailwind.config";
import { useDevice } from "@/src/hooks/use-device";
import { Modalize } from "react-native-modalize";
import { useOrder } from "@/src/hooks/use-order";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

const { height } = Dimensions.get("screen");

const Main = () => {
  const { user } = useAuth();
  const { store } = useStore();
  const { type } = useDevice();
  const { items } = useOrder();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>();
  const [swithType, setSwithType] =
    useState<SwitchServiceOrProducType>("PRODUCT");
  const [name, setName] = useState("");

  const [filter, setFilter] = useState<FilterProductInput | FilterServiceInput>(
    {}
  );

  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["1%", "90%"], []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={1} />,
    []
  );

  const handleFilter = useCallback(() => {
    setFilter({
      categoryId: selectedCategory?.id,
      name,
    });
  }, [name, selectedCategory]);

  useEffect(() => {
    handleFilter();
  }, [selectedCategory]);

  useEffect(() => {
    if (name === "") {
      handleFilter();
    }
  }, [name]);

  useEffect(() => {
    if (type === "PHONE") {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => bottomSheetModalRef.current?.present()}
          >
            <View className="relative mr-4 p-2 pr-2">
              <Ionicons
                name="cart-outline"
                color={theme.extend.colors.primary[500]}
                size={24}
              />
              <View className="absolute right-0.5 top-0 items-center justify-center border-white border-[2px] h-5 w-5 bg-red-500 rounded-full">
                <Text className="font-semibold text-white text-[9px]">
                  {items.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ),
      });
    }
  }, [type, items]);

  return type !== "PHONE" ? (
    <View
      onLayout={() => {
        SplashScreen.hideAsync();
      }}
      className="flex flex-row flex-1 bg-gray-50"
    >
      <ScrollView>
        <View
          className={`flex flex-col flex-1 ${
            type === "TABLET" ? "mt-8" : "mt-2"
          }`}
        >
          <View className="flex flex-row items-center  p-8 px-10 pt-6">
            <View className="flex-1 flex flex-col">
              <Text className="text-3xl font-semibold">
                {store.designation}
              </Text>
              <View className="flex flex-row items-center">
                <Text className="flex items-center text-xs mt-2 font-semibold opacity-30">
                  <Ionicons name="lock-closed-outline" /> {user.access}
                </Text>
                <Text className="flex items-center text-xs mt-2 font-semibold text-primary-500">
                  {" - "}
                  {user.fullName}
                </Text>
              </View>
            </View>
            <View>
              <SwitchServiceOrProduct onTypeChange={setSwithType} />
            </View>
          </View>
          <View className="flex-1 flex flex-col pt-0">
            <Categories swithType={swithType} onPress={setSelectedCategory} />
            <View className="flex flex-row px-10 items-center">
              <View className="flex-1">
                <Input
                  className="border border-primary-500 bg-white shadow-sm"
                  placeholder="Encontrar produto, serviço..."
                  onChangeText={setName}
                />
              </View>
              <View className="ml-3">
                <Button
                  onPress={handleFilter}
                  className="flex items-center justify-center p-3 h-auto bg-white shadow-sm"
                >
                  <Ionicons
                    name="search-outline"
                    color={theme.extend.colors.primary[500]}
                    size={25}
                  />
                </Button>
              </View>
            </View>
            <View className="flex flex-col mb-4">
              {swithType === "PRODUCT" ? (
                <Products filter={filter} />
              ) : (
                <Services filter={filter} />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Order />
    </View>
  ) : (
    <SafeAreaView
      onLayout={() => {
        SplashScreen.hideAsync();
      }}
      className="flex-1 bg-gray-50"
    >
      <View className="absolute bottom-6 w-full z-20 flex justify-center items-center mt-6">
        <View className="flex justify-center items-center">
          <SwitchServiceOrProduct onTypeChange={setSwithType} />
        </View>
      </View>
      <ScrollView className="relative">
        <View className="flex flex-col">
          <View className="flex flex-row px-4 items-center mt-6 mb-4">
            <View className="flex flex-1">
              <Input
                placeholder="Encontrar produto, serviço..."
                placeholderTextColor={"gray"}
                className="border border-primary-500 bg-white shadow-sm"
                onChangeText={setName}
              />
            </View>
            <View className="ml-3">
              <Button
                onPress={handleFilter}
                className="flex items-center justify-center p-3 h-auto bg-white shadow-sm"
              >
                <Ionicons
                  name="search-outline"
                  color={theme.extend.colors.primary[500]}
                  size={25}
                />
              </Button>
            </View>
          </View>
          <Categories swithType={swithType} onPress={setSelectedCategory} />
          <View className="flex flex-col mb-4">
            {swithType === "PRODUCT" ? (
              <Products filter={filter} />
            ) : (
              <Services filter={filter} />
            )}
          </View>
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        contentHeight={height}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onDismiss={() => bottomSheetModalRef.current?.close()}
        onChange={(index) => !index && bottomSheetModalRef.current?.close()}
        enableDynamicSizing
      >
        <BottomSheetScrollView>
          <Order onClose={() => bottomSheetModalRef.current?.forceClose()} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default Main;
