import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
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
      const response = await API.get("contractors/listing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("general contrator data", response.data?.data?.data)
      // Filtering first for better performance
      const filteredData =
        response.data?.data?.data?.filter((item) => item.role === 3) || [];

      const formattedData = filteredData.map((item) => ({
        id: item.id.toString(),
        image: item.image ? { uri: `${baseUrl}${item.image}` } : null,
        name: item.name,
        email: item.email,
        address: item.address,
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

  const handleCall = (phone) => {
    if (phone === "Not Available") {
      Alert.alert("Info", "Contact number not available.");
    } else {
      Alert.alert("Calling", `Dialing: ${phone}`);
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
          {/* <Text className="text-gray-600 text-base font-semibold">
            Contact: {item.contact}
          </Text> */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleVisitProfile(item.id)}
              className="bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <Text className="text-sky-900 font-semibold text-sm">
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCall(item.contact)}
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
    <View className="flex-1 py-3 px-4">
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

      {/* View All Button */}
      {!loading && contractors.length > 0 && (
        <View className="flex-row justify-center mt-6">
          <TouchableOpacity
            onPress={() => router.push("ContractorLists")}
            className="bg-blue-600 rounded-full py-3 px-8 items-center"
          >
            <Text className="text-white font-bold">View All Contractors</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default CardSlider;
