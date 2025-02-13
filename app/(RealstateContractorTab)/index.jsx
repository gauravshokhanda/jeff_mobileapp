import { View, Dimensions, Text, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from "react-redux";
import { router } from 'expo-router';



export default function Index() {
  const { width: screenWidth } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;
  const userName = useSelector((state) => state.auth.user);


  return (
    <View className="flex-1 bg-gray-200">

      <LinearGradient
        colors={['#082f49', 'transparent']}
        className="h-[40%]"
      >
        <View className="mt-10 px-4 gap-2 flex-row items-center">
          <Image
            source={{ uri: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg" }}
            className="w-14 h-14 border-2 border-white rounded-full"
          />
          <View className="gap-1">
            <Text className="text-2xl font-semibold text-white">
              Welcome! {userName?.name || "User"}
            </Text>
            <Text className="text-gray-400">📍 Florida, USA</Text>
          </View>
        </View>

        <View className="mt-2 items-end">
          <View className="bg-gray-100 w-52 h-12 mr-5 rounded-full px-3 flex-row items-center justify-between">
            <Ionicons name="search" size={18} color="black" />
            <TextInput
              placeholder="Home Search"
              placeholderTextColor={"gray"}
              style={{ fontSize: 14 }}
              className="flex-1 ml-2 text-lg text-sm"
            />
          </View>
        </View>
      </LinearGradient>


      <View className="rounded-3xl "
        style={{
          position: 'absolute',
          top: '27%',
          width: postContentWidth,
          height: '80%',
          left: (screenWidth - postContentWidth) / 2,
          backgroundColor: 'white',


        }}
      >

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
if()

            <View className="m-5">
              <View className="flex-row items-center justify-between h-32 px-4 ">

                <View className="">
                  <Text className="text-lg font-semibold text-black">Need Any help?</Text>
                  <TouchableOpacity className="bg-sky-900 px-4 py-2 rounded-lg mt-2 self-start ml-5">
                    <Text className="text-white font-semibold tracking-widest">Chat us</Text>
                  </TouchableOpacity>
                </View>


                <Image
                  source={require("../../assets/images/realState/chatGroupImage.png")}
                  className="w-40 h-28"
                  style={{ resizeMode: "contain" }}
                />
              </View>

              <View className=" rounded-2xl mt-10 p-2">
                <Text className="text-2xl font-semibold tracking-widest mb-4 text-black">Checkout your properties.</Text>

                <View className="bg-sky-950 rounded-t-xl p-3 w-full">
                  {/* Top Section */}
                  <View className="flex-row justify-between">
                    {/* Left - Image */}
                    <Image
                      style={{ resizeMode: "contain" }}
                      className="w-24 h-24 rounded-lg"
                      source={require('../../assets/images/realState/checkoutProperty.png')}
                    />

                    {/* Right - Text Content */}
                    <View className="flex-1 ml-2">
                      {/* Status Tags */}
                      <View className="flex-row justify-between">
                        <Text className="bg-white px-2 py-1 font-semibold text-xs mr-1">
                          Plan upgrade required
                        </Text>
                        <Text className="bg-white px-2 py-1 font-semibold text-xs">
                          Under Review
                        </Text>
                      </View>

                      {/* Property Info */}
                      <Text className="text-white font-semibold text-lg mt-2">
                        9 BHK Independent House LA, USA
                      </Text>
                      <Text className="text-white text-sm">
                        2600 sq.ft. - $70000.0
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar Section */}
                  <View className="mt-3">
                    <Text className="text-white text-xs font-semibold">
                      Your Listing Score: 35%
                    </Text>
                    <View className="bg-gray-300 h-2 rounded-full w-full mt-1">
                      <LinearGradient className="bg-red-950 h-2"
                        colors={['#0f0f0f', '#4b5563']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: "35%", borderRadius: 10 }}
                      ></LinearGradient>
                    </View>
                  </View>

                  {/* Footer Section */}
                  <TouchableOpacity className="mt-3 bg-sky-900 py-2 px-3 flex-row justify-between items-center rounded-lg">
                    <Text className="text-white font-semibold text-sm">
                      Select Preferred Language for Callback
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="bg-gray-200 rounded-b-2xl p-5 shadow-lg w-full flex-row justify-between items-center">

                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-600">
                      Get ready list of buyers
                    </Text>
                  </View>


                  <TouchableOpacity className="bg-white px-4 py-2 rounded-lg shadow-md">
                    <Text className="text-indigo-900 font-semibold">Upgrade Now</Text>
                  </TouchableOpacity>


                </View>




              </View>
              <View className="bg-[#505C3F] py-4 rounded-2xl  mt-9 shadow-lg flex-row  justify-between w-full">
                {/* Left Section - Text */}
                <View className="pl-2">
                  <Text className="text-white text-2xl font-semibold tracking-widest">New Properties!</Text>
                  <Text className="text-gray-100 text-lg tracking-wider">house and land packages</Text>
                </View>

                {/* Right Section - Image */}
                <Image
                  source={require("../../assets/images/realState/NewProperty.png")}
                  className="w-32 h-24 "
                  style={{ resizeMode: "cover" }}
                />
              </View>

              {/*  */}
              <View className="py-10">
                {/* Caution Box */}
                <View className="bg-gray-100 rounded-xl p-4 flex-row items-start">
                  <Image
                    source={require("../../assets/images/realState/warning.png")} // Replace with the warning icon image
                    className="w-12 h-12 mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-black tracking-widest">Caution!</Text>
                    <Text className="text-gray-700 text-lg">
                      Be cautious of suspicious calls received from users posing as
                      ‘armyman’ or ‘Public Service’ & asking to transfer money.
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/KnowMore")}
                      className="mt-2">
                      <Text className="text-black font-bold">Know more &gt;</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* User Post */}
                <View className="mt-8 flex-row items-start">
                  <Image
                    source={require("../../assets/images/realState/user-profile.png")} // Replace with the user image
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-black font-semibold text-xl tracking-widest">Jimmy Brooke</Text>
                    <Text className="text-gray-600 mt-1 tracking-wider text-lg w-[90%]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      <Text className="font-bold text-black"> Read more...</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View className="p-8 bg-gray-100 rounded-xl mb-5">
                {/* Call Us Card */}
                <TouchableOpacity className="bg-white border border-gray-300 rounded-xl p-4 flex-row items-center mb-3">
                  <View className="bg-gray-200 p-2 rounded-full mr-5">
                    <Ionicons name="call" size={20} color="black" />
                  </View>
                  <View className=" items-center ml-5">
                    <Text className="text-lg font-bold text-black">Call Us</Text>
                    <Text className="text-gray-700">1800-131-56677</Text>
                  </View>
                </TouchableOpacity>

                {/* Email Us Card */}
                <TouchableOpacity className="bg-white border border-gray-300 rounded-xl p-4 flex-row items-center">
                  <View className="bg-gray-200 p-2 rounded-full mr-3">
                    <Ionicons name="chatbubble-ellipses" size={20} color="black" />
                  </View>
                  <View className=" items-center ml-5">
                    <Text className="text-lg font-bold text-black">Email Us</Text>
                    <Text className="text-gray-700">Supportjeff@gmail.com</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>


      </View>
    </View>
  );
}