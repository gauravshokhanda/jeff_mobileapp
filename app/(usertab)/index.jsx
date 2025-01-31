import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import CardSlider from '../../components/CardSlider';
import EsateSlider from '../../components/Estateslider';
import { useRouter } from "expo-router";
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const router = useRouter();
  const userName = useSelector((state) => state.auth.user);
  // console.log("userName", userName.name)
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <View
        className={`flex-row justify-center items-center bg-sky-950 pt-12 p-10 pb-4 ${Platform.OS === 'ios' ? 'mt-16' : ''}`}>

        {/* Home Icon */}
        <Ionicons name="home" size={24} color="#ffffff" className="mr-5 mt-2 " />

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


      {/* Main Content */}


      <View className="bg-white border border-b-white p-2">


        {/* Welcome Message */}
        <View className=" flex-row justify-center items-center mt-2">
          <Text className="text-black text-lg">Welcome,</Text>
          <Text className="text-sky-950 text-lg text-bold font-semibold">
            {userName.name ? userName.name : "unknown"}
          </Text>
        </View>

        {/* Search Bar */}

        {/* Search using Map & Images */}
        <View className="flex-row justify-between mt-10">
          {/* Search using Map */}
          <TouchableOpacity className="border bg-sky-150 rounded-xl w-[48%] h-24 items-center p-4"
            onPress={() => router.push('MapScreen')} >
            <Ionicons name="map-outline" size={28} color="#111827" className="mb-2" />
            <Text className="text-sky-950 text-lg">Search using Map</Text>
          </TouchableOpacity>

          {/* Search using Images */}
          <TouchableOpacity
            onPress={() => router.push('FloorMapScreen')}
            className="border bg-sky-150 rounded-xl w-[48%] h-24 items-center p-4"
          >
            <Ionicons name="image-outline" size={28} color="#111827" className="mb-2" />
            <Text className="text-sky-950 text-lg">Search using Images</Text>
          </TouchableOpacity>
        </View>



        {/* Best Contractors */}
        <View className="mt-5 mb-2">
          <Text className="text-xl  mb-2 text-sky-950">Top Contractors</Text>
          <CardSlider />
        </View>

        {/* Best Estates */}
        <View className="items-center">
          <Text className="text-xl  mb-2 text-sky-950">Top Real Estate</Text>
          <EsateSlider />
        </View>


      </View>
    </ScrollView >
  );
}
