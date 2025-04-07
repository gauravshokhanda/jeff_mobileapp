import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function EstateContractorProfile() {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0369A1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center ml-2 pb-3 border-gray-300">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} color="#0369A1" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View className="bg-gray-300 h-full rounded-t-full">
        <View className="items-center mt-6">
          <View
            style={{
              width: width * 0.3,
              height: width * 0.3,
              borderRadius: (width * 0.3) / 2,
            }}
            className="bg-sky-950 justify-center items-center"
          >
            <Text className="text-white text-4xl font-bold">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : "N"}
            </Text>
          </View>
          <Text className="text-lg font-semibold text-sky-950 mt-2">
            {userData?.name || "N/A"}
          </Text>
          <Text className="text-gray-600">{userData?.email}</Text>
        </View>

        {/* Details Section */}
        <View className="mt-6  p-6 rounded-lg "></View>
      </View>
    </SafeAreaView>
  );
}
