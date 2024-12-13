import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'

export default function Menu() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View className="flex-1 p-10">
        <View className="flex-1 items-center">
          <View className="h-5 w-24 bg-slate-400 rounded-3xl">
            <View className=" h-full w-[65%] bg-slate-900  rounded-3xl" />
          </View>
        </View>

        <View className="flex-1 mb-10  items-center">
          <View className="h-[60%] w-[60%]">
            <Image
              className="h-full w-full"
              source={require("../../assets/images/Add a heading.png")}
              resizeMode="cover"
            />

          </View>
          <View className="mt-2">
            <Text className="text-2xl font-semibold text-sky-950">G32CORP</Text>
          </View>
        </View>

        <View className="flex-1  justify-evenly">
          <View className="items-center pt-5">
            <Text className="text-2xl font-bold pb-4 text-sky-950">Welcome to G32corp.</Text>
            <Text className="leading-5 text-center w-[80%] text-sky-900 text-md">Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, esse deleniti similique id nulla quidem voluptatum odit eum labor and new !</Text>
          </View>
          <View className=" items-center">
            <View className="border border-sky-950 h-5 w-40 mb-2 " />
            <View>
              <Text className="text-sky-950 font-semibold text-md">Loading...57%</Text>
            </View>

          </View>

        </View>

      </View>
    </ScrollView>
  )
}