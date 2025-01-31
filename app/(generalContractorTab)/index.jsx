import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, ImageBackground, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../../config/apiConfig';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";




const DashboardScreen = () => {
  const [posts, setPosts] = useState([])
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log("fetch post functin")
    try {
      const response = await API.get("job-post/listing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetch post", response.data.data.data)
      if (response.data.success && Array.isArray(response.data.data.data)) {
        setPosts(response.data.data.data.slice(0, 2));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="relative mt-2">
      {/* Property Image */}
      <Image
        source={{ uri: `https://g32.iamdeveloper.in/public/${JSON.parse(item.floor_maps_image)[0]}` }}
        className="w-full h-48 rounded-lg"
        resizeMode="cover"
      />

      {/* Overlay Container */}
      <View className="absolute inset-0 bg-black/30 rounded-lg" />

      {/* Location Tag */}
      <View className="absolute top-3 left-3">
        <Image source={require("../../assets/images/Arrow-up-right.png")} />

      </View>

      {/* Info Text */}
      <View className="absolute bottom-3 left-3  bg-white px-2 py-1 rounded-full flex-row items-center">
        <Ionicons name="location-outline" size={14} color="green" />
        <Text className="text-xs font-bold text-green-600 ml-1 tracking-widest">{item.city}</Text>



      </View>

      {/* Info Text */}
      <View className="absolute bottom-3 right-3  ">
        <Text className="text-white font-bold text-lg tracking-widest">{item.project_type}</Text>
        <Text className="text-white font-semibold tracking-widest">${item.total_cost}</Text>
      </View>
    </View>
  );


  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Header */}
      <View className="bg-sky-950 py-4 px-4 flex-row items-center justify-center">
        <Text className="text-white text-2xl font-bold">Dashboard</Text>
      </View>
      {/* Welcome Section */}
      <View className="m-3">
        <View className="justify-around items-center flex-row  pb-4">
          <View>
            <Text className="text-gray-700 text-lg font-bold flex-row">Welcome, Jhon 👋</Text>
            <View className="flex-row">
              <Ionicons name="location-outline" size={20} color="#0EA5E9" />
              <Text className="text-gray-500 text-sm ml-1">Florida, USA</Text>

            </View>
          </View>
          <Image
            className='h-16 w-16 rounded-full'
            source={require('../../assets/images/AC5D_Logo.jpg')}
          />
        </View>
      </View>
      {/* new propert section */}
      <View className="mx-9">
        <Text className="text-2xl font-semibold text-gray-800  ml-2 tracking-widest">New Property Openings</Text>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity className="items-end ">
          <Text className="text-gray-500">See all</Text>
        </TouchableOpacity>
      </View>

      <View className="mx-10">
        <View >
          <Text className="text-xl tracking-widest font-semibold mb-2">Listenings</Text>
        </View>
        <View className="flex-row justify-around flex-wrap rounded-xl overflow-hidden">
          <View className="h-24 w-[45%] rounded-2xl overflow-hidden">
            <ImageBackground
              source={require('../../assets/images/listeningImage1.png')}
              className="h-full w-full justify-center"
              resizeMode="cover"
            >
              <Text className="text-white font-bold tracking-wider text-center text-vertical-center">New Listening</Text>
            </ImageBackground>
          </View>
          <View className="h-24 w-[45%] mb-3 rounded-2xl overflow-hidden">
            <ImageBackground
              source={require('../../assets/images/listeningImage2.png')}
              className="h-full w-full rounded-xl justify-center"
              resizeMode="cover"
            >
              <Text className="text-white font-bold tracking-wider text-center text-vertical-center">New Apartment</Text>

            </ImageBackground>


          </View>
          <View className="h-24 w-[45%] rounded-2xl overflow-hidden">
            <ImageBackground
              source={require('../../assets/images/listeningImage3.png')}
              className="h-full w-full justify-center"
              resizeMode="cover"
            >
              <Text className="text-white font-bold tracking-wider text-center text-vertical-center">New House</Text>

            </ImageBackground>


          </View>
          <View className="h-24 w-[45%] rounded-2xl overflow-hidden">
            <ImageBackground source={require('../../assets/images/listeningImage4.png')}
              className="h-full w-full justify-center"
              resizeMode="cover"
            >
              <Text className="text-white font-bold tracking-wider text-center text-vertical-center">Sold House</Text>

            </ImageBackground>


          </View>


        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
