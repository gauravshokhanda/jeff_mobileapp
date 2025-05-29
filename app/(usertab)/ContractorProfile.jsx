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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API, baseUrl } from "../../config/apiConfig";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

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
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0A6E6E" />
      </View>
    );
  }

  if (!contractor) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Contractor not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6FAFD]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="relative w-full h-60 bg-[#EAF3FA] rounded-b-3xl shadow-md">
          <Image
            source={{ uri: contractor.upload_organisation }}
            className="w-full h-full absolute top-0 left-0 rounded-b-3xl opacity-90"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "#00000060"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            className={`absolute left-5 p-2 bg-black/40 rounded-full z-10 ${Platform.OS === "ios" ? "top-12" : "top-5"}`}

          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View className="items-center -mt-14 z-10">
          <Image
            source={{ uri: contractor.image }}
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl"
          />
          <Text className="text-xl font-bold text-gray-800 mt-2 tracking-wide">
            {contractor.name}
          </Text>
          <Text className="text-gray-500 text-sm">{contractor.company_name}</Text>
        </View>

        {/* Contractor Info */}
        <View className=" mx-5 my-4 p-4">
          <Text className="text-base text-gray-700">
            📍 <Text className="font-semibold">City:</Text> {contractor.city}
          </Text>
          <Text className="text-base text-gray-700 mt-3">
            🏢 <Text className="font-semibold">Address:</Text> {contractor.company_address}
          </Text>
          <Text className="text-base text-gray-700 mt-3">
            🔢 <Text className="font-semibold">Zip Code:</Text> {contractor.zip_code}
          </Text>
          <Text className="text-base text-gray-700 mt-3">
            📝 <Text className="font-semibold">About:</Text> {contractor.description}
          </Text>
        </View>

        {/* Portfolio Section */}
        <View className="mt-2 px-5 mb-12">
          <Text className="text-xl font-bold text-gray-800 mb-3">✨ Portfolios</Text>
          {portfolios.length === 0 ? (
            <Text className="text-center text-gray-400">No portfolios available</Text>
          ) : (
            <FlatList
              data={portfolios}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <View
                  className="bg-white rounded-2xl shadow-lg mr-4 p-3"
                  style={{ width: width * 0.8 }}
                >
                  <Image
                    source={{ uri: item.portfolio_images[0] }}
                    className="w-full h-40 rounded-xl mb-3"
                    resizeMode="cover"
                  />
                  <Text className="text-lg font-bold text-sky-800 mb-1">
                    {item.project_name}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    📍 {item.city}, {item.address}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContractorProfile;
