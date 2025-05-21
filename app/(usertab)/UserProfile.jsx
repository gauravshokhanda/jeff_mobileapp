import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../../config/apiConfig";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const MenuHeader = () => {
  const postContentWidth = screenWidth * 0.92;
  const userId = useSelector((state) => state.auth.user.id);
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getMyPosts = async () => {
      try {
        const response = await API.get(`job-posts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.data.data || []);
      } catch (error) {
        // console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    getMyPosts();
  }, [userId, token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get(`user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.data);
      } catch (error) {
        // Alert.alert("API Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (!userData)
    return <Text className="text-center text-red-500">User not found</Text>;

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.35 }}
      >
       <View className="mt-12 px-3 flex-row items-center gap-4">
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={28} color="white" />
  </TouchableOpacity>

  {userData?.image ? (
    <Image
      source={{ uri: `${baseUrl}/${userData.image}` }}
      className="w-16 h-16 border-2 border-white rounded-full"
    />
  ) : (
    <View className="w-16 h-16 bg-gray-600 border-2 border-white rounded-full justify-center items-center">
      <Text className="text-white text-xl font-bold">
        {userData?.name?.charAt(0).toUpperCase() || "U"}
      </Text>
    </View>
  )}

  <View>
    <Text className="text-2xl font-semibold text-white">
      Welcome, {userData?.name || "User"}!
    </Text>
    <Text className="text-gray-300">{userData?.email}</Text>
  </View>
</View>

      </LinearGradient>

      <View
        className="flex-1 bg-white rounded-3xl p-6 shadow-lg"
        style={{
          marginTop: -screenHeight * 0.18,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
        }}
      >
        <Text className="text-xl font-semibold tracking-widest text-sky-950">
          My Posts
        </Text>
        <View className="w-full h-1 bg-gray-300 my-2" />

        {posts.length > 0 ? (
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="m-2 p-4 bg-white rounded-xl shadow-md flex-row items-center gap-4 border border-gray-200">
                {item.design_image &&
                  JSON.parse(item.design_image).length > 0 && (
                    <Image
                      source={{
                        uri: `${baseUrl}/${JSON.parse(item.design_image)[0]}`,
                      }}
                      className="w-24 h-24 rounded-lg"
                      resizeMode="cover"
                    />
                  )}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {item.description}
                  </Text>
                  <Text className="text-gray-600">
                    Project Type: {item.project_type}
                  </Text>
                  <Text className="text-gray-600">City: {item.city}</Text>
                  <Text className="text-gray-800 font-bold">
                    Total Cost: ${item.total_cost}
                  </Text>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text className="text-gray-500 mt-3 text-center">
            No job posts available.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MenuHeader;
