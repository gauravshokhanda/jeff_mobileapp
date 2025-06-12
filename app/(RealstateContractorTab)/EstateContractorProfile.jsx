import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import CompleteProfileModal from "../../components/CompleteProfileModal";
import { API } from "../../config/apiConfig";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function EstateContractorProfile() {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchPremiumStatus();
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await API.post(
        "user-detail",
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

  const fetchPremiumStatus = async () => {
    try {
      const response = await API.get("premium/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsPremium(response.data?.premium || false);
    } catch (error) {
      console.error("Error fetching premium status", error);
    }
  };

  const handleProfileSubmit = async (data) => {
    try {
      await API.post("user/profile_update", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUserData();
      setModalVisible(false);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0369A1" />
      </SafeAreaView>
    );
  }

  const userDetails = [
    { label: "Mobile Number", value: userData?.number },
    { label: "Address", value: userData?.address },
    { label: "City", value: userData?.city },
  ];

  const profileSize = screenWidth * 0.3;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#0369A1" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-sky-900">My Profile</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="create-outline" size={26} color="#0369A1" />
        </TouchableOpacity>
      </View>

      {/* Top Info */}
      <View className="items-center mt-6">
        <View
          style={{
            width: profileSize,
            height: profileSize,
            borderRadius: profileSize / 2,
          }}
          className="bg-sky-950 justify-center items-center shadow-md"
        >
          <Text className="text-white text-4xl font-bold">
            {userData?.name?.charAt(0).toUpperCase() || "N"}
          </Text>
        </View>
        <View className="flex-row items-center mt-4">
          <Text className="text-2xl font-semibold text-sky-900">
            {userData?.name || "N/A"}
          </Text>
          {isPremium && (
            <Ionicons
              name="checkmark-circle"
              size={22}
              color="#082f49" // sky-950
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
        <Text className="text-gray-500">{userData?.email || "N/A"}</Text>
      </View>

      {/* Details */}
      <FlatList
        data={userDetails}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: screenWidth * 0.06,
          paddingVertical: screenHeight * 0.03,
        }}
        renderItem={({ item }) => (
          <View className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm mb-4">
            <Text className="text-gray-500 text-xs uppercase tracking-wide">
              {item.label}
            </Text>
            <Text className="text-base text-gray-900 mt-1">
              {item.value || "N/A"}
            </Text>
          </View>
        )}
      />

      {/* Profile Update Modal */}
      <CompleteProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleProfileSubmit}
        initialData={{
          name: userData?.name || "",
          number: userData?.number || "",
          city: userData?.city || "",
          address: userData?.address || "",
          email: userData?.email || "",
        }}
      />
    </SafeAreaView>
  );
}
