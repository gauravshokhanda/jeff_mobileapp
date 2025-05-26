import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../config/apiConfig";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
const { width: screenWidth } = Dimensions.get("window");
const CardSlider = () => {
  const token = useSelector((state) => state.auth.token);

  const [contractors, setContractors] = useState([]);

  const [loading, setLoading] = useState(true);

  const getContractors = async () => {
    setLoading(true);
    try {
      const response = await API.get("general/contractors/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("contractor reponse",response.data.data)
      const filteredData =
        response.data?.data?.filter((item) => item.role === 3) || [];
        // console.log("filteredData",filteredData)


      const formattedData = filteredData.map((item) => ({
        id: item.id.toString(),
        image: item.image ? { uri: `${baseUrl}${item.image}` } : null,
        name: item.name,
        email: item.email,
        address: item.company_address,
        title: item.company_name,
        description: item.description,
        profileLink: `${baseUrl}${item.upload_organisation}`,
        contact: item.company_registered_number || "Not Available",
      }));

      setContractors(formattedData);
    } catch (error) {
      console.error("Error fetching contractors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContractors();
  }, []);

  const handleVisitProfile = (id) => {
    router.push(`/ContractorProfile?user_id=${id}`);
  };

  const requireLogin = (callback) => {
    if (!token) {
      Alert.alert(
        "Sign in Required",
        "Please Sign in to continue.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign in",
            onPress: () => router.push("/SignIn"),
          },
        ],
        { cancelable: true }
      );
      return;
    }

    callback();
  };

  const handleCall = async (phone) => {
    console.log("calling to", phone);
    if (phone === "Not Available" || !phone) {
      Alert.alert("Info", "Contact number not available.");
      return;
    }

    // Clean the phone number (remove spaces, dashes, etc.)
    const cleanedPhone = phone.replace(/[\s-()]/g, "");

    // Construct the phone URL
    const phoneUrl =
      Platform.OS === "ios"
        ? `telprompt:${cleanedPhone}`
        : `tel:${cleanedPhone}`;

    try {
      // Check if the device can open the phone URL
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Error", "Unable to make a call on this device.");
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      Alert.alert("Error", "Failed to make the call.");
    }
  };

  const renderCard = ({ item }) => {
    const firstLetter = item.name?.charAt(0)?.toUpperCase() || "?";

    return (
      <View className="rounded-xl bg-white shadow-md overflow-hidden mb-4">
        {/* Top Contractor Info Block */}
        <View className="bg-sky-950 p-4 flex-row items-start">
          <View className="flex-1">
            {/* Header with image + name/email */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                {item.image ? (
                  <Image
                    source={item.image}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-white justify-center items-center">
                    <Text className="text-sky-900 text-lg font-bold">
                      {firstLetter}
                    </Text>
                  </View>
                )}
                <View className="ml-3">
                  <Text className="text-white font-bold">{item.name}</Text>
                  <Text className="text-gray-300 text-sm">{item.email}</Text>
                </View>
              </View>
            </View>

            {/* Address + Description */}
            <Text className="text-gray-400 mt-3 text-sm">
              Address: {item.address}
            </Text>
            <Text className="text-gray-400 mt-2 text-xs" numberOfLines={3}>
              {item.description?.length > 80
                ? `${item.description.substring(0, 80)}...`
                : item.description}
            </Text>

            {/* Company name */}
            {item.title && (
              <View className="mt-3 flex-row items-center">
                <Ionicons name="business-outline" size={16} color="white" />
                <Text className="text-gray-300 ml-2">{item.title}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom CTA Section */}
        <View className="bg-gray-200 rounded-b-2xl p-4 flex-row justify-between items-center">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => requireLogin(() => handleVisitProfile(item.id))}
              className="bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <Text className="text-sky-900 font-semibold text-sm">
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => requireLogin(() => handleCall(item.contact))}
              className="bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <Text className="text-sky-900 font-semibold text-sm">Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 py-3 px-4 mb-2">
      {loading ? (
        <View className="flex-1 justify-center items-center mt-5">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={contractors}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          refreshing={loading}
          onRefresh={getContractors}
        />
      )}
    </View>
  );
};
export default CardSlider;
