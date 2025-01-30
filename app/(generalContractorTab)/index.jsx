import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = () => {
  return (
    <ScrollView className="bg-white flex-1">
      {/* Header */}
      <View className="bg-indigo-700 py-4 px-4 flex-row items-center">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold ml-4">Dashboard</Text>
      </View>

      {/* Welcome Section */}
      <View className="p-4 flex-row items-center justify-between">
        <View>
          <Text className="text-gray-700 text-lg font-bold">Welcome, Jhon 👋</Text>
          <Text className="text-gray-500">📍 Florida, USA</Text>
        </View>
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }}
          className="w-12 h-12 rounded-full"
        />
      </View>

      {/* New Property Openings */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800">New Property Openings</Text>
        <View className="mt-2 space-y-4">
          {[1, 2].map((item, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri: 'https://via.placeholder.com/300' }}
                className="w-full h-36 rounded-lg"
              />
              <View className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full">
                <Text className="text-xs font-bold text-green-600">ADUNTAS</Text>
              </View>
              <View className="absolute bottom-2 left-2">
                <Text className="text-white font-bold text-lg">Daniel Appartment</Text>
                <Text className="text-white font-semibold">$3000.00</Text>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity className="mt-2">
          <Text className="text-indigo-600 font-semibold text-right">See all</Text>
        </TouchableOpacity>
      </View>

      {/* Listings Section */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800">Listings</Text>
        <View className="mt-2 flex-row flex-wrap justify-between">
          {['New Listing', 'New Apartment', 'New House', 'Sold House'].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] bg-indigo-200 p-4 rounded-lg items-center mt-2"
            >
              <Text className="text-indigo-900 font-semibold">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
