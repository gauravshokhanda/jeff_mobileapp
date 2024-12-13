import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native'
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
        {/* first */}
        <View className="items-center mt-20">
          <View className="border  flex-row  bg-slate-100 justify-between px-4 items-center rounded-2xl w-[95%]">
            <View>
              <Image
                className="w-24 h-24"
                style={{ tintColor:"#abadaf"}}
                source={require('../../assets/images/Untitled_design__8_-removebg-preview.png')} />
            </View>
            <View>
              <TouchableOpacity>
              <Text className="text-xl text-customGray">Explore Properties</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

{/* second */}
        <View className="items-center my-10">
          <View className="border  flex-row bg-slate-100 justify-between px-4 items-center rounded-2xl w-[95%]">
            <View>
              <TouchableOpacity>
                <Text className="text-xl text-customGray">Find Contractors</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Image
                className="w-24 h-24"
                style={{ tintColor:"#abadaf"}}
                source={require('../../assets/images/Untitled_design__7_-removebg-preview.png')} />
            </View>
           
          </View>
        </View>
        {/* third */}
        <View className="items-center">
          <View className="border  flex-row bg-slate-100 justify-around px-4 items-center rounded-2xl w-[95%]">
            <View>
              <Image
                className="w-24 h-24"
                style={{ tintColor: "#abadaf" }}
                source={require('../../assets/images/Untitled_design__6_-removebg-preview.png')} />
            </View>

            <View>
              <TouchableOpacity>
                <Text className="text-xl text-customGray">More Services</Text>
              </TouchableOpacity>
            </View>   
          </View>
        </View>

        <View className="items-center justify-center mt-14">
          <TouchableOpacity
            className="text-center rounded-3xl bg-slate-200 px-5">
            <Text className="text-center mx-10 my-3 text-lg text-sky-950">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView >
  )
}
