import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../config/apiConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashboardScreen = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchPosts();
    fetchUserDetails();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await API.get("job-post/listing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success && Array.isArray(response.data.data.data)) {
        setPosts(response.data.data.data.slice(0, 2));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const response = await API.post(
        "user-detail",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
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

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="w-full h-20 bg-sky-950 justify-center items-start px-4 ">
        <View className="">
          <Text className="text-white text-2xl font-bold">
            Welcome , {user.name}
          </Text>
          <Text className="text-white text-sm">{user.city}</Text>
        </View>
      </View>
      {/* Header */}
      <View className="relative p-2">
        <ImageBackground
          source={{
            uri: `https://g32.iamdeveloper.in/public/${user.upload_organisation}`,
          }}
          className="w-full h-40 bg-cover bg-center"
        >
          <View className="absolute inset-0 bg-black/40"></View>

          {/* Circle at bottom corner, half inside and half outside */}
          <View
            className="absolute w-24 h-24 border border-black bg-white rounded-full"
            style={{
              bottom: -30,
              left: 10,
            }}
          >
            <Image
              source={{
                uri: user.image,
              }}
            />
          </View>
        </ImageBackground>
      </View>

      {/* New Property Openings */}
      <View className="mx-9 mt-12">
        <Text className="text-2xl font-bold text-gray-800  ml-2 ">
          New Property Openings
        </Text>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity className="items-end">
          <Text className="text-gray-500">See all</Text>
        </TouchableOpacity>
      </View>

      {/* Portfolio & Add City */}
      <View className="">
  <View className="flex-col mt-8 justify-center items-center gap-3">
    <TouchableOpacity
      className="w-60 h-16"
      onPress={() => {
        /* Add action here */
      }}
    >
      <ImageBackground
        source={require("../../assets/images/myportfoliobtn.png")}
        className="w-full h-full justify-center items-center"
        imageStyle={{ borderRadius: 12 }} // Apply borderRadius to the image itself
      >
        <Text className="text-white font-bold text-xl">My Portfolio</Text>
      </ImageBackground>
    </TouchableOpacity>
  </View>
</View>

    </SafeAreaView>
  );
};

export default DashboardScreen;
