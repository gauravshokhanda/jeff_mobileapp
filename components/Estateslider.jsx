import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'; 

const EsateSlider = () => {
  const [contractors, setContractors] = useState([]);
  const navigation = useNavigation();

  // Fetch contractors data from API
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch('https://g32.iamdeveloper.in/api/get/real-state-contractors');
        const data = await response.json();
        setContractors(data.contractors); 
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch contractors.');
      }
    };

    fetchContractors();
  }, []);

  const handleVisitProfile = (profileLink) => {
    Alert.alert('Visit Profile', `Redirecting to: ${profileLink}`);
  };

  const handleCall = (phone) => {
    Alert.alert('Calling', `Dialing: ${phone}`);
  };

  const handleViewAll = () => {
    navigation.navigate('ContractorPage');
  };

  const renderCard = ({ item }) => (
    <View className="bg-white shadow-md w-44 h-64 mr-4">
      <Image
        source={{ uri: item.image }} // Assuming the API returns image URLs
        className="w-full h-24 rounded-t-lg mx-2"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-xs text-gray-600 mb-2" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-blue-700 rounded-md px-3 py-1"
            onPress={() => handleVisitProfile(item.profileLink)}
          >
            <Text className="text-white text-xs">Visit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-600 rounded-md px-3 py-1"
            onPress={() => handleCall(item.contact)}
          >
            <Text className="text-white text-xs">Want to Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={contractors}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
      {/* View All Button */}
      <View className="mt-4 items-center">
        <TouchableOpacity
          className="bg-sky-950 rounded-md px-6 py-2 flex-row items-center"
          onPress={handleViewAll}
        >
          <Ionicons name="eye" size={20} color="white" className="mr-2" />
          <Text className="text-white text-base font-semibold">View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EsateSlider;
