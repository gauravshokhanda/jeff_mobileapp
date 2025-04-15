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
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { API } from "../../config/apiConfig";
import { BlurView } from "expo-blur";
import { updateUserProfile } from "../../redux/slice/authSlice";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { FlashList } from "@shopify/flash-list";
import debounce from "lodash.debounce";

export default function ContractorProfileComplete() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserFullName] = useState("");
  const [companyContactNumber, setCompanyContactNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [organizationImage, setOrganizationImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    }
    if (user?.name) {
      setUserFullName(user.name);
    }
  }, [user]);

  const pickImage = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log("Image selection canceled or failed");
    }
  };

  const handleCitySearch = useCallback(
    debounce(async (query, currentPage = 1) => {
      if (!query) {
        setCities([]);
        return;
      }
      setSearchLoading(true);

      try {
        const response = await axios.post(
          `https://g32.iamdeveloper.in/api/citie-search?page=${currentPage}`,
          { city: query },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const cityData = response.data.data.map((city) => ({
          key: city.id.toString(),
          label: city.city,
          zip: city.pincode,
        }));

        if (currentPage === 1) {
          setCities(cityData);
        } else {
          setCities((prevCities) => [...prevCities, ...cityData]);
        }

        setHasMoreCities(currentPage < response.data.pagination.last_page);
      } catch (error) {
        console.log("City search error:", error);
        Alert.alert(
          "Error",
          error.response?.data?.message || "An unknown error occurred."
        );
      } finally {
        setSearchLoading(false);
        setLoadingMore(false);
      }
    }, 500),
    [token]
  );

  const loadMoreCities = () => {
    if (!hasMoreCities || loadingMore) return;
    setLoadingMore(true);
    setPage((prevPage) => {
      handleCitySearch(cityName, prevPage + 1);
      return prevPage + 1;
    });
  };

  const handleSubmit = async () => {
    console.log("submit function started");
    if (!userName.trim()) {
      console.log("Validation failed: Name is required");
      return Alert.alert("Error", "Name is required.");
    }
    if (!userEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      console.log("Validation failed: Invalid email");
      return Alert.alert("Error", "Please enter a valid email address.");
    }
    if (!companyName.trim()) {
      console.log("Validation failed: Company name is required");
      return Alert.alert("Error", "Company name is required.");
    }
    if (
      !companyContactNumber.trim() ||
      !/^\+?[0-9\s\-()]{7,15}$/.test(companyContactNumber)
    ) {
      console.log("Validation failed: Invalid contact number");
      return Alert.alert(
        "Error",
        "Please enter a valid 10-digit contact number."
      );
    }
    if (!cityName.trim()) {
      console.log("Validation failed: City name is required");
      return Alert.alert("Error", "City name is required.");
    }
    if (!companyAddress.trim()) {
      console.log("Validation failed: Company address is required");
      return Alert.alert("Error", "Company address is required.");
    }
    if (!profileImage) {
      console.log("Validation failed: Profile image is required");
      return Alert.alert("Error", "Please upload a profile image.");
    }
    if (!organizationImage) {
      console.log("Validation failed: Organization image is required");
      return Alert.alert("Error", "Please upload an organization image.");
    }

    console.log("Validation passed, preparing form data");
    const formData = new FormData();

    formData.append("name", userName);
    formData.append("email", userEmail);
    formData.append("company_name", companyName);
    formData.append("number", companyContactNumber);
    formData.append("company_registered_number", registrationNo);
    formData.append("company_address", companyAddress);
    formData.append("city", cityName);

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

    console.log("Form data prepared, sending API request");
    setLoading(true);

    try {
      const response = await API.post("setup-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile submitted successfully:", response.data);
      dispatch(updateUserProfile(response.data));
      router.replace("/(generalContractorTab)");
    } catch (error) {
      console.error(
        "Error submitting profile:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while submitting the profile."
      );
    } finally {
      console.log("Submission process completed");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#082f49" />
        <Text className="text-gray-700 mt-4 text-lg">Loading</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "white" }}
        className={`Platform.OS === 'ios' ? 'mx-10' : '5'`}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="p-4">
            <Text className="text-sky-900 text-xl font-bold text-center">
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
                className="flex-1 px-3 bg-white py-2 text-gray-700"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>

            <View className="mt-10 border-b border-gray-400 flex-row justify-between items-center pb-1">
              <Text className="text-gray-400 text-lg">
                Company Contact Number :
              </Text>
              <TextInput
                className="flex-1 px-3 bg-white py-2 text-gray-700"
                keyboardType="numeric"
                value={companyContactNumber}
                onChangeText={setCompanyContactNumber}
              />
            </View>

            <View className="mt-10 border-b border-gray-400 flex-row justify-between items-center pb-1">
              <Text className="text-gray-400 text-lg">
                Company License No. :
              </Text>
              <TextInput
                className="flex-1 px-3 bg-white py-2 text-gray-700"
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

            <View className="mt-10 border-b border-gray-400 flex-row justify-between items-center pb-1">
              <Text className="text-gray-400 text-lg">City :</Text>
              <TextInput
                className="flex-1 px-3 bg-white py-2 text-gray-700"
                value={cityName}
                onChangeText={(text) => {
                  setCityName(text);
                  setPage(1);
                  handleCitySearch(text, 1);
                }}
              />
            </View>

            {searchLoading && (
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={{ marginTop: 5, alignSelf: "flex-end" }}
              />
            )}

            {cities.length > 0 && (
              <View className="mt-2 w-full bg-white border border-gray-400 rounded-lg">
                <FlashList
                  data={cities}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCityName(item.label);
                        setCities([]);
                      }}
                      className="p-4 border-b border-gray-400 bg-gray-100"
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  estimatedItemSize={50}
                  className="flex-1"
                  ListFooterComponent={
                    hasMoreCities && (
                      <TouchableOpacity
                        onPress={loadMoreCities}
                        className="bg-blue-600 p-2 rounded-lg mt-2"
                      >
                        <Text className="text-white text-center">
                          Load More
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                />
              </View>
            )}

            <View className="flex-row mt-10 justify-between items-center">
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
                        className="absolute top-7 right-5 rounded-full p-1"
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
