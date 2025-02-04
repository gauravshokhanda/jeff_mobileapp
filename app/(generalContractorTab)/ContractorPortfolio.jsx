import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function CompanyProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView className="bg-white flex-1">
      {/* Header Section */}
      <View className="relative">
        <Image
          source={{ uri: "https://via.placeholder.com/400" }} // Replace with actual image
          className="w-full h-40"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
        >
          <Text className="text-lg">←</Text>
        </TouchableOpacity>
        <View className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-1 rounded">
          <Text className="text-white font-bold">Sky Team Constructions</Text>
        </View>
      </View>

      {/* Profile Section */}
      <View className="flex-row items-center p-4">
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          className="w-16 h-16 rounded-full border-4 border-yellow-500"
        />
        <View className="ml-4">
          <Text className="text-lg font-semibold">Name - SkyTeam</Text>
          <Text className="text-gray-600">Company Name - SkyTeam Constructions</Text>
        </View>
      </View>

      {/* Recent Featured Section */}
      <Text className="text-lg font-semibold px-4">Recent Featured</Text>
      <ScrollView horizontal className="px-4 py-2">
        {[1, 2, 3].map((item, index) => (
          <View key={index} className="mr-2">
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              className="w-24 h-24 rounded-lg"
            />
            <Text className="text-xs mt-1 text-center font-semibold">Daniel</Text>
            <View className="absolute bottom-1 left-1 bg-green-500 px-1 rounded">
              <Text className="text-white text-xs">Add Unit</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Portfolio Section */}
      <Text className="text-lg font-semibold px-4">Portfolio</Text>
      <View className="flex-row px-4 py-2">
        {[1, 2, 3].map((_, index) => (
          <View key={index} className="w-24 h-24 bg-gray-300 rounded-lg mr-2" />
        ))}
      </View>
    </ScrollView>
  );
}
