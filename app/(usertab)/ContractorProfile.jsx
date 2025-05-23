import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API, baseUrl } from "../../config/apiConfig";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ContractorProfile = () => {
  const { user_id } = useLocalSearchParams();
  const [contractor, setContractor] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    const fetchContractorDetails = async () => {
      setLoading(true);
      try {
        const response = await API.get(`contractors/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contractorData = response.data.data;
        setContractor({
          ...contractorData,
          image: `${baseUrl}${contractorData.image}`,
          upload_organisation: `${baseUrl}${contractorData.upload_organisation}`,
        });
      } catch (error) {
        console.log("Error fetching contractor details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPortfolios = async () => {
      setPortfolios([]);
      try {
        const response = await API.get(`portfolios/contractor/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portfolioData = response.data.portfolios.data.map((portfolio) => ({
          ...portfolio,
          portfolio_images: JSON.parse(portfolio.portfolio_images).map(
            (img) => `${baseUrl}${img}`
          ),
        }));
        setPortfolios(portfolioData);
      } catch (error) {
        console.log("Error fetching portfolios:", error);
      }
    };

    if (user_id) {
      fetchContractorDetails();
      fetchPortfolios();
    }
  }, [user_id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#1E40AF" />
      </SafeAreaView>
    );
  }

  if (!contractor) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-center text-red-600 text-lg font-semibold">
          Contractor not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Section */}
        <View className="relative w-full h-56 bg-sky-950 rounded-b-3xl">
          <View
            className={`absolute ${
              Platform.OS === "ios" ? "top-12" : "top-6"
            } left-4 right-4 flex-row items-center justify-between z-10`}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-3 rounded-full bg-black/30"
            >
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: contractor.upload_organisation }}
            className="w-full h-full rounded-b-3xl"
          />
        </View>

        {/* Profile Section */}
        <View className="items-center -mt-16 px-4">
          <Image
            source={{ uri: contractor.image }}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <View className="flex-row items-center mt-3">
            <Text className="text-2xl font-bold text-sky-950">
              {contractor.name}
            </Text>
            {/* Verification Badge Placeholder */}
            <View className="ml-2">
              {/* <Ionicons name="shield-checkmark" size={20} color="#082f49" /> */}
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View className="px-4 mt-6">
          <Text className="text-xl font-semibold text-sky-950 mb-3">
            Contractor Details
          </Text>
          <View className=" rounded-2xl p-5 ">
            <DetailItem label="Company" value={contractor.company_name} icon="business" />
            <DetailItem label="City" value={contractor.city} icon="location" />
            <DetailItem label="Address" value={contractor.company_address} icon="map" />
            <DetailItem label="Zip Code" value={contractor.zip_code} icon="pin" />
            <DetailItem label="Description" value={contractor.description} icon="information-circle" />
          </View>
        </View>

        {/* Portfolio Section */}
        <View className="px-4 mt-6 mb-6">
          <Text className="text-xl font-semibold text-blue-900 mb-3">
            Portfolios
          </Text>
          {portfolios.length === 0 ? (
            <Text className="text-center text-gray-500 text-base">
              No portfolios available
            </Text>
          ) : (
            <FlatList
              data={portfolios}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="bg-white rounded-2xl p-4 m-2 w-80 shadow-md">
                  <Image
                    source={{ uri: item.portfolio_images[0] }}
                    className="w-full h-44 rounded-xl mb-3"
                  />
                  <Text className="text-lg font-semibold text-blue-950">
                    {item.project_name}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    City: {item.city}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Address: {item.address}
                  </Text>
                  <Text className="text-sm text-gray-700 mt-2 leading-5">
                    {item.description}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailItem = ({ label, value, icon }) => (
  <View className="flex-row items-center mb-4">
    <Ionicons name={icon} size={20} color="#082f49" className="mr-3" />
    <View>
      <Text className="text-sm font-medium text-gray-500">{label}</Text>
      <Text className="text-base font-semibold text-gray-800">{value}</Text>
    </View>
  </View>
);

export default ContractorProfile;