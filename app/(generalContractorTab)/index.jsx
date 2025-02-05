import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../config/apiConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashboardScreen = () => {
  const [posts, setPosts] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    
    try {
      const response = await API.get("job-post/listing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetch post", response.data.data.data);
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
        source={{
          uri: `https://g32.iamdeveloper.in/public/${
            JSON.parse(item.floor_maps_image)[0]
          }`,
        }}
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
        <Text className="text-xs font-bold text-green-600 ml-1 tracking-widest">
          {item.city}
        </Text>
      </View>

      {/* Info Text */}
      <View className="absolute bottom-3 right-3  ">
        <Text className="text-white font-bold text-lg tracking-widest">
          {item.project_type}
        </Text>
        <Text className="text-white font-semibold tracking-widest">
          ${item.total_cost}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Header */}
      <View className="bg-sky-950 py-4 px-10 flex-row items-center justify-between">
        <View>
        <Text className="text-white text-xl font-bold flex-row">
          Welcome, Jhon 👋
        </Text>
        <View className="flex-row mt-1">
        <Ionicons name="location-outline" size={20} color="#0EA5E9" />
        <Text className="text-white ml-1 font-semibold text-sm">
          Florida, USA
        </Text>
        </View>
      </View>
        <Image
          className="h-16 w-16 rounded-full"
          source={require("../../assets/images/AC5D_Logo.jpg")}
        />
      </View>

      {/* new propert section */}
      <View className="mx-9 mt-5">
        <Text className="text-2xl font-bold text-gray-800  ml-2 underline">
          New Property Openings
        </Text>
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
        <View className="flex-col mt-10 justify-center items-center gap-3">
        <TouchableOpacity className=" bg-sky-950 w-96 rounded-lg flex justify-center items-center p-2 h-20">
          <Text className="text-white font-bold text-xl">My Portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" bg-sky-950 w-96 rounded-lg flex justify-center items-center p-2 h-20">
          <Text className="text-white font-bold text-xl">Add City</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;
