import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { API, baseUrl } from "../config/apiConfig";
import { useSelector } from "react-redux";
import { router } from "expo-router";

const EstateSlider = () => {
  const [contractors, setContractors] = useState([]);
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await API.get('get/real-state-contractors', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("🚀 API Response:", response.data);
  
        if (!response.data.contractors || !Array.isArray(response.data.contractors.data)) {
          console.error("❌ No valid contractors data found");
          return;
        }
  
        const contractorsData = response.data.contractors.data.map((item) => ({
          id: item.id.toString(),
          image: item.image ? { uri: `${baseUrl}${item.image}` } : null,
          name: item.name || "Unknown",
          title: item.company_name || "No Company",
          description: item.description || "No description available",
          profileLink: item.upload_organisation ? `${baseUrl}${item.upload_organisation}` : null,
          contact: item.company_registered_number || "Not Available",
        }));
  
        console.log("✅ Processed Contractors:", contractorsData);
        setContractors(contractorsData);
      } catch (error) {
        console.error("🚨 API Fetch Error:", error);
      }
    };
  
    fetchContractors();
  }, []);
  

  const handleVisitProfile = (id) => {
    router.push(`/ContractorProfile?id=${id}`);
  };

  const handleCall = (phone) => {
    Alert.alert('Calling', `Dialing: ${phone}`);
  };

  const handleViewAll = () => {
    navigation.navigate('ContractorPage');
  };

  const renderCard = ({ item }) => {
    console.log("🖼 Rendering Contractor:", item);
  
    return (
      <View style={{ backgroundColor: 'white', padding: 10, margin: 10, borderRadius: 8 }}>
        {item.image ? (
          <Image source={item.image} style={{ width: 100, height: 100, borderRadius: 8 }} />
        ) : (
          <View style={{ width: 100, height: 100, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>No Image</Text>
          </View>
        )}
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ color: 'gray' }}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>📞 {item.contact}</Text>
      </View>
    );
  };
  
  

  return (
    <View className="flex-1 p-4">
      {contractors.length > 0 ? (
        <FlatList
          data={contractors}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      ) : (
        <Text className="text-center text-gray-700 mt-4">No contractors available.</Text>
      )}
  
      <View className="mt-4 items-center">
        <TouchableOpacity className="bg-sky-600 rounded-md px-6 py-2 flex-row items-center" onPress={handleViewAll}>
          <Ionicons name="eye" size={20} color="white" className="mr-2" />
          <Text className="text-white text-base font-semibold">View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};

export default EstateSlider;
