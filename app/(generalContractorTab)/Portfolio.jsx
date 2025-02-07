import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useSelector } from "react-redux";

const PortfolioScreen = ({ navigation }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        console.log("Token being sent:", token); // Check if token exists

        const response = await axios.post(
          "https://g32.iamdeveloper.in/api/user-detail",
          {}, // Send an empty body if required
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.status === 200) {
          const userData = response.data;
          const portfolioImages = JSON.parse(userData.portfolio || "[]");
          const portfolioData = portfolioImages.map((image, index) => ({
            id: index.toString(),
            image: `https://g32.iamdeveloper.in/${image}`,
            name: userData.project_name || `Project ${index + 1}`,
            description: userData.description || "No description available.",
            year: new Date(userData.created_at).getFullYear().toString(),
          }));
          setPortfolioItems(portfolioData);
        } else {
          console.error("Unexpected Response:", response.status);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error.response?.data || error.message);

        // Show an alert for better debugging
        Alert.alert("API Error", error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPortfolio();
    } else {
      console.error("Token is missing!");
      Alert.alert("Error", "User token is missing!");
    }
  }, [token]);

  const filteredPortfolio = portfolioItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-sky-950 p-4 h-24 mt-12 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 bg-white p-4 text-gray-900 rounded-lg ml-4"
          placeholder="Search portfolio..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Portfolio Section */}
      <View className="mt-6 px-4 w-full">
        <View className="flex-row gap-2 items-center">
          <Text className="font-bold text-xl text-sky-950 tracking-widest">Portfolio</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="skyblue" className="mt-10" />
        ) : (
          <FlatList
            data={filteredPortfolio}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="flex-row p-4 my-3 gap-3 items-center bg-gray-100 rounded-lg shadow-sm">
                <Image source={{ uri: item.image }} className="w-32 h-32 rounded-lg" />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                  <Text className="text-gray-700 mt-1">{item.description}</Text>
                  <Text className="text-black font-semibold mt-2">Year: {item.year}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default PortfolioScreen;
