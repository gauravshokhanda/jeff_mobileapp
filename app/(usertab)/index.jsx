import { View, Text, Image, ScrollView } from 'react-native';
import React from 'react';


export default function Home() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


      <View className="flex-1 bg-sky-950 border border-b-white p-10">

        <View>
          <Text className="text-white text-2xl mt-3 border-b border-b-slate-400 pb-2">
            Role Selection
          </Text>
        </View>


        <View className="h-56 mt-9 mb-10">
          <Image
            className="w-full h-full border-2 border-slate-200"
            source={require('../../assets/images/Add a heading.png')}
            resizeMode="cover"
          />
        </View>


        <View className="h-80 mt-10 flex-row flex-wrap gap-3 justify-between">

          <View className="w-[48%] h-36 bg-slate-100 justify-center items-center rounded-2xl">
            <Image
              className="h-28"
              source={require('../../assets/images/Untitled_design__10_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold">User</Text>
          </View>


          <View className="w-[48%] h-36 bg-slate-100 justify-center items-center rounded-2xl">
            <Image
              className="h-24"
              source={require('../../assets/images/Untitled_design__12_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold">Contractor</Text>
          </View>


          <View className="w-[48%] h-36 bg-slate-100 justify-center items-center rounded-2xl">
            <Image
              className="h-20 mt-3"
              source={require('../../assets/images/Untitled_design__9_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold text-center">
              Real Estate Developer
            </Text>
          </View>


          <View className="w-[48%] h-36 bg-slate-100 justify-center items-center rounded-2xl">
            <Image
              className="h-16 absolute"
              source={require('../../assets/images/Untitled_design__11_-removebg-preview.png')}
              resizeMode="contain"
            />
            <Text className="absolute bottom-1 font-semibold">Skip</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
