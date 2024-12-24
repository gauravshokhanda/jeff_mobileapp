import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

export default function Dashboard() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-row items-center bg-sky-950 pt-12 pb-4">
        <TouchableOpacity className="pr-4 pl-10">
          <FontAwesome name="chevron-left" size={15} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl ">
          User
        </Text>
      </View>
      <View className="flex-1 bg-white border border-b-white p-10">


        <View className="flex-row border-2 border-sky-800 bg-sky-800 rounded-xl mt-7">
          <TextInput className="w-[80%] bg-white rounded-2xl border-8 border-sky-800" />
          <Ionicons
            name="search"
            size={27}
            color={"#075985"}
            className="bg-white w-[20%] text-center pt-1 rounded-2xl border-8 border-sky-800 " />

        </View>
        {/* first */}
        <View className="items-center mt-20">
          <View className="border  flex-row  bg-sky-950 justify-between px-4 items-center rounded-2xl w-[95%]">
            <View>
              <Image
                className="w-24 h-24"
                style={{ tintColor: "white" }}
                source={require('../../assets/images/Untitled_design__8_-removebg-preview.png')} />
            </View>
            <View>
              <TouchableOpacity>
                <Text className="text-xl text-white">Explore Properties</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* second */}
        <View className="items-center my-10">
          <View className="border  flex-row bg-sky-950 justify-between px-4 items-center rounded-2xl w-[95%]">
            <View>
              <TouchableOpacity>
                <Text className="text-xl text-white">Find Contractors</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Image
                className="w-24 h-24"
                style={{ tintColor: "white" }}
                source={require('../../assets/images/Untitled_design__7_-removebg-preview.png')} />
            </View>

          </View>
        </View>
        {/* third */}
        <View className="items-center">
          <View className="border  flex-row bg-sky-950 justify-around px-4 items-center rounded-2xl w-[95%]">
            <View>
              <Image
                className="w-24 h-24"
                style={{ tintColor: "white" }}
                source={require('../../assets/images/Untitled_design__6_-removebg-preview.png')} />
            </View>

            <View>
              <TouchableOpacity>
                <Text className="text-xl text-white">More Services</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="items-center justify-center mt-14">
          <TouchableOpacity
            className="text-center rounded-3xl bg-sky-950 px-5">
            <Text className="text-center mx-10 my-3 text-lg text-white">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView >
  )
}