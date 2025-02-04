import React from "react";
import { View, Text, Image, Platform } from "react-native";
import { useSelector } from "react-redux";

const MenuHeader = () => {
  const userName = useSelector((state) => state.auth.user);

  return (
    <View className={`bg-white h-full relative ${Platform.OS === "ios" ? "mt-16" : ""}`}>
      {/* Header Background */}
      <View className="bg-sky-950 h-60 flex justify-end items-center" style={{ borderBottomLeftRadius: 70, borderBottomRightRadius: 70 }}>
        <View className="absolute flex items-center" style={{ bottom: -80 }}>
          <Image source={{ uri: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg" }} className="w-24 h-24 border-4 border-black rounded-full" />
          <Text className="text-lg font-semibold mt-2 text-black">Jhon Clay</Text>
          <Text className="text-gray-500">Florida, USA</Text>
        </View>
      </View>

      {/* Container to push content down */}
      <View className="flex-1 pt-28 mt-20">
        <View className="w-full p-2 h-24 bg-red-500">
          <Text>Hello</Text>
        </View>
      </View>
    </View>
  );
};

export default MenuHeader;
