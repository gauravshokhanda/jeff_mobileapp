import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';



export default function Home() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="bg-sky-950 pt-12 pb-4 flex-row">
        <TouchableOpacity className="pr-4 pt-2 pl-10 font-light">
          <FontAwesome
            name="chevron-left"
            size={15}
            color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl">
          Role Selection
        </Text>

      </View>

      <View className="flex-1 bg-white p-10">

        <View className="h-56 mt-9 mb-10">
          <Image
            className="w-full h-full border-2 border-slate-200"
            source={require('../../assets/images/AC5D_Logo.jpg')}
            resizeMode="cover"
          />
        </View>


        <View className="h-80 mt-10 flex-row flex-wrap gap-3 justify-between border border-white">

          <View className="w-[48%] h-36 bg-sky-950 justify-center items-center rounded-2xl ">
            <Image
              className="h-28 "
              style={{ tintColor: "white" }}
              source={require('../../assets/images/Untitled_design__10_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold text-white">User</Text>
          </View>
          <View className="w-[48%] h-36 bg-sky-950 justify-center items-center rounded-2xl">
            <Image
              style={{ tintColor: "white" }}
              className="h-24 "
              source={require('../../assets/images/Untitled_design__12_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold text-white">Contractor</Text>
          </View>


          <View className="w-[48%] h-36 bg-sky-950 justify-center items-center rounded-2xl">
            <Image
              style={{ tintColor: "white" }}
              className="h-20 mt-3"
              source={require('../../assets/images/Untitled_design__9_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold text-center text-white">
              Real Estate Developer
            </Text>
          </View>

          <View className="w-[48%] h-36 bg-sky-950 justify-center items-center rounded-2xl">
            <Image
              style={{ tintColor: "white" }}
              className="h-16 absolute"
              source={require('../../assets/images/Untitled_design__11_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold text-white">Skip</Text>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
