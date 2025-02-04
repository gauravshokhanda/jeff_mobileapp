import React from "react";
import { View, Text,TextInput,TouchableOpacity, Image, Platform } from "react-native";
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

      {/* Adjusted Content Section */}
    <View className="w-full px-6 pt-28 mt-20">
  <View className="p-6 rounded-lg mt-5 ">

    <TextInput
      className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 mb-3"
      placeholder="Full Name"
        placeholderTextColor="black"
      value=""
    />
    <TextInput
      className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 mb-3"
      placeholder="Email"
      keyboardType="email-address"
        placeholderTextColor="black"
      value=""
    />
   
    <TextInput
      className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 mb-5"
      placeholder="City"
      placeholderTextColor="black"
      value=""
    />

    <TouchableOpacity className="bg-sky-950 py-3 mt-5 rounded-lg shadow-md active:bg-sky-800">
      <Text className="text-center text-white text-lg font-semibold">Save Changes</Text>
    </TouchableOpacity>
  </View>
</View>

    </View>
  );
};

export default MenuHeader;
