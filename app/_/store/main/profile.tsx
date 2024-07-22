import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import Avatar from "@/src/components/avatar";
import { useAuth } from "@/src/hooks/use-auth";
import { useRouter } from "expo-router";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { useDevice } from "@/src/hooks/use-device";
import { useCompany } from "@/src/hooks/use-company";
import { useStore } from "@/src/hooks/use-store";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "@/src/services";

const Profile = () => {
  const route = useRouter();

  const { user } = useAuth();

  const { type } = useDevice();
  const { company } = useCompany();
  const { store } = useStore();

  const logOut = useCallback(() => {
    storage.deleteValueFor("x-tenant-username");
    storage.deleteValueFor("x-tenant-key");
    storage.deleteValueFor("_kt");
    route.replace("/");
  }, [storage]);

  return (
    <View className="flex flex-row flex-1 bg-gray-50">
      <ScrollView className="flex flex-1 flex-col p-6">
        <View className="flex flex-row p-4 items-center bg-white shadow-sm rounded-xl">
          <Avatar user={user} />
          <View className="flex ml-3">
            <Text className="font-normal text-base">
              {user.fullName ?? "-"}
            </Text>
            <Text className="text-xs font-light">
              {(isValidPhoneNumber(user.phone) &&
                parsePhoneNumber(user.phone).formatInternational()) ??
                "-"}
            </Text>
            <TouchableOpacity
              onPress={() => route.push("_/store/user/" + user.id)}
            >
              <Text className="text-xs mt-3 font-semibold text-blue-500">
                Editar informações
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          className={`${
            type === "PHONE" ? "flex-col gap-y-4" : "flex-row gap-x-4"
          } mt-2`}
        >
          <View className="flex-col flex-1 bg-white shadow-sm rounded-xl p-4">
            <Text className="mb-5 text-xl mt-2">Meus dados</Text>
            <View className="flex flex-row justify-between">
              <Text className="text-xs">Nome</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {user?.fullName ?? "-"}
              </Text>
            </View>
            {isValidPhoneNumber(user?.phone) && (
              <View className="flex flex-row justify-between mt-2">
                <Text className="text-xs">Telemóvel</Text>
                <Text className="font-extralight text-xs w-[60%] text-right">
                  {parsePhoneNumber(user?.phone).formatInternational() ?? "-"}
                </Text>
              </View>
            )}
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-xs">E-mail</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {user?.email ?? "-"}
              </Text>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-xs">Nome de usuário</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {user?.username ?? "-"}
              </Text>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-xs">Acesso</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {user?.access ?? "-"}
              </Text>
            </View>
          </View>
          <View className="flex-col bg-white shadow-sm rounded-xl p-4">
            <Text className="mb-5 text-xl mt-2">Empresa</Text>
            <View className="flex flex-row justify-between">
              <Text className="text-xs">Empresa</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {company?.name ?? "-"}
              </Text>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-xs">NIF</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {company?.nif ?? "-"}
              </Text>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-xs">Atividade Econômica</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {company?.cae?.name ?? "-"}
              </Text>
            </View>

            <View className="flex flex-row justify-between mt-2 border-t border-gray-200 pt-2">
              <Text className="text-xs">Estabelecimento</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {store.designation ?? "-"}
              </Text>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-xs">Endereço</Text>
              <Text className="font-extralight text-xs w-[60%] text-right">
                {store.address ?? "-"}
              </Text>
            </View>
          </View>
        </View>
        {type === "PHONE" ? (
          <TouchableOpacity onPress={logOut}>
            <View className="flex flex-row mt-8 justify-center items-center">
              <View className="mr-2">
                <Ionicons
                  name="log-out-outline"
                  color={"rgb(239 68 68)"}
                  size={22}
                />
              </View>
              <Text className="font-semibold text-red-500">
                Terminar sessão
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Profile;
