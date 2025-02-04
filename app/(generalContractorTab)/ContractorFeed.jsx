import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "expo-router";

export default function PropertyList() {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0); // Track the scroll position
  const [refreshing, setRefreshing] = useState(false); // For refresh loader

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        "https://g32.iamdeveloper.in/api/job-post/listing",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        setProperties(response.data.data.data);
      } else {
        console.error("Unexpected API response:", response.data);
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing
    }
  };

  // Handle the scroll event to track scroll position
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);

    // If we're at the top, trigger a refresh
    if (offsetY <= -160 && !refreshing) {
      setRefreshing(true);
      fetchProperties();
    }
  };

  return (
    <View className="flex-1 bg-gray-100 py-4">
      {/* Location */}
      <Text className="text-gray-500 font-bold text-sm mt-8 ml-4">📍 Florida, USA</Text>

      {/* Header Section */}
      <View className="h-20 flex-row items-center bg-sky-950 px-4 mt-2">
        {/* Notification Icon */}
        <TouchableOpacity className="mr-4">
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-row flex-1 items-center bg-white rounded-xl px-3 py-2">
          <Ionicons name="search" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Search properties..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-black text-base"
          />
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

     
      {/* Property List */}
      {loading || refreshing ? (
        <ActivityIndicator size="large" color="#082f49" className="mt-10" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="px-4"
          onScroll={handleScroll} // Handle scroll
          scrollEventThrottle={16} // Control the frequency of the scroll events
        >
          {properties.length > 0 ? (
            properties
              .filter((property) =>
                property.project_type
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((property) => {
                let designImages = [];
                try {
                  designImages = JSON.parse(property.design_image);
                } catch (error) {
                  console.error("Error parsing design_image:", error);
                }

                const imageUrl =
                  designImages.length > 0
                    ? `https://g32.iamdeveloper.in/public/${designImages[0]}`
                    : null;

                return (
                  <View
                    key={property.id}
                    className="bg-white mt-5 shadow-lg rounded-2xl mb-4"
                  >
                    {/* Property Image */}
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-52 rounded-t-2xl"
                      />
                    ) : (
                      <Text className="text-center py-4 text-gray-500">
                        No image available
                      </Text>
                    )}

                    {/* Like Button */}
                    <TouchableOpacity className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
                      <Ionicons name="heart-outline" size={22} color="gray" />
                    </TouchableOpacity>

                    {/* Property Details */}
                    <View className="p-4 flex flex-row justify-between">
                      <View className="flex flex-col gap-2">
                        <Text className="text-sky-950 text-3xl font-bold">
                          ${property.total_cost.toLocaleString()}
                        </Text>
                        <Text className="text-gray-600 text-xl">
                          #{property.zipcode}, {property.city}
                        </Text>
                        <Text className="text-gray-400 text-base p-">
                      📅 {new Date(property.created_at).toLocaleString()}
                    </Text>
                      </View>

                      <View className="flex-col justify-between items-end gap-2 ">
                        <Text className="text-gray-900 font-semibold text-xl">
                          {property.project_type} Apartment
                        </Text>
                        <TouchableOpacity
                          className="bg-sky-950 px-5 py-2 rounded-lg"
                          onPress={() =>
                            router.push(`/PropertyDetails?id=${property.id}`)
                          }
                        >
                          <Text className="text-white font-semibold text-lg">
                            View
                          </Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center">
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="gray"
                          />
                          <Text className="text-gray-600 text-base ml-1">
                            Days - {property.number_of_days}
                          </Text>
                          
                        </View>
                      </View>
                    </View>

                    {/* Timestamp */}
                  
                  </View>
                );
              })
          ) : (
            <Text className="text-gray-500 text-center mt-4">
              No properties found
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}
