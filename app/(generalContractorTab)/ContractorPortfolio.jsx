import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import AddPortfolioModal from "@/components/addPortfolioModal";
import UpdateContractorProfile from "@/components/updateContractorProfile"; 

const ProfileCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [organizationImage, setOrganizationImage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [addPortfolioModalVisible, setAddPortfolioModalVisible] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const [contractorId, setContractorId] = useState(null);


  // Fetch user data
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

        if (response.status === 200) {
         
          setContractorId(response.data.id);
          console.log("Contractor ID:", response.data.id);
          const portfolioResponse = await axios.get(
            `https://g32.iamdeveloper.in/api/portfolios/contractor/${contractorId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const { data } = response;
          setUserData(data);
          setEditableData(data);
          setProfileImage(`https://g32.iamdeveloper.in/public/${data.image}`);
          setOrganizationImage(`https://g32.iamdeveloper.in/public/${data.upload_organisation}`);
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

  // Handle image picker
  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      type === "profile" ? setProfileImage(uri) : setOrganizationImage(uri);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!userData) return;

    setUpdating(true);

    try {
      const response = await axios.post(
        `https://g32.iamdeveloper.in/api/contractors/update/${userData.id}`,
        editableData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUserData(editableData);
        Alert.alert("Success", "Profile updated successfully.");
        setEditModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating user data:", error.response?.data || error.message);
      Alert.alert("API Error", "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  // Loading and error handling UI
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

  // Prepare portfolio items
  const portfolioImages = JSON.parse(userData.portfolio || "[]");
  const portfolioItems = portfolioImages.map((image, index) => ({
    id: index.toString(),
    image: `https://g32.iamdeveloper.in/public/${image}`,
    name: userData.project_name || `Project ${index + 1}`,
    description: userData.description || "No description available.",
    year: new Date(userData.created_at).getFullYear().toString(),
  }));

  return (
    <View className="bg-white p-4 shadow-lg rounded-lg">
      <View className="mt-5 relative w-full h-52">
        <Image
          source={{ uri: organizationImage }}
          className="w-full h-full rounded-lg"
        />
        <View className="absolute inset-0 bg-black/30 rounded-lg" />
        <Text className="absolute bottom-4 right-4 text-white font-bold text-lg">
          {userData.company_name}
        </Text>
        <Image
          source={{ uri: profileImage }}
          className="absolute -bottom-9 left-4 w-28 h-28 rounded-full border-2 border-white"
        />
      </View>

      <TouchableOpacity
        className="absolute top-5 right-2"
        onPress={() => setEditModalVisible(true)}
      >
        <Ionicons name="create" size={40} color="white" />
      </TouchableOpacity>

      <View className="mt-16 p-4 w-full gap-3 bg-gray-100 rounded-lg">
        <Text className="text-xl font-semibold tracking-widest">Name - {userData.name}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Company - {userData.company_name}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">City - {userData.city}, {userData.zip_code}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Address - {userData.company_address}</Text>
      </View>

      <View className="mt-10 px-2 w-full">
        <View className="flex-row gap-1 items-center">
          <Text className="font-bold text-xl text-sky-950 tracking-widest">Portfolio</Text>
          <TouchableOpacity
            onPress={() => setAddPortfolioModalVisible(true)}
          >
            <Ionicons name="add-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>
        <AddPortfolioModal
          visible={addPortfolioModalVisible}
          onClose={() => setAddPortfolioModalVisible(false)}
        />
  
        <FlatList
          data={portfolioItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row p-4 my-3 gap-3 items-center bg-gray-100">
              <Image source={{ uri: item.image }} className="w-40 h-36 rounded-lg" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                <Text className="text-gray-700 mt-1">{item.description}</Text>
                <Text className="text-black rounded-3xl p-1 mt-1 text-lg font-bold">Year: {item.year}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Import Update Contractor Profile Modal */}
      <UpdateContractorProfile
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveChanges}
        editableData={editableData}
        setEditableData={setEditableData}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        organizationImage={organizationImage}
        setOrganizationImage={setOrganizationImage}
      />
    </View>
  );
};

export default ProfileCard; 