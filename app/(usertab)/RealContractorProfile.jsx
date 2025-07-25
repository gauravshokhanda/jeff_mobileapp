import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API, baseUrl } from "../../config/apiConfig";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

const RealContractorProfile = () => {
  const { user_id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [contractor, setContractor] = useState(null);
  const [propertyIds, setPropertyIds] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  const capitalizeFirst = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchContractorDetails = async () => {
      setLoading(true);
      try {
        const response = await API.get(`contractors/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contractorData = response.data.data;
        setContractor(contractorData);

        if (contractorData.realstate_property_ids) {
          const parsedIds = JSON.parse(contractorData.realstate_property_ids);
          setPropertyIds(parsedIds);
        }
      } catch (error) {
        console.log("Error fetching contractor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractorDetails();
  }, [user_id]);

  useEffect(() => {
    const fetchProperties = async () => {
      setPropertyLoading(true);
      setProperties([]); // ✅ clear old properties before fetching new ones
      try {
        const response = await API.get(
          `realstate-property/contractor/${user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.properties?.data) {
          setProperties(response.data.properties.data);
        } else {
          setProperties([]); // ✅ ensure clean state even if API returns no data
        }
      } catch (error) {
        console.log("Error fetching contractor properties:", error);
        setProperties([]); // ✅ fallback clean state on error
      } finally {
        setPropertyLoading(false);
      }
    };

    if (user_id) {
      fetchProperties();
    }
  }, [user_id]);


  if (loading || !contractor) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0369A1" />
      </View>
    );
  }

  const { name, email } = contractor;
  const avatarLetter = name?.charAt(0)?.toUpperCase() || "?";

  const renderProperty = ({ item }) => {
    const propertyImages = JSON.parse(item.property_images || "[]");

    return (
      <View className="rounded-xl bg-white shadow-md overflow-hidden mb-4 mx-4">
        <TouchableOpacity
          className="bg-sky-950 p-4"
          onPress={() => router.push(`RealContractorListing?id=${item.id}`)}
        >
          <View className="flex-row">
            <View style={{ width: width * 0.25, height: width * 0.25 }}>
              {propertyImages.length > 0 ? (
                <Swiper
                  className="w-full h-full"
                  loop
                  autoplay
                  autoplayTimeout={3}
                  showsPagination={false}
                >
                  {propertyImages.map((img, index) => (
                    <Image
                      key={index}
                      source={{ uri: `${baseUrl}${img.replace(/\\/g, "/")}` }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  ))}
                </Swiper>
              ) : (
                <Image
                  source={require("../../assets/images/realState/checkoutProperty.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 8,
                  }}
                />
              )}
            </View>

            <View className="flex-1 ml-4 justify-around">
              <Text className="text-white font-bold text-lg">
                ${item.price}
              </Text>
              <Text className="text-gray-300">Area: {item.area} sq ft</Text>
              <Text className="text-gray-300">
                Furnish: {capitalizeFirst(item.furnish_type)}
              </Text>
              <Text className="text-gray-300">
                City: {capitalizeFirst(item.city)} | {capitalizeFirst(item.house_type)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 flex-row items-center justify-between mt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-sky-900/10"
          >
            <Ionicons name="arrow-back" size={28} color="#0369A1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push(`/ChatScreen?user_id=${user_id}`);
            }}
            className="p-2 rounded-full bg-sky-900/10"
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={26}
              color="#0369A1"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center mt-6">
          <View
            style={{
              width: width * 0.3,
              height: width * 0.3,
              borderRadius: (width * 0.3) / 2,
            }}
            className="bg-sky-950 justify-center items-center"
          >
            <Text className="text-white text-4xl font-bold">
              {avatarLetter}
            </Text>
          </View>
          <View className="flex-row items-center mt-2">
            <Text className="text-lg font-semibold text-sky-950">
              {name}
            </Text>
            {contractor.premium === 1 && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#082f49" // sky-950
                style={{ marginLeft: 6 }}
              />
            )}
          </View>

          <Text className="text-gray-600">{email}</Text>
        </View>

        {/* Property Listings */}
        <Text className="text-xl mt-10 font-semibold text-sky-950 px-6 mb-2">
          Listed Properties
        </Text>

        {propertyLoading ? (
          <ActivityIndicator size="large" color="#0369A1" className="my-6" />
        ) : properties.length > 0 ? (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProperty}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text className="text-center text-gray-400 mt-4">
            No properties available.
          </Text>
        )}

      </View>
    </SafeAreaView>
  );
};

export default RealContractorProfile;
