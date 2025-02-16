import { View, Dimensions, Text, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { API } from '../../config/apiConfig';
export default function Index() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;

  const [selectedPropertyType, setSelectedPropertyType] = useState('residential');
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);



  const fetchProperties = async (page = 1) => {
    if (loading || page > totalPages) return;

    setLoading(true);
    try {
      const response = await API.get(
        `get-property/type?property_type=${selectedPropertyType}&page=${page}&city=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response", response.data.properties.current_page)
      console.log("response", response.data.properties.last_page)
      // console.log("response", response.data.properties)
      setProperties((prev) =>
        page === 1 ? response.data.properties.data : [...prev, ...response.data.properties.data]
      );
      setCurrentPage(response.data.properties.current_page);
      setTotalPages(response.data.properties.last_page);
    } catch (error) {
      console.log("Error fetching properties:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setProperties([]); // Reset properties list
      setCurrentPage(1);
      fetchProperties(1, searchQuery); // Pass search query to API
    }, 500); // Debounce time (500ms)

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [searchQuery, selectedPropertyType]);


  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchProperties(currentPage + 1);
    }
  };



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


  const renderListening = ({ item }) => (

    <View className="bg-sky-950 p-4 rounded-xl max-w-md mb-3">
      <View className="flex-row justify-between items-start ">
        <View className="flex-row items-center">
          <Ionicons name="location" size={20} color="white" />
          <View className="ml-2">
            <Text className="text-white font-bold">{item.city}</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="bg-white rounded-full px-3 py-1">
            <Text className="text-slate-700 text-sm">{item.house_type}</Text>
          </View>
          <View className="bg-white rounded-full px-3 py-1">
            <Text className="text-slate-700 text-sm">{item.locale}</Text>
          </View>
        </View>
      </View>
      <View className="mb-4 mt-1">
        <Text className="text-gray-300 text-sm">{item.address}</Text>
      </View>
      <View className="flex-row">

        <View className="flex-row items-center justify-between">

          <Image source={require("../../assets/images/realState/ListingHome.png")} />

        </View>

        <View className="flex-1 ml-4">
          <View className="flex-row items-baseline">
            <Text className="text-white text-2xl font-bold">${item.price}</Text>
            <Text className="text-gray-300 ml-1">USD</Text>
          </View>

          <View className="space-y-1 mt-2">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="white" className="mr-1" />
              <Text className="text-gray-300 ml-1">
                Available from
                {new Date(item.available_from)
                  .toLocaleDateString('en-GB')
                  .split('/')
                  .reverse()
                  .slice(0, 3)
                  .join('/')}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="resize-outline" size={16} color="white" className="mr-1" />
              <Text className="text-gray-300 ml-1">Area- {item.area} sq ft</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="bed-outline" size={16} color="white" className="mr-1" />
              <Text className="text-gray-300 ml-1">{item.furnish_type}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
  return (
    <SafeAreaView className="flex-1 bg-gray-200">

      <LinearGradient
        colors={['#082f49', 'transparent']}

        style={{ height: screenHeight * 0.4 }}
      >
        <View className="mt-8 px-4 ">
          <Text className="text-2xl font-semibold text-white">Property Listing</Text>
        </View>
        <View className="mx-5 mt-5 items-end">
          <View className="bg-gray-100  h-12 mr-5 rounded-full px-3 flex-row items-center justify-between ">
            <Ionicons name="search" size={18} color="black" />
            <TextInput

              placeholder="Search by City"
              placeholderTextColor={"gray"}
              style={{ fontSize: 14 }}
              className="flex-1 ml-5 text-lg text-sm"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="filter-sharp" size={26} color="black" />

          </View>
        </View>


      </LinearGradient>


      <View className="rounded-3xl"
        style={{
          position: 'absolute',
          top: screenHeight * 0.20,
          width: postContentWidth,
          height: screenHeight * 0.75,
          left: (screenWidth - postContentWidth) / 2,
          backgroundColor: 'white',

        }}
      >

        <View className="flex-1 m-5">
          <View className="p-3 rounded-lg">
            <FlatList
              data={propertyTypes}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderPropertyTypeItem}
              contentContainerStyle={{ flexGrow: 1, gap: 10 }}
            />
          </View>
          <View className=" flex-1 mt-2 mb-3">
            {loading == true ? (
              <ActivityIndicator size="large" color="#082f49" />
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={properties}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderListening}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
              />
            )}


          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}