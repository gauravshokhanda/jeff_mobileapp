import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import PortfolioModal from "../../components/PortfolioModal";
import * as DocumentPicker from "expo-document-picker";
import { useSelector, dispatch, useDispatch } from "react-redux";
import { API } from "../../config/apiConfig";
import { BlurView } from "expo-blur";
import { updateUserProfile } from "../../redux/slice/authSlice";
import { LinearGradient } from "expo-linear-gradient";

export default function ContractorProfileComplete() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserFullName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [companyContactNumber, setCompanyContactNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [organizationImage, setOrganizationImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [portfolioData, setPortfolioData] = useState({
    projectName: "",
    cityName: "",
    address: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    }
    if (user?.name) {
      setUserFullName(user.name);
    }
  }, [user]);

  const pickImage = async (setImage) => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!userName.trim()) return Alert.alert("Error", "Name is required.");
    if (!userEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return Alert.alert("Error", "Please enter a valid email address.");
    }
    if (!companyName.trim())
      return Alert.alert("Error", "Company name is required.");
    if (
      !companyContactNumber.trim() ||
      !/^[0-9]{10}$/.test(companyContactNumber)
    ) {
      return Alert.alert(
        "Error",
        "Please enter a valid 10-digit contact number."
      );
    }
    if (!portfolioData.projectName.trim())
      return Alert.alert("Error", "Project name is required.");
    if (!portfolioData.description.trim())
      return Alert.alert("Error", "Project description is required.");
    if (!portfolioData.cityName.trim())
      return Alert.alert("Error", "City name is required.");
    if (!profileImage)
      return Alert.alert("Error", "Please upload a profile image.");
    if (!organizationImage)
      return Alert.alert("Error", "Please upload an organization image.");

    setLoading(true);

    try {
      // First API call: setup-profile
      const formData = new FormData();
      formData.append("name", userName);
      formData.append("email", userEmail);
      formData.append("address", portfolioData.address);
      formData.append("company_name", companyName);
      formData.append("number", companyContactNumber);
      formData.append("company_registered_number", registrationNo);
      formData.append("company_address", companyAddress);
      formData.append("project_name", portfolioData.projectName);
      formData.append("description", portfolioData.description);
      formData.append("city", portfolioData.cityName);

      if (profileImage) {
        formData.append("image", {
          uri: profileImage,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }

      if (organizationImage) {
        formData.append("upload_organisation", {
          uri: organizationImage,
          type: "image/jpeg",
          name: "organisation.jpg",
        });
      }

      portfolioData.images.forEach((imageUri, index) => {
        formData.append(`portfolio_images[${index}]`, {
          uri: imageUri,
          type: "image/jpeg",
          name: `portfolio_${index}.jpg`,
        });
      });

      const profileResponse = await API.post("setup-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Second API call: portfolio/store
      const portfolioFormData = new FormData();
      portfolioFormData.append("project_name", portfolioData.projectName);
      portfolioFormData.append("city", portfolioData.cityName);
      portfolioFormData.append("address", portfolioData.address);
      portfolioFormData.append("description", portfolioData.description);

      portfolioData.images.forEach((imageUri, index) => {
        portfolioFormData.append(`images[${index}]`, {
          uri: imageUri,
          type: "image/jpeg",
          name: `portfolio_${index}.jpg`,
        });
      });

      const portfolioResponse = await API.post(
        "portfolio/store",
        portfolioFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile submitted successfully:", profileResponse.data);
      console.log("Portfolio submitted successfully:", portfolioResponse.data);

      dispatch(updateUserProfile(profileResponse.data));
      router.replace("/(generalContractorTab)");
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-gray-700 mt-4 text-lg">Loading</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "white" }}
      className="mt-10"
    >
      {/* Blur Overlay */}
      {modalVisible && (
        <BlurView
          style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
          intensity={50}
          tint="light"
        />
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="p-4 bg-sky-950">
          <Text className="text-gray-100 text-xl font-bold text-center">
            Complete Your Profile
          </Text>
        </View>
        <View className="justify-center items-center relative">
          <TouchableOpacity
            onPress={() => pickImage(setProfileImage)}
            activeOpacity={0.7}
            className="mt-4 flex justify-center items-center size-32 rounded-full overflow-hidden shadow-lg"
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <LinearGradient
                colors={["#e0e0e0", "#cfcfcf"]}
                className="w-full h-full flex justify-center items-center"
              >
                <Ionicons
                  name="person-circle-outline"
                  size={60}
                  color="#7c7c7c"
                />
                <Text className="text-gray-600 text-xs mt-2">
                  Tap to Upload
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <View className="flex-1 m-6">
          <View className="mt-14 border-b border-gray-400 flex-row justify-between items-center pb-1">
            <Text className="text-gray-400 text-lg">Company Name :</Text>
            <TextInput
              className="flex-1  px-3 bg-white py-2 text-gray-700"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          <View className="mt-10 border-b border-gray-400 flex-row justify-between items-center pb-1">
            <Text className="text-gray-400 text-lg">
              Company Contact Number :
            </Text>
            <TextInput
              className="flex-1  px-3 bg-white py-2 text-gray-700"
              keyboardType="numeric"
              value={companyContactNumber}
              onChangeText={setCompanyContactNumber}
            />
          </View>

          <View className="mt-10 border-b border-gray-400 flex-row justify-between items-center pb-1">
            <Text className="text-gray-400 text-lg">
              Company Registration No. :
            </Text>
            <TextInput
              className="flex-1  px-3 bg-white py-2 text-gray-700"
              keyboardType="numeric"
              value={registrationNo}
              onChangeText={setRegistrationNo}
            />
          </View>

          <View className="mt-10 border-b border-gray-400 flex-row justify-between items-center pb-1">
            <Text className="text-gray-400 text-lg">Company Address :</Text>
            <TextInput
              className="flex-1 px-3 bg-white py-2 text-gray-700"
              value={companyAddress}
              onChangeText={setCompanyAddress}
            />
          </View>

          <View className="flex-row mt-10 justify-between items-center">
            {/* portfolio section */}
            <View className="items-start">
              {portfolioData.images.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                >
                  <View className="flex-col border border-dashed border-gray-400 items-center ">
                    <Text className="text-gray-500 text-lg">
                      Portfolio Image
                    </Text>
                    {portfolioData.images.map((uri, index) => (
                      <View key={index} className="relative m-5">
                        <Image
                          source={{ uri }}
                          className="w-32 h-32 rounded-lg"
                        />
                        <TouchableOpacity
                          className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                          onPress={() =>
                            setPortfolioData((prevData) => ({
                              ...prevData,
                              images: prevData.images.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                        >
                          <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <TouchableOpacity
                  className="border border-gray-500 rounded-lg py-3 flex-row items-center px-6"
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="text-gray-600 font-semibold mr-2">
                    Add Portfolio
                  </Text>
                  <Image
                    source={require("../../assets/images/shortUploadIcon.png")}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Organization Image Section */}
            <View className="items-center">
              {!organizationImage ? (
                <TouchableOpacity
                  onPress={() => pickImage(setOrganizationImage)}
                  className="border border-gray-500 rounded-lg py-3 px-4 flex-row items-center justify-center"
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="black"
                  />
                  <Text className="text-gray-600 font-semibold ml-2">
                    Upload Organization
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="relative">
                  <View className="border border-dashed border-gray-400 items-center">
                    <Text className="text-lg text-gray-500">
                      Organization Image
                    </Text>
                    <Image
                      source={{ uri: organizationImage }}
                      className="w-32 h-32 rounded-lg m-5"
                    />
                    <TouchableOpacity
                      className="absolute top-7 right-5  rounded-full p-1"
                      onPress={() => pickImage(setOrganizationImage)}
                    >
                      <Ionicons name="refresh" size={16} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="mt-9 items-center">
            <TouchableOpacity
              className="bg-sky-950 w-[45%] rounded-2xl"
              onPress={handleSubmit}
            >
              <Text className="p-3 text-white text-center">Save Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Portfolio Modal */}
      <PortfolioModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        setPortfolioData={setPortfolioData}
      />
    </KeyboardAvoidingView>
  );
}
