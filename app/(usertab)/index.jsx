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
  Dimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import CardSlider from "../../components/CardSlider";
import EsateSlider from "../../components/Estateslider";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Swiper from "react-native-swiper";
import { LinearGradient } from 'expo-linear-gradient';



export default function Dashboard() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;
  const router = useRouter();
  const userName = useSelector((state) => state.auth.user);
  const [avatarLetter, setAvatarLetter] = useState("");

  // Ensure user name is available and set the first letter for avatar
  useEffect(() => {
    if (userName && userName.name) {
      setAvatarLetter(userName.name[0].toUpperCase());
    }
  }, [userName]);

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={['#082f49', 'transparent']}
        style={{ height: screenHeight * 0.4 }}
      >
        {/* Header */}
        <View className={`flex-row justify-center items-center py-3 px-10 pb-4`}
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
              className="flex-1 ml-2 text-black"
              placeholder="Start Search"
              placeholderTextColor="#000000"
            />
            {/* Filter Icon */}
            <Ionicons name="filter" size={24} color="#000000" className="ml-4" />
          </View>
        </View>
        <View className="flex-row justify-center items-center mt-2">
          
        </View>

      </LinearGradient>
      <View className="rounded-3xl "
        style={{
          position: 'absolute',
          top: screenHeight * 0.15,
          width: postContentWidth,
          height: screenHeight * 0.80,
          left: (screenWidth - postContentWidth) / 2,
          backgroundColor: 'white',
        }}
      >
        <View className="rounded-3xl mt-1 bg-white p-2">
          {/* Welcome Message */}
          <View className="flex-row justify-center items-center mt-2">
            <Text className="text-black text-lg">Welcome,</Text>
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
          
          {/* <View className="h-56 p-2 mt-2">
            <Swiper autoplay loop className="rounded-xl">
              <View className="relative w-full h-full">
                <ImageBackground
                  source={{
                    uri: "https://media.istockphoto.com/id/1420678520/photo/building-site-at-sunset.jpg?s=612x612&w=0&k=20&c=HoDUK1RxsH78Fj9D34nao_MUTbf-vR3G97zUWMtES4k=",
                  }}
                  className="w-full h-full justify-center items-center"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/30 rounded-xl" />
                  <Text className="text-white font-bold text-3xl absolute top-5 left-5">
                    Building the Future
                  </Text>
                </ImageBackground>
              </View>

              <View className="relative w-full h-full">
                <ImageBackground
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6fIA0SdlaGgrMPZ_BS9Z5WnM42HPF71iGkw&s",
                  }}
                  className="w-full h-full justify-center items-center"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/30 rounded-xl" />
                  <Text className="text-white font-bold text-3xl absolute top-5 left-5">
                    Strength in Every Brick
                  </Text>
                </ImageBackground>
              </View>

              <View className="relative w-full h-full">
                <ImageBackground
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKTccCO8EfR28FeusyZdoh8lZs_u63vxo3-Q&s",
                  }}
                  className="w-full h-full justify-center items-center"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/30 rounded-xl" />
                  <Text className="text-white font-bold text-3xl absolute top-5 left-5">
                    Engineering Excellence
                  </Text>
                </ImageBackground>
              </View>
            </Swiper>
          </View> */}

          {/* Best Contractors */}
          <View className="mt-4 h-72">
            <Text className="text-xl text-sky-950 text-center">
              Top Contractors
            </Text>
            <CardSlider />
          </View>

          {/* View All Button */}
          {/* <View className="flex-row justify-center mt-5">
          <TouchableOpacity
            onPress={() => router.push('ContractorListScreen')} // Adjust route name as needed
            className="bg-sky-950 rounded-full py-3 px-8 items-center"
          >
            <Text className="text-white font-bold">View All Contractors</Text>
          </TouchableOpacity>
        </View>

        {/* Best Estates */}
          {/* <View className="items-center h-72">
          <Text className="text-xl mb-2 text-sky-950">Top Real Estate</Text>
          <EsateSlider />
        </View> */}
        </View>
      </View>

    </SafeAreaView>
  );
}
