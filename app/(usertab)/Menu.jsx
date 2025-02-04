import React from "react";
import { View, Text, Image, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";

const MenuHeader = () => {
  const userName = useSelector((state) => state.auth.user);

  return (
    <View className={`bg-sky-950 h-72 px-5 ${Platform.OS === "ios" ? "mt-16" : ""}`}>
      <View className="mt-12 px-5 flex-row items-center">
        <Image source={{ uri: "https://via.placeholder.com/50" }} className="w-12 h-12 rounded-full" />
        <View className="ml-3">
          <Text className="text-lg font-semibold text-white">Welcome! {userName.name || "User"}</Text>
          <Text className="text-gray-400">Florida, USA</Text>
        </View>
      </View>
      
     
    </View>
  );
};

export default MenuHeader;
