import { View, Text, Image, FlatList,TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams ,useRouter } from "expo-router";
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
      setPortfolios([]); // Reset portfolios when switching contractors
      try {
        const response = await API.get(`portfolios/contractor/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const portfolioData = response.data.portfolios.data.map((portfolio) => ({
          ...portfolio,
          portfolio_images: JSON.parse(portfolio.portfolio_images).map((img) => `${baseUrl}${img}`),
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
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!contractor) {
    return <Text className="text-center text-red-500">Contractor not found</Text>;
  }

  return (
    <ScrollView className="bg-white p-4 shadow-lg rounded-lg flex-1">
      
      {/* Header with Company Image */}
      <View className="mt-5 relative w-full h-52">
      <TouchableOpacity onPress={() => router.back()} className="ml-2">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Image source={{ uri: contractor.upload_organisation }} className="w-full h-full rounded-lg" />
        <Text className="absolute bottom-4 right-4 text-black font-bold text-lg">
          {contractor.company_name}
        </Text>
        <Image source={{ uri: contractor.image }} className="absolute -bottom-9 left-4 w-28 h-28 rounded-full border-2 border-white" />
      </View>

      {/* Contractor Details */}
      <View className="mt-16 p-4 w-full gap-3 bg-gray-100 rounded-lg">
        <Text className="text-xl font-semibold tracking-widest">Name - {contractor.name}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Company - {contractor.company_name}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">City - {contractor.city}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Address - {contractor.company_address}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Zip Code - {contractor.zip_code}</Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">Description - {contractor.description}</Text>
      </View>

      {/* Portfolio List */}
      <Text className="text-xl font-bold mt-6 mb-2">Portfolios</Text>
      {portfolios.length === 0 ? (
        <Text className="text-center text-gray-500">No portfolios available</Text>
      ) : (
        <FlatList
          data={portfolios}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-gray-200 rounded-lg p-4 m-2 w-80 shadow-lg">
              <Image source={{ uri: item.portfolio_images[0] }} className="w-full h-40 rounded-lg mb-3" />
              <Text className="text-lg font-bold">{item.project_name}</Text>
              <Text className="text-sm text-gray-700">City: {item.city}</Text>
              <Text className="text-sm text-gray-700">Address: {item.address}</Text>
              <Text className="text-sm text-gray-700 mt-1 flex-wrap">{item.description}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

export default ContractorProfile;
