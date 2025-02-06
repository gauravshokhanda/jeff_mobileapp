import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";

const ProfileCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data with token:", token);
        const response = await axios.post(
          "https://g32.iamdeveloper.in/api/user-detail",
          {},
          {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          console.log("User data received:", response.data);
          setUserData(response.data);
        } else {
          console.error("Unexpected Response:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
        Alert.alert("API Error", "Failed to fetch user data.");
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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="skyblue" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Failed to load user data.</Text>
      </View>
    );
  }

  const portfolioImages = JSON.parse(userData.portfolio || "[]");
  const portfolioItems = portfolioImages.map((image, index) => ({
    id: index.toString(),
    image: `https://g32.iamdeveloper.in/${image}`,
    name: userData.project_name || `Project ${index + 1}`,
    description: userData.description || "No description available.",
    year: new Date(userData.created_at).getFullYear().toString(),
  }));

  return (
    <ScrollView className="bg-white p-4 shadow-lg rounded-lg">
      {/* Background Image with Overlay */}
      <View className="mt-5 relative w-full h-52">
        <Image
          source={{
            uri: `https://g32.iamdeveloper.in/${userData.upload_organisation}`,
          }}
          className="w-full h-full rounded-lg"
        />
        <Text className="absolute bottom-4 right-4 text-black font-bold text-lg">
          {userData.company_name}
        </Text>
        {/* Circular Profile Image */}
        <Image
          source={{
            uri: `https://g32.iamdeveloper.in/${userData.image}`,
          }}
          className="absolute -bottom-9 left-4 w-28 h-28 rounded-full border-2 border-white"
        />
      </View>

      {/* Info Section */}
      <View className="mt-16 p-4 w-full gap-3 bg-gray-100 rounded-lg">
        <Text className="text-xl font-semibold tracking-widest">
          Name - {userData.name}
        </Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">
          Company - {userData.company_name}
        </Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">
          City - {userData.city}, {userData.zip_code}
        </Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">
          Address - {userData.company_address}
        </Text>
      </View>

      {/* Portfolio Section */}
      <View className="mt-10 px-2 w-full">
        <View className="flex-row gap-1 items-center">
          <Text className="font-bold text-xl text-sky-950 tracking-widest">
            Portfolio
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={portfolioItems}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row p-4 my-3 gap-3 items-center bg-gray-100">
              <Image source={{ uri: item.image }} className="w-40 h-36 rounded-lg" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                <Text className="text-gray-700 mt-1 w-full flex-wrap">{item.description}</Text>
                <Text className="text-black rounded-3xl p-1 mt-1 text-lg font-bold w-auto">
                  Year: {item.year}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal for Adding Portfolio */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 w-4/5 rounded-lg shadow-lg">
            <Text className="text-lg font-bold mb-2">Add New Portfolio</Text>

            <TextInput placeholder="Project Name" className="border p-2 mb-2 rounded" />
            <TextInput placeholder="Description" className="border p-2 mb-2 rounded" multiline />
            <TextInput placeholder="Year" className="border p-2 mb-2 rounded" keyboardType="numeric" />
            <TextInput placeholder="Image URL (optional)" className="border p-2 mb-2 rounded" />

            <View className="flex-row justify-between mt-2">
              <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
              <Button title="Add Portfolio" />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileCard;
