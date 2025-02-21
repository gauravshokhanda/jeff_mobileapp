import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Button,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddPortfolioModal from "../../components/addPortfolioModal";
import * as ImagePicker from "expo-image-picker";

const ProfileCard = () => {
  const token = useSelector((state) => state.auth.token);
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [organizationImage, setOrganizationImage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: null,
    fetching: false,
  });
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
        setUserData(response.data);
      } catch (error) {
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (userData?.id) fetchPortfolios(1, true);
  }, [userData]);

  const fetchPortfolios = async (page, reset = false) => {
    if (
      pagination.fetching ||
      (pagination.lastPage && page > pagination.lastPage)
    )
      return;

    try {
      setPagination((prev) => ({ ...prev, fetching: true }));

      const response = await axios.get(
        `https://g32.iamdeveloper.in/api/portfolios/contractor/${userData.id}?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { portfolios } = response.data;

      setPortfolios((prev) =>
        reset ? portfolios.data : [...prev, ...portfolios.data]
      );
      setPagination({
        currentPage: portfolios.current_page,
        lastPage: portfolios.last_page,
        fetching: false,
      });
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setPagination((prev) => ({ ...prev, fetching: false }));
    }
  };

  const addPortfolioItem = async (newData) => {
   

    try {
      let formData = new FormData();
      formData.append("project_name", newData.projectName);
      formData.append("city", newData.cityName);
      formData.append("address", newData.address);
      formData.append("description", newData.description);

      newData.selectedImages.forEach((uri, index) => {
        formData.append(`portfolio_images[]`, {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      console.log("Form Data being sent:", formData);

      const response = await axios.post(
        "https://g32.iamdeveloper.in/api/portfolio/store",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        Alert.alert("Success", "Portfolio added successfully!", [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              fetchPortfolios(1, true); // Refresh the portfolio list
            },
          },
        ]);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      Alert.alert(
        "API Error",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const pickImage = async (type) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You need to allow access to your photos.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.cancelled) {
      if (type === "profile") {
        setProfileImage(result.uri);
      } else if (type === "organization") {
        setOrganizationImage(result.uri);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!userData) return;
  
    setUpdating(true);
  
    try {
      // Create a FormData object
      const formData = new FormData();
  
      // Add text fields to FormData
      formData.append("name", editableData.name || userData.name);
      formData.append("email", editableData.email || userData.email);
      formData.append("company_name", editableData.company_name || userData.company_name);
      formData.append("city", editableData.city || userData.city);
      formData.append("company_address", editableData.company_address || userData.company_address);
  
      // Add profile image (if changed)
      if (profileImage) {
        formData.append("image", uriToFormData(profileImage, "image"));
      } else {
        formData.append("image", userData.image); // Send existing image if not changed
      }
  
      // Add organization image (if changed)
      if (organizationImage) {
        formData.append("upload_organisation", uriToFormData(organizationImage, "upload_organisation"));
      } else {
        formData.append("upload_organisation", userData.upload_organisation); // Send existing image if not changed
      }
  
      // Add portfolio data (if required)
      if (userData.portfolio) {
        formData.append("portfolio", JSON.stringify(userData.portfolio)); // Ensure portfolio is sent as an array
      }
  
      // Send the FormData to the API
      const response = await axios.post(
        `https://g32.iamdeveloper.in/api/contractors/update/${userData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
  
      if (response.status === 200) {
        // Update the local state with the new data
        setUserData({ ...userData, ...editableData });
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
  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      {userData ? (
        <>
          {/* Banner with User Image */}
          <View className="relative">
            <Image
              source={{
                uri: `https://g32.iamdeveloper.in/public/${userData.upload_organisation}`,
              }}
              className="w-full h-48"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Image
              source={{
                uri: `https://g32.iamdeveloper.in/public/${userData.image}`,
              }}
              className="absolute bottom-[-20] left-4 w-20 h-20 rounded-full border-4 border-white"
            />
          </View>

          {/* User Details Card */}
          <View className="bg-white mx-4 mt-6 p-4 rounded-lg shadow">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold">Personal Information</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
              >
                <Ionicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-600 mt-2">{userData.name}</Text>
            <Text className="text-gray-600">{userData.email}</Text>
            <Text className="text-gray-600">{userData.number}</Text>
            <Text className="text-gray-600">
              {userData.address}, {userData.city}
            </Text>
            <Text className="text-gray-600 font-semibold mt-2">
              {userData.company_name}
            </Text>
            <Text className="text-gray-600">{userData.company_address}</Text>
          </View>

          {/* Portfolio Section */}
          <View className="flex-row justify-between items-center mx-4 mt-6">
            <Text className="text-xl font-semibold">Portfolios</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle" size={28} color="black" />
            </TouchableOpacity>
          </View>

          {/* Portfolio List */}
          <FlatList
            data={portfolios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-white mx-4 mt-4 p-4 rounded-lg shadow flex-row items-center"
                onPress={() =>
                  navigation.navigate("PortfolioDetail", { id: item.id })
                }
              >
                <Image
                  source={{
                    uri: `https://g32.iamdeveloper.in/public/${
                      JSON.parse(item.portfolio_images)[0]
                    }`,
                  }}
                  className="w-24 h-24 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold">
                    {item.project_name}
                  </Text>
                  <Text className="text-gray-600">
                    {item.city}, {item.address}
                  </Text>
                  <Text
                    className="text-gray-500 text-sm mt-1"
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </TouchableOpacity>
            )}
            onEndReached={() => fetchPortfolios(pagination.currentPage + 1)}
            onEndReachedThreshold={0.1}
          />
        </>
      ) : (
        <ActivityIndicator size="large" color="blue" />
      )}

      {modalVisible && (
        <AddPortfolioModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onClose={() => setModalVisible(false)}
          addPortfolioItem={addPortfolioItem}
        />
      )}

      <Modal visible={editModalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
          <View className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <TouchableOpacity
              className="absolute top-3 right-3"
              onPress={() => setEditModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-center mb-5">Edit Profile</Text>

            {/* Profile Image */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">Profile Image</Text>
              <TouchableOpacity onPress={() => pickImage("profile")} className="items-center">
                <Image
                  source={{ uri: profileImage || userData?.image }}
                  className="w-24 h-24 rounded-full border-2 border-gray-400"
                />
                <Text className="bg-gray-300 p-1 rounded-xl font-bold text-sky-950 mt-2">
                  Change Profile Image
                </Text>
              </TouchableOpacity>
            </View>

            {/* Organization Image */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">Organization Image</Text>
              <TouchableOpacity onPress={() => pickImage("organization")} className="items-center">
                <Image
                  source={{ uri: organizationImage || userData?.upload_organisation }}
                  className="w-32 h-20 rounded-lg border-2 border-gray-400"
                />
                <Text className="bg-gray-300 p-1 rounded-xl font-bold text-sky-950 mt-2">
                  Change Organization Image
                </Text>
              </TouchableOpacity>
            </View>

            {/* Editable Fields */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">Full Name</Text>
              <TextInput
                placeholder="Enter your name"
                value={editableData.name || userData?.name}
                onChangeText={(text) => setEditableData((prevData) => ({ ...prevData, name: text }))}
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">Email</Text>
              <TextInput
                placeholder="Enter your email"
                value={editableData.email || userData?.email}
                onChangeText={(text) => setEditableData((prevData) => ({ ...prevData, email: text }))}
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">Company</Text>
              <TextInput
                placeholder="Enter company name"
                value={editableData.company_name || userData?.company_name}
                onChangeText={(text) => setEditableData((prevData) => ({ ...prevData, company_name: text }))}
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-1">City</Text>
              <TextInput
                placeholder="Enter city"
                value={editableData.city || userData?.city}
                onChangeText={(text) => setEditableData((prevData) => ({ ...prevData, city: text }))}
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-1">Address</Text>
              <TextInput
                placeholder="Enter address"
                value={editableData.company_address || userData?.company_address}
                onChangeText={(text) => setEditableData((prevData) => ({ ...prevData, company_address: text }))}
                className="border border-gray-300 rounded-lg p-3"
              />
            </View>

            <TouchableOpacity className="bg-sky-950 p-3 rounded-lg" onPress={handleSaveChanges}>
              <Text className="text-white text-center font-bold">
                {updating ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileCard;