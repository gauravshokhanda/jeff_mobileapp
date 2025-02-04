import { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import axios from "axios"; 

export default function PropertyDetails() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter(); 
  const [property, setProperty] = useState(null); 
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token); 

  console.log("Received Property ID:", id);

  // Fetch property details based on the dynamic ID
  const fetchProperty = async () => {
    const apiUrl = `https://g32.iamdeveloper.in/api/job-posts/${id}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        console.log("API Response Data:", response.data.data);
        setProperty(response.data.data);
      } else {
        console.error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching property:", error.response ? error.response.data : error.message);
      setProperty(null); // Reset property on error
    } finally {
      setLoading(false); // Stop loading after fetch is complete
    }
  };

  useEffect(() => {
    if (id) {
      fetchProperty(); // Call the fetch function when the component mounts
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No property data found.</Text>
      </View>
    );
  }

  // Destructure the property data with default fallbacks
  const {
    imageUrl = "https://via.placeholder.com/600x400",
    name = "Property Name",
    price = "N/A",
    days = "0",
    thumbnailUrl = "https://via.placeholder.com/300x150",
    type = "N/A",
    yearBuilt = "Unknown",
    daysOnMarket = "0",
    priceRange = "N/A",
    squareFootage = "N/A",
    address = "N/A",
    description = "No description available."
  } = property;

  return (
    <ScrollView className="bg-white flex-1">
      <View className="relative">
        <TouchableOpacity
          onPress={() => router.back()} // Go back to previous page
          className="absolute top-5 left-5 bg-white p-2 rounded-full"
        >
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <Image
          source={{ uri: imageUrl }} // Use dynamic image URL with fallback
          className="w-full h-60 rounded-b-lg"
        />
      </View>

      <View className="p-4">
        <Text className="text-gray-600 text-lg mt-2">
          Viewing details for property ID: {id}
        </Text>
        <Text className="text-xl font-bold">{name}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="bg-purple-500 text-white px-3 py-1 rounded-lg">
            For Sale
          </Text>
          <Text className="text-lg font-bold">${price}</Text>
          <Text className="text-gray-500">Days: {days}</Text>
        </View>

        <Image
          source={{ uri: thumbnailUrl }} // Use dynamic thumbnail URL with fallback
          className="w-full h-32 mt-4 rounded-lg"
        />

        <View className="flex-row justify-between items-center mt-2">
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
            <Text className="text-white text-center">Get Direction</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <FontAwesome name="share" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-4 border-t border-gray-300">
        <Text className="text-lg font-semibold">Property Information</Text>
        <Text className="mt-2">Property Type: {type}</Text>
        <Text>Built In: {yearBuilt}</Text>
        <Text>Days on Market: {daysOnMarket}</Text>
        <Text>Price Range: {priceRange}</Text>
        <Text>Square Footage: {squareFootage} sqft</Text>
        <Text>Full Address: {address}</Text>
      </View>

      <View className="p-4 border-t border-gray-300">
        <Text className="text-lg font-semibold">Property Description</Text>
        <Text className="mt-2 text-gray-700">
          {description}
        </Text>
      </View>
    </ScrollView>
  );
}
