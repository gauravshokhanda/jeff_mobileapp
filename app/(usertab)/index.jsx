import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import CardSlider from "../../components/CardSlider";
import EsateSlider from "../../components/Estateslider";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";


export default function Dashboard() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const router = useRouter();
  const userName = useSelector((state) => state.auth.user);
  const [avatarLetter, setAvatarLetter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general"); 

  useEffect(() => {
    if (userName && userName.name) {
      setAvatarLetter(userName.name[0].toUpperCase());
    }
  }, [userName]);

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.4 }}
      >
        {/* Header */}
        <View
          className={`flex-row justify-center items-center py-3 px-10 pb-4`}
        >
          {/* Home Icon */}
          <Ionicons
            name="home"
            size={24}
            color="#ffffff"
            className="mr-5 mt-2 "
          />

          {/* Search Bar */}
          <View className="flex-row items-center border border-white rounded-full px-4 mt-2 bg-white">
            <Ionicons name="search" size={24} color="#000000" />
            <TextInput
              className="flex-1 ml-2 p-2 justify-center items-center text-black"
              placeholder="Start Search"
              placeholderTextColor="#000000"
            />
            {/* Filter Icon */}
            <Ionicons
              name="filter"
              size={24}
              color="#000000"
              className="ml-4"
            />
          </View>
        </View>
      </LinearGradient>
      <View
        className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -screenHeight * 0.25, 
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
        }}
      >
        <View className="rounded-3xl mt-1 bg-white p-2">
          {/* Welcome Message */}
          <View className="flex-row justify-center items-center mt-2">
            <Text className="text-sky-950 text-lg">Welcome,</Text>
            <Text className="text-sky-950 text-lg font-semibold">
              {userName && userName.name ? userName.name : "Unknown"}
            </Text>
          </View>

          {/* Action Buttons (Search) */}
          <View className="flex-row justify-between mt-5">
            {/* Search using Map */}
            <TouchableOpacity
              className="bg-gray-200 rounded-xl  h-24 items-center p-3"
              onPress={() => router.push("MapScreen")}
            >
              <Ionicons
                name="map-outline"
                size={28}
                color="#111827"
                className="mb-2"
              />
              <Text className="text-gray-700 text-lg">Search using Map</Text>
            </TouchableOpacity>

            {/* Search using Images */}
            <TouchableOpacity
              onPress={() => router.push("FloorMapScreen")}
              className="bg-gray-200 rounded-xl h-24 items-center p-3"
            >
              <Ionicons
                name="image-outline"
                size={28}
                color="#111827"
                className="mb-2"
              />
              <Text className="text-gray-700 text-lg">Search using Images</Text>
            </TouchableOpacity>
          </View>

          {/* Top Contractors Section */}
          <View className="mt-4 h-full">
            <Text className="text-xl text-sky-950 text-center">
              Top Contractors
            </Text>
            <View className="flex-row gap-5 justify-center mt-4">
              <TouchableOpacity
                onPress={() => setSelectedCategory("general")}
                className={`${
                  selectedCategory === "general"
                    ? "bg-sky-950 text-white"
                    : "bg-gray-200 text-white"
                } rounded-xl p-2`}
              >
                <Text className="text-lg">General Contractors</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedCategory("real-estate")}
                className={`${
                  selectedCategory === "real-estate"
                    ? "bg-sky-950 text-white"
                    : "bg-gray-200 text-black"
                } rounded-xl p-2`}
              >
                <Text className="text-lg">Real Estate Contractors</Text>
              </TouchableOpacity>
            </View>

            {/* Conditional Rendering */}
            {selectedCategory === "general" ? (
              <CardSlider />
            ) : (
              <View className="mt-5 p-4">
             
                <EsateSlider/>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
