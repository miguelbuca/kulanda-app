import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
import { Button, Categories, Input, Order, Products } from "@/src/components";
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
  const [name, setName] = useState("");

  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["1%", "90%"], []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={1} />,
    []
  );

  const filter: FilterProductInput | FilterServiceInput = useMemo(() => {
    return {
      categoryId: selectedCategory?.id,
      name,
    };
  }, [selectedCategory, name]);

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
        <View className="flex flex-col flex-1 mt-8">
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
            {user.access === "OWNER" && (
              <TouchableOpacity>
                <View className="flex flex-row p-2 items-center bg-primary-500 rounded-[100px]">
                  <Text className="text-white font-semibold mx-2 text-base">
                    Gerir loja
                  </Text>
                  <View className="bg-white p-2 rounded-full">
                    <Ionicons name="storefront-outline" size={25} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-1 flex flex-col pt-0">
            <Categories onPress={setSelectedCategory} />
            <View className="flex flex-row px-10 items-center">
              <Input
                placeholder="Encontrar produto, serviço..."
                className="flex-1 bg-white shadow-sm mr-4"
                onChangeText={setName}
              />
              <View>
                <Button className="flex items-center justify-center p-3 h-auto bg-white shadow-sm">
                  <Ionicons
                    name="options-outline"
                    color={theme.extend.colors.primary[500]}
                    size={25}
                  />
                </Button>
              </View>
            </View>
            <Products filter={filter} />
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
      <ScrollView>
        <View className="flex flex-col">
          <View className="flex flex-row px-4 items-center mt-6 mb-4">
            <Input
              placeholder="Encontrar produto, serviço..."
              className="flex-1 bg-white shadow-sm mr-4 text-sm"
              placeholderTextColor={"gray"}
              onChangeText={setName}
            />
            <View>
              <Button className="flex items-center justify-center p-3 h-auto bg-white shadow-sm">
                <Ionicons
                  name="options-outline"
                  color={theme.extend.colors.primary[500]}
                  size={25}
                />
              </Button>
            </View>
          </View>
          <Categories onPress={setSelectedCategory} />
          <Products filter={filter} />
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
