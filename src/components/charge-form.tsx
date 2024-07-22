import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import * as z from "zod";
import { StatusBar } from "expo-status-bar";
import { useDevice } from "../hooks/use-device";
import { Select } from "./select";
import { Input } from "./input";
import { Button } from "./button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CHARGE } from "../graphql/mutations";
import { client } from "../api/client";
import { router, useRouter } from "expo-router";
import { useStore } from "../hooks/use-store";
import { GET_CHARGE_BY_ID } from "../graphql/queries";
import { Feather } from "@expo/vector-icons";

const schema = z.object({
  name: z.string(),
  acronym: z.string(),
  type: z.string(),
  percentage: z.number(),
});

export interface ChargeFormProps {
  chargeId?: string;
}

export const ChargeForm = ({ chargeId }: ChargeFormProps) => {
  const { store } = useStore();
  const { type } = useDevice();
  const [charge, setCharge] = useState<ChargeType>();
  const route = useRouter();

  const [createCharge, { loading: createLoading }] = useMutation(
    CREATE_CHARGE,
    {
      client: client,
      onCompleted(data) {
        if (data.createCharge?.id) route.back();
      },
      onError(error) {
        console.log(error.message);
      },
    }
  );

  useQuery(GET_CHARGE_BY_ID, {
    client: client,
    variables: {
      id: chargeId,
    },
    onCompleted(data) {
      delete data.getCharge.__typename;
      setCharge(data.getCharge);
    },
  });

  const handleSaveTenant = useCallback(
    (values: z.infer<typeof schema>) => {
      if (!chargeId)
        createCharge({
          variables: {
            ...values,
            storeId: store.id,
          },
        });
      else {
        console.log("edit with: ", values);
      }
    },
    [createCharge, route, store, chargeId]
  );

  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    values: {
      ...charge,
    } as any,
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex flex-col  bg-white p-6 rounded-xl shadow-sm">
        <View
          className={`flex ${type !== "PHONE" ? "flex-row gap-x-4" : "flex-col"} mt-4`}
        >
          <View
            className={`flex flex-col ${type !== "PHONE" ? "flex-1" : ""} `}
          >
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value}
                    placeholder="Nome"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.name?.message}
                  />
                )}
                name="name"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value ?? ""}
                    placeholder="Acrônimo"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={formState.errors.acronym?.message}
                  />
                )}
                name="acronym"
              />
            </View>
          </View>
          <View
            className={`flex flex-col ${type !== "PHONE" ? "flex-1" : ""} `}
          >
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, value }, formState }) => (
                  <Select
                    value={value}
                    placeholder="Tipo (nenhum)"
                    items={[
                      {
                        label: "Imposto",
                        value: "TAX",
                      },
                      {
                        label: "Taxa",
                        value: "FEE",
                      },
                      {
                        label: "Desconto",
                        value: "DISCOUNT",
                      },
                    ]}
                    onValueChange={onChange}
                    errorMessage={formState.errors.type?.message}
                  />
                )}
                name="type"
              />
            </View>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value }, formState }) => (
                  <Input
                    value={value?.toString()}
                    placeholder="Percentagem"
                    onChangeText={(value) => onChange(Number(value))}
                    onBlur={onBlur}
                    errorMessage={formState.errors.percentage?.message}
                    keyboardType="numbers-and-punctuation"
                    leftElement={<Feather name="percent" color={"gray"} />}
                  />
                )}
                name="percentage"
              />
            </View>
          </View>
        </View>

        <View className="flex mt-4">
          <View>
            <Button
              isLoading={createLoading}
              onPress={handleSubmit(handleSaveTenant)}
            >
              Salvar
            </Button>
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
};
