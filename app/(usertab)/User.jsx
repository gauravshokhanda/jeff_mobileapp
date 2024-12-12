import { View, Text, Image, ScrollView, TextInput } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';



export default function User() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-sky-950 border border-b-white p-10">
        <View className="flex-row items-center border-b border-b-white  pb-4 mt-6 mb-5 mx-5">
          <FontAwesome name="chevron-left" size={15} color="white" className="pr-3 pl-2" />
          <Text className="text-white text-2xl font-medium">
            User
          </Text>
        </View>

        <View className="flex-row border-2 border-sky-900 bg-sky-900 rounded-xl mt-7">
          <TextInput className="w-[80%] bg-slate-200 rounded-xl border-8 border-sky-900" />
          <Ionicons
            name="search"
            size={27}
            color={"black"}
            className="bg-slate-200 w-[20%] text-center pt-1 rounded-xl border-8 border-sky-900 " />
        </View>
      </View>
    </ScrollView >
  )
}
