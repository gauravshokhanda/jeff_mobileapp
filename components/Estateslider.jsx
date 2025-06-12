import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API } from "../config/apiConfig";
import { useSelector } from "react-redux";

const { width: screenWidth } = Dimensions.get("window");

const EstateSlider = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);

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
            onPress: () => navigation.navigate("SignIn"),
          },
        ],
        { cancelable: true }
      );
      return;
    }

    callback();
  };

  const fetchContractors = async () => {
    setLoading(true);
    try {
      const response = await API.get("get/real-state-contractors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (
        !response.data.contractors ||
        !Array.isArray(response.data.contractors.data)
      ) {
        console.error("❌ No valid contractors data found");
        return;
      }

      const contractorsData = response.data.contractors.data.map((item) => ({
        id: item.id.toString(),
        name: item.name || "Unknown",
        email: item.email || "No Email",
        number: item.number || "Not Available",
        address: item.address || "No Address",
        isPremium: item.premium === 1,
      }));

      setContractors(contractorsData);
    } catch (error) {
      console.error("🚨 API Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const handleCall = (phone) => {
    Alert.alert("Calling", `Dialing: ${phone}`);
  };

  const renderCard = ({ item }) => {
    const firstLetter = item.name?.charAt(0)?.toUpperCase() || "?";

    return (
      <View className="rounded-xl bg-white shadow-md overflow-hidden mb-4 mx-4">
        <TouchableOpacity
          className="bg-sky-950 p-4 flex-row items-start"
          onPress={() =>
            requireLogin(() =>
              navigation.navigate("RealContractorProfile", { user_id: item.id })
            )
          }
        >
          {/* Left Side Avatar */}
          <View
            className="w-14 h-14 rounded-full bg-white justify-center items-center mr-4"
            style={{ shadowColor: "#000", shadowOpacity: 0.1, elevation: 4 }}
          >
            <Text className="text-sky-900 text-xl font-bold">
              {firstLetter}
            </Text>
          </View>

          {/* Details */}
          <View className="flex-1">
          <View className="flex-row items-center mb-1">
  <Text className="text-white font-bold text-lg">{item.name}</Text>
  {item.isPremium && (
    <Ionicons
      name="checkmark-circle"
      size={18}
      color="#e0f2fe" // brighter verified color (optional)
      style={{ marginLeft: 6 }}
    />
  )}
</View>
            <Text className="text-gray-300 text-sm">{item.email}</Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Row */}
        <View className="bg-gray-200 rounded-b-2xl px-4 py-3 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() =>
              requireLogin(() =>
                navigation.navigate("RealContractorProfile", {
                  user_id: item.id,
                })
              )
            }
          >
            <Text className="text-gray-700 text-l font-semibold">
              view profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="pt-4 ">
      {loading ? (
        <ActivityIndicator size="large" color="#0c4a6e" className="mt-10" />
      ) : contractors.length > 0 ? (
        <FlatList
          data={contractors}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchContractors}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      ) : (
        <Text className="text-center text-gray-400 mt-10">
          No contractors available.
        </Text>
      )}
    </View>
  );
};

export default EstateSlider;
