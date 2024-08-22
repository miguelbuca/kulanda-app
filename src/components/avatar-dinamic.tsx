import {
  View,
  Text,
  ViewProps,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { getApiFile } from "../utils/get-api-file";

export interface AvatarDinamicProps extends ViewProps {
  letters?: string;
  image?: string;
  fontStyles?: StyleProp<TextStyle>;
  withUpload?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  onUpload?: (asset: ImagePicker.ImagePickerAsset | null) => void;
}

export const AvatarDinamic = ({
  image: defaultImage,
  fontStyles,
  letters,
  withUpload,
  onUpload,
  imageStyle,
  ...args
}: AvatarDinamicProps) => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>();

  useEffect(() => {
    image && onUpload?.(image);
  }, [image]);

  const handlerPickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <>
      <View
        style={{
          borderColor: "rgba(0,0,0,0.1)",
        }}
        className="bg-white border-2 rounded-lg items-center justify-center"
        {...args}
      >
        {image || defaultImage ? (
          <Image
            style={
              image
                ? imageStyle
                  ? imageStyle
                  : {
                      borderColor: "white",
                      borderWidth: 1,
                    }
                : undefined
            }
            className="h-36 w-36 rounded-lg"
            source={{
              uri: image?.uri || getApiFile(defaultImage ?? ""),
            }}
          />
        ) : (
          <View className="h-36 w-36 rounded-lg justify-center items-center">
            <AntDesign name="picture" size={30} color={"rgba(0,0,0,0.1)"} />
          </View>
        )}
      </View>
      {withUpload && (
        <TouchableOpacity onPress={handlerPickImage}>
          <Text className="mt-6 text-blue-500">Clique para carregar foto</Text>
        </TouchableOpacity>
      )}
    </>
  );
};
