import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons for the icon

const contractors = [
  {
    id: '1',
    image: require('../assets/images/contractors/1.jpg'),
    title: 'Noteworthy technology acquisitions 2021',
    description: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    profileLink: 'https://profile1.com',
    contact: '1234567890',
  },
  {
    id: '2',
    image: require('../assets/images/contractors/2.jpg'),
    title: 'Top Contractors of 2021',
    description: 'Explore the top contractors providing excellent services in various industries.',
    profileLink: 'https://profile2.com',
    contact: '0987654321',
  },
  {
    id: '3',
    image: require('../assets/images/contractors/3.jpg'),
    title: 'Reliable Services 2023',
    description: 'Find reliable contractors offering the best services in 2023. We provide comprehensive insights for your needs.',
    profileLink: 'https://profile3.com',
    contact: '1122334455',
  },
];

const EsateSlider = () => {
  const navigation = useNavigation();

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
    <View className="bg-white rounded-lg shadow-md w-44 h-64 mr-4">
      <Image
        source={item.image}
        className="w-full h-24 rounded-t-lg"
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
          className="bg-sky-600 rounded-md px-6 py-2 flex-row items-center"
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
