import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API, baseUrl } from "../config/apiConfig";
import { useSelector } from "react-redux";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

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

  const renderCard = ({ item }) => (
    <View 
      style={{ 
        backgroundColor: 'white', 
        padding: 15, 
        marginBottom: 15, 
        borderRadius: 10, 
        shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 3,
        flexDirection: "row",
        alignItems: "center",
        width: width * 0.9,
        alignSelf: "center"
      }}
    >
      {/* Contractor Image */}
      {item.image ? (
        <Image 
          source={item.image} 
          style={{ width: 80, height: 80, borderRadius: 10, marginRight: 15 }} 
        />
      ) : (
        <View 
          style={{ 
            width: 80, height: 80, backgroundColor: 'gray', 
            justifyContent: 'center', alignItems: 'center', 
            borderRadius: 10, marginRight: 15 
          }}
        >
          <Text style={{ color: 'white' }}>No Image</Text>
        </View>
      )}

      {/* Contractor Details */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#082f49" }}>
          {item.name}
        </Text>
        <Text style={{ color: 'gray', fontSize: 14 }}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={{ fontSize: 12, color: "#555" }}>
          {item.description}
        </Text>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <TouchableOpacity 
            style={{ 
              backgroundColor: "#082f49", 
              padding: 6, 
              borderRadius: 6, 
              flexDirection: "row", 
              alignItems: "center",
              marginRight: 10
            }} 
            onPress={() => handleVisitProfile(item.id)}
          >
            <Ionicons name="person-circle-outline" size={18} color="white" />
            <Text style={{ color: "white", fontSize: 12, marginLeft: 5 }}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              backgroundColor: "#10B981", 
              padding: 6, 
              borderRadius: 6, 
              flexDirection: "row", 
              alignItems: "center"
            }} 
            onPress={() => handleCall(item.contact)}
          >
            <Ionicons name="call-outline" size={18} color="white" />
            <Text style={{ color: "white", fontSize: 12, marginLeft: 5 }}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* FlatList for Vertical Scrolling */}
      {contractors.length > 0 ? (
        <FlatList
          data={contractors}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>
          No contractors available.
        </Text>
      )}

      {/* View All Button */}
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: "#2563EB", 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 8, 
            flexDirection: "row", 
            alignItems: "center"
          }} 
          onPress={handleViewAll}
        >
          <Ionicons name="eye" size={20} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EstateSlider;
