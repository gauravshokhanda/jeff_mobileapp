import { View, Dimensions, Text, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';








export default function Index() {
  const { width: screenWidth } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;

  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [category, setCategory] = useState(null)

  const categoryType = [

  ]
  const propertyTypes = [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
  ];

  const renderPropertyTypeItem = ({ item }) => {
    const isSelected = selectedPropertyType === item.id
    return (
      <TouchableOpacity
        className="rounded-xl overflow-hidden"
        onPress={() => setSelectedPropertyType(item.id)}
      >

        <LinearGradient
          colors={isSelected ? ['#93C5FD', '#082f49'] : ['#FFF', '#FFF']} // Blue when selected, Gray otherwise

          className="px-8 py-2 flex items-center justify-center"
        >
          <Text className={`text-lg font-medium ${isSelected ? "text-white" : "text-gray-900"}`}>
            {item.label}
          </Text>
        </LinearGradient>

      </TouchableOpacity>
    )
  }



  return (
    <View className="flex-1 bg-gray-200">

      <LinearGradient
        colors={['#082f49', 'transparent']}
        className="h-[40%]"
      >
        <View className="mt-8 px-4 ">
          <Text className="text-2xl font-semibold text-white">Property Listing</Text>
        </View>
        <View className="mx-5 mt-5 items-end">
          <View className="bg-gray-100  h-12 mr-5 rounded-full px-3 flex-row items-center justify-between ">
            <Ionicons name="search" size={18} color="black" />
            <TextInput
              placeholder="Search"
              placeholderTextColor={"gray"}
              style={{ fontSize: 14 }}
              className="flex-1 ml-5 text-lg text-sm"
            />
            <Ionicons name="filter-sharp" size={26} color="black" />

          </View>
        </View>


      </LinearGradient>


      <View className="rounded-3xl"
        style={{
          position: 'absolute',
          top: '25%',
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
            <View className="flex-1 m-5">
              <View className="sticky flex-1 justify-center items-center p-3 rounded-2xl bg-gray-100">

                <FlatList
                  data={propertyTypes}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderPropertyTypeItem}
                  contentContainerStyle={{ gap: 10 }}
                />

              </View>
              {selectedPropertyType === 'residential' ? (

                <View>


                  <View className="flex-1">

                    <View className=" flex-1 bg-sky-950 rounded-t-xl p-3 w-full mt-5">
                      {/* Top Section */}
                      <View className="flex-row justify-between border-b border-b-gray-300 pb-3">
                        {/* Left - Image */}
                        <Image
                          style={{ resizeMode: "contain" }}
                          className="w-24 h-24 rounded-lg"
                          source={require('../../assets/images/realState/checkoutProperty.png')}
                        />

                        {/* Right - Text Content */}
                        <View className="flex-1 ml-2">
                          {/* Status Tags */}
                          <View className="flex-row justify-end">

                            <Text className="bg-white px-2 py-1 font-semibold text-xs rounded-lg">
                              Under Review
                            </Text>
                          </View>

                          {/* Property Info */}
                          <Text className="text-white font-semibold text-normal mt-2">
                            9 BHK Independent House LA, USA
                          </Text>
                          <Text className="text-white text-sm ml-2">
                            2600 sq.ft.
                          </Text>
                        </View>
                      </View>

                      <View className="mt-2 flex-row justify-between items-center mx-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={18} color="white" />
                          <Text className="text-sm text-white">Nainwa-ku</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-lg font-bold text-white">$48760</Text>
                          <Text className="text-sm text-white">USD</Text>
                        </View>
                      </View>

                      <View>


                      </View>

                    </View>
                    {/* second */}
                    <View className="bg-gray-200 flex-row justify-between rounded-b-xl">
                      <View className="self-start p-3">
                        <Text className="text-gray-600 font-semibold tracking-widest">Last Added</Text>
                        <Text className="tracking-wider font-medium text-sm bg-white rounded-full px-1 mt-1">13 feb 2025</Text>
                      </View>

                      <View className="self-end ">
                        <View className="mt-4 p-2">
                          <Text className="text-gray-600 text-sm font-semibold mb-1">
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
                      </View>
                    </View>

                  </View>
                  <View className="flex-1">

                    <View className=" flex-1 bg-sky-950 rounded-t-xl p-3 w-full mt-5">
                      {/* Top Section */}
                      <View className="flex-row justify-between border-b border-b-gray-300 pb-3">
                        {/* Left - Image */}
                        <Image
                          style={{ resizeMode: "contain" }}
                          className="w-24 h-24 rounded-lg"
                          source={require('../../assets/images/realState/checkoutProperty.png')}
                        />

                        {/* Right - Text Content */}
                        <View className="flex-1 ml-2">
                          {/* Status Tags */}
                          <View className="flex-row justify-end">

                            <Text className="bg-white px-2 py-1 font-semibold text-xs rounded-lg">
                              Under Review
                            </Text>
                          </View>

                          {/* Property Info */}
                          <Text className="text-white font-semibold text-normal mt-2">
                            9 BHK Independent House LA, USA
                          </Text>
                          <Text className="text-white text-sm ml-2">
                            2600 sq.ft.
                          </Text>
                        </View>
                      </View>

                      <View className="mt-2 flex-row justify-between items-center mx-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={18} color="white" />
                          <Text className="text-sm text-white">Nainwa-ku</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-lg font-bold text-white">$48760</Text>
                          <Text className="text-sm text-white">USD</Text>
                        </View>
                      </View>

                      <View>


                      </View>

                    </View>
                    {/* second */}
                    <View className="bg-gray-200 flex-row justify-between rounded-b-xl">
                      <View className="self-start p-3">
                        <Text className="text-gray-600 font-semibold tracking-widest">Last Added</Text>
                        <Text className="tracking-wider font-medium text-sm bg-white rounded-full px-1 mt-1">13 feb 2025</Text>
                      </View>

                      <View className="self-end ">
                        <View className="mt-4 p-2">
                          <Text className="text-gray-600 text-sm font-semibold mb-1">
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
                      </View>
                    </View>

                  </View>
                  <View className="flex-1">

                    <View className=" flex-1 bg-sky-950 rounded-t-xl p-3 w-full mt-5">
                      {/* Top Section */}
                      <View className="flex-row justify-between border-b border-b-gray-300 pb-3">
                        {/* Left - Image */}
                        <Image
                          style={{ resizeMode: "contain" }}
                          className="w-24 h-24 rounded-lg"
                          source={require('../../assets/images/realState/checkoutProperty.png')}
                        />

                        {/* Right - Text Content */}
                        <View className="flex-1 ml-2">
                          {/* Status Tags */}
                          <View className="flex-row justify-end">

                            <Text className="bg-white px-2 py-1 font-semibold text-xs rounded-lg">
                              Under Review
                            </Text>
                          </View>

                          {/* Property Info */}
                          <Text className="text-white font-semibold text-normal mt-2">
                            9 BHK Independent House LA, USA
                          </Text>
                          <Text className="text-white text-sm ml-2">
                            2600 sq.ft.
                          </Text>
                        </View>
                      </View>

                      <View className="mt-2 flex-row justify-between items-center mx-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={18} color="white" />
                          <Text className="text-sm text-white">Nainwa-ku</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-lg font-bold text-white">$48760</Text>
                          <Text className="text-sm text-white">USD</Text>
                        </View>
                      </View>

                      <View>


                      </View>

                    </View>
                    {/* second */}
                    <View className="bg-gray-200 flex-row justify-between rounded-b-xl">
                      <View className="self-start p-3">
                        <Text className="text-gray-600 font-semibold tracking-widest">Last Added</Text>
                        <Text className="tracking-wider font-medium text-sm bg-white rounded-full px-1 mt-1">13 feb 2025</Text>
                      </View>

                      <View className="self-end ">
                        <View className="mt-4 p-2">
                          <Text className="text-gray-600 text-sm font-semibold mb-1">
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
                      </View>
                    </View>

                  </View>
                  <View className="flex-1">

                    <View className=" flex-1 bg-sky-950 rounded-t-xl p-3 w-full mt-5">
                      {/* Top Section */}
                      <View className="flex-row justify-between border-b border-b-gray-300 pb-3">
                        {/* Left - Image */}
                        <Image
                          style={{ resizeMode: "contain" }}
                          className="w-24 h-24 rounded-lg"
                          source={require('../../assets/images/realState/checkoutProperty.png')}
                        />

                        {/* Right - Text Content */}
                        <View className="flex-1 ml-2">
                          {/* Status Tags */}
                          <View className="flex-row justify-end">

                            <Text className="bg-white px-2 py-1 font-semibold text-xs rounded-lg">
                              Under Review
                            </Text>
                          </View>

                          {/* Property Info */}
                          <Text className="text-white font-semibold text-normal mt-2">
                            9 BHK Independent House LA, USA
                          </Text>
                          <Text className="text-white text-sm ml-2">
                            2600 sq.ft.
                          </Text>
                        </View>
                      </View>

                      <View className="mt-2 flex-row justify-between items-center mx-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={18} color="white" />
                          <Text className="text-sm text-white">Nainwa-ku</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-lg font-bold text-white">$48760</Text>
                          <Text className="text-sm text-white">USD</Text>
                        </View>
                      </View>

                      <View>


                      </View>

                    </View>
                    {/* second */}
                    <View className="bg-gray-200 flex-row justify-between rounded-b-xl">
                      <View className="self-start p-3">
                        <Text className="text-gray-600 font-semibold tracking-widest">Last Added</Text>
                        <Text className="tracking-wider font-medium text-sm bg-white rounded-full px-1 mt-1">13 feb 2025</Text>
                      </View>

                      <View className="self-end ">
                        <View className="mt-4 p-2">
                          <Text className="text-gray-600 text-sm font-semibold mb-1">
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
                      </View>
                    </View>

                  </View>

                </View>
              )

                :
                (
                  <View>
                    <Text>
                      NO Listing found
                    </Text>
                  </View>
                )
              }











            </View>

          </ScrollView>
        </KeyboardAvoidingView>






      </View>
    </View>
  );
}