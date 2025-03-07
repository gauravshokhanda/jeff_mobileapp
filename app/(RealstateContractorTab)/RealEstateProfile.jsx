import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

const { width } = Dimensions.get("window");

const UserDetailScreen = ({ navigation }) => {
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://g32.iamdeveloper.in/api/user-detail",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data); // Debugging
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </SafeAreaView>
    );
  }

  const userName = user?.name || "Unknown";
  const userEmail = user?.email || "No Email";
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-gray-300">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-sky-950 text-lg font-bold ml-2">My Profile</Text>
      </View>

      {/* Profile Card */}
      <View className="bg-gray-800 mx-5 p-5 rounded-xl items-center mt-10">
        {/* Avatar */}
        <View
          style={{
            width: width * 0.35,
            height: width * 0.35,
            borderRadius: width * 0.175,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 50, color: "black", fontWeight: "bold" }}>{avatarLetter}</Text>
        </View>

        {/* User Details */}
        <Text className="text-white text-xl font-bold mt-3">{userName}</Text>
        <Text className="text-gray-300 text-sm">{userEmail}</Text>

        {/* Edit Button */}
        <TouchableOpacity className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg">
          <Ionicons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserDetailScreen;
