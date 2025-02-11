import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Alert, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../../config/apiConfig";
import Svg, { Path ,Circle, Rect} from "react-native-svg";
import { FontAwesome,Ionicons } from "@expo/vector-icons";

const MenuHeader = () => {


  const userId = useSelector((state) => state.auth.user.id);

  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getMyPosts = async () => {
      try {
        const response = await API.get(`job-posts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
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
        Alert.alert("API Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (!userData) return <Text className="text-center text-red-500">User not found</Text>;

  return (
    <View className="bg-white p-4 shadow-lg rounded-lg">
      {/* Header Section */}
      <View className="bg-sky-950 h-56">
        <View className="mt-10 px-4 gap-2 flex-row items-center justify-center">
        <Image
            source={require('../../assets/images/AC5D_Logo.jpg')}
            className="w-14 h-14 border-2 border-white rounded-full"
          />
          <View className="gap-1">
            <Text className="text-3xl font-semibold text-white">
              Welcome! {userData?.name || "User"}
            </Text>
          </View>
        </View>

        {/* Wave Effect */}
        <Svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1440 360">
          <Path
            fill="#ffffff"
            d="M0,200L80,190C160,180,320,160,480,170C640,180,800,220,960,220C1120,220,1280,180,1360,160L1440,140V320H0Z"
          />
        </Svg>
      </View>

      {/* User Info */}
      <View className="p-4  rounded-lg gap-3">
        <Text className="text-xl font-semibold tracking-widest">Name - {userData.name}</Text>
        <Text className="text-xl font-semibold tracking-wider">Email - {userData.email}</Text>
        <Text className="text-xl font-semibold tracking-wider">Company - {userData.company_name || ""}</Text>
        <Text className="text-xl font-semibold tracking-wider">City - {userData.city || ""}</Text>
        <Text className="text-xl font-semibold tracking-wider">Address - {userData.company_address || ""}</Text>
        <Text className="text-xl font-semibold tracking-wider">Zip Code - {userData.zip_code || ""}</Text>
      </View>

      {/* My Posts */}
      <View className="mt-5  w-full">
        <View className="flex-row gap-2 items-center">
          <Text className="font-bold text-xl text-sky-950 tracking-widest pl-5">My Posts</Text>
          <Ionicons name="images" size={30} color="gray" />
        </View>

        {posts.length > 0 ? (
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="m-2 p-3 bg-white rounded-lg shadow-md w-full flex-row">
                {item.design_image && JSON.parse(item.design_image).length > 0 && (
                  <Image
                    source={{ uri: `${baseUrl}/${JSON.parse(item.design_image)[0]}` }}
                    className="w-32 h-32 rounded-lg mr-4"
                  />
                )}
                <View className="flex-1">
                  <Text className="text-lg font-semibold">{item.description}</Text>
                  <Text className="text-gray-600">Project Type: {item.project_type}</Text>
                  <Text className="text-gray-600">City: {item.city}</Text>
                  <Text className="text-gray-600">Total Cost: ${item.total_cost}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text className="text-gray-500 mt-3">No job posts available.</Text>
        )}
      </View>
    </View>
  );
};

export default MenuHeader;
