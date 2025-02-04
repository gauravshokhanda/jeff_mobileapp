import { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import axios from "axios";

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  const fetchProperty = async () => {
    const apiUrl = `https://g32.iamdeveloper.in/api/job-post/listing/${id}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setProperty(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching property:", error.response?.data || error.message);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
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

  const { total_cost, number_of_days, area, city, project_type, description, floor_maps_image, design_image } = property;

  const baseUrl = "https://g32.iamdeveloper.in/public/";
  let floorMap = "https://via.placeholder.com/600x400";
  let designImages = [];

  try {
    const parsedFloorMaps = JSON.parse(floor_maps_image || "[]");
    if (parsedFloorMaps.length > 0) {
      floorMap = `${baseUrl}${parsedFloorMaps[0]}`;
    }

    const parsedDesignImages = JSON.parse(design_image || "[]");
    designImages = parsedDesignImages.map((img) => `${baseUrl}${img}`);
  } catch (error) {
    console.error("Error parsing image data:", error);
  }

  return (
    <ScrollView className="bg-white flex-1 mt-8 p-4">
      {/* Image with Floating Icons */}
      <View className="relative">
        {/* Floating Icons (Back and Share) */}
        <View className="absolute top-5 gap-2 left-5 right-5 flex-row justify-between z-10">
          <View className="bg-white p-2 rounded-full shadow-md">
            <FontAwesome name="arrow-left" size={20} color="black" />
          </View>

          <View className="bg-white p-2 rounded-full shadow-md">
            <FontAwesome name="share-alt" size={20} color="black" />
          </View>
        </View>

        {/* Property Image */}
        <Image source={{ uri: floorMap }} className="w-full h-60 rounded-lg" />
      </View>

      {/* Property Details Section */}
      <View className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-xl font-bold">Property Type : {project_type} </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="bg-sky-950 text-white px-3 py-1 rounded-lg">For Sale</Text>
          <Text className="text-lg font-bold">${total_cost}</Text>
          <Text className="text-gray-500">Days: {number_of_days}</Text>
        </View>

        <Text className="text-gray-700 mt-2">Area: {area} sqft</Text>

        {/* Design Images */}
        <ScrollView horizontal className="mt-4">
          {designImages.length > 0 ? (
            designImages.map((img, index) => (
              <Image key={index} source={{ uri: img }} className="w-40 h-32 mr-2 rounded-lg" />
            ))
          ) : (
            <Text className="text-gray-500">No design images available</Text>
          )}
        </ScrollView>
      </View>

      {/* Property Information */}
      <View className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-xl font-semibold">Property Information</Text>
        <View className="mt-2 gap-2">
          <Text className="text-gray-700">
            <Text className="font-semibold">Property Type:</Text> {project_type}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Location:</Text> {city}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Built In:</Text> 2020
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Days:</Text> {number_of_days}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Square Footage:</Text> {area} sqft
          </Text>
          <Text className="text-gray-700">
            <Text className="font-semibold">Total Cost:</Text> ${total_cost}
          </Text>
        </View>
      </View>

      {/* Property Description */}
      <View className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-semibold">Property Description</Text>
        <Text className="mt-2 text-gray-700">{description}</Text>
      </View>
    </ScrollView>
  );
}
