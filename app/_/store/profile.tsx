import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import Avatar from "@/src/components/avatar";
import { useAuth } from "@/src/hooks/use-auth";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { ProfileTab } from "@/src/components";

const Profile = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user } = useAuth();
  return (
    <View className="flex flex-row flex-1 bg-gray-50">
      <ScrollView className="flex flex-1 flex-col p-6">
        <View className="flex flex-col justify-center items-center self-center">
          <Avatar user={user} />
          <View className="flex items-center justify-center mt-3">
            <Text className="font-normal text-base">{user.fullName}</Text>
            <Text className="text-xs font-light">{user.phone}</Text>
          </View>
        </View>
        <View className="flex flex-col mt-8 min-h-[400px] bg-white shadow-sm rounded-2xl p-4">
          <View>
            <SegmentedControl
              values={["Geral", "Editar"]}
              tintColor={"white"}
              selectedIndex={selectedIndex}
              fontStyle={{
                color: "#000",
              }}
              activeFontStyle={{
                color: "#000",
              }}
              onChange={(event) =>
                setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
              }
            />
          </View>
          <View className="flex-1 mt-5">
            <ProfileTab index={selectedIndex} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
