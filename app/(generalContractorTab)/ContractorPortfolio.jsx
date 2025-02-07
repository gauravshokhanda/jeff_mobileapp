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
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";

const ProfileCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [organizationImage, setOrganizationImage] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://g32.iamdeveloper.in/api/user-detail",
          {},
          {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          setUserData(response.data);
          setEditableData(response.data);
          setProfileImage(`https://g32.iamdeveloper.in/public/${response.data.image}`);
          setOrganizationImage(`https://g32.iamdeveloper.in/public/${response.data.upload_organisation}`);
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

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "profile") {
        setProfileImage(result.assets[0].uri);
      } else {
        setOrganizationImage(result.assets[0].uri);
      }
    }
  };

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
    image: `https://g32.iamdeveloper.in/public/${image}`,
    name: userData.project_name || `Project ${index + 1}`,
    description: userData.description || "No description available.",
    year: new Date(userData.created_at).getFullYear().toString(),
  }));

  return (
    <ScrollView className="bg-white p-4 shadow-lg rounded-lg">
      {/* Profile Header */}
      <View className="mt-5 relative w-full h-52">
        <Image source={{ uri: organizationImage }} className="w-full h-full rounded-lg" />
        <View className="absolute inset-0 bg-black/30 rounded-lg" />
        <Text className="absolute bottom-4 right-4 text-black font-bold text-lg">
          {userData.company_name}
        </Text>
        <Image source={{ uri: profileImage }} className="absolute -bottom-9 left-4 w-28 h-28 rounded-full border-2 border-white" />
      </View>

      {/* Edit Profile Button (Always Visible) */}
      <TouchableOpacity className="absolute top-5 right-2" onPress={() => setEditModalVisible(true)}>
        <Ionicons name="create" size={40} color="black" />
      </TouchableOpacity>

      {/* Info Section */}
      <View className="mt-16 p-4 w-full gap-3 bg-gray-100 rounded-lg">
        <Text className="text-xl font-semibold tracking-widest">Name - {userData.name}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Company - {userData.company_name}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">City - {userData.city}, {userData.zip_code}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Address - {userData.company_address}</Text>
      </View>

      {/* Portfolio Section */}
      <View className="mt-10 px-2 w-full">
        <View className="flex-row gap-1 items-center">
          <Text className="font-bold text-xl text-sky-950 tracking-widest">Portfolio</Text>
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
                <Text className="text-black rounded-3xl p-1 mt-1 text-lg font-bold w-auto">Year: {item.year}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
          <View className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            {/* Close Button */}
            <TouchableOpacity
              className="absolute top-3 right-3"
              onPress={() => setEditModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-center mb-5">
              Edit Profile
            </Text>

            {/* Profile Image Upload */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">
                Profile Image
              </Text>
              <TouchableOpacity
                onPress={() => pickImage("profile")}
                className="items-center"
              >
                <Image
                  source={{ uri: profileImage }}
                  className="w-24 h-24 rounded-full border-2 border-gray-400"
                />
                <Text className="bg-gray-300 p-1 rounded-xl font-bold text-sky-950 mt-2">
                  Change Profile Image
                </Text>
              </TouchableOpacity>
            </View>

            {/* Organization Image Upload */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">
                Organization Image
              </Text>
              <TouchableOpacity
                onPress={() => pickImage("organization")}
                className="items-center"
              >
                <Image
                  source={{ uri: organizationImage }}
                  className="w-32 h-20 rounded-lg border-2 border-gray-400"
                />
                <Text className="bg-gray-300 p-1 rounded-xl font-bold text-sky-950 mt-2">
                  Change Organization Image
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">
                Full Name
              </Text>
              <TextInput
                placeholder="Enter your name"
                value={editableData.name}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, name: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">Company</Text>
              <TextInput
                placeholder="Enter company name"
                value={editableData.company_name}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, company_name: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">City</Text>
              <TextInput
                placeholder="Enter city"
                value={editableData.city}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, city: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-1">Address</Text>
              <TextInput
                placeholder="Enter address"
                value={editableData.company_address}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, company_address: text })
                }
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              className="bg-sky-950 p-3 rounded-lg"
              onPress={() => setEditModalVisible(false)}
            >
              <Text className="text-white text-center font-bold">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileCard;
