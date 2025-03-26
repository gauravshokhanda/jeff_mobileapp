import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { API } from "../../config/apiConfig";
import { useSelector } from "react-redux";

const ChatListScreen = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const router = useRouter();
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get token from Redux store
  const token = useSelector((state) => state.auth.token);

  // Fetch chats from API
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await API.get("/recent-chats", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          const formattedChats = data.users.map(user => ({
            id: user.id.toString(),
            name: user.name,
            lastMessage: "Start a conversation",
            image: user.image.startsWith('http') 
              ? user.image 
              : `https://g32.iamdeveloper.in/${user.image}`,
            email: user.email
          }));
          setChats(formattedChats);
        } else {
          setError("Failed to load chats");
        }
      }
    } catch (error) {
      console.error(
        "Error fetching chats:",
        error.response?.data || error.message
      );
      setError("Error fetching chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChats();
    }
  }, [token]);

  // Render chat item
  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push(`/ChatScreen?user_id=${item.id}&name=${item.name}&image=${item.image}`)
      }
      className="flex-row items-center p-4 bg-white rounded-lg shadow-md mb-3"
    >
      <Image
        source={{ uri: item.image }}
        className="w-12 h-12 rounded-full mr-3"
        onError={() => console.log(`Failed to load image for ${item.name}`)}
      />
      <View className="flex-1">
        <Text className="text-lg font-bold text-sky-950">{item.name}</Text>
        <Text className="text-gray-700 mt-1">{item.lastMessage}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#0284c7" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-sky-950 text-lg">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity 
          onPress={fetchChats} 
          className="mt-4 bg-sky-950 p-3 rounded-lg"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.3 }}
      >
        <View className="p-4 flex-row items-center justify-center mt-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 p-2 bg-white rounded-full shadow-md"
          >
            <Ionicons name="arrow-back" size={24} color="#0284c7" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Chats</Text>
        </View>

        <View className="mx-5 mt-5 items-center">
          <View className="bg-white p-3 w-full rounded-lg flex-row items-center shadow-md">
            <Ionicons name="search" size={20} color="#0284c7" />
            <TextInput
              placeholder="Search Chats"
              placeholderTextColor="#64748b"
              className="flex-1 ml-3 text-lg text-sky-950"
            />
            <Ionicons name="filter-sharp" size={24} color="#0284c7" />
          </View>
        </View>
      </LinearGradient>

      <View
        className="flex-1 bg-white px-4"
        style={{
          marginTop: -screenHeight * 0.15,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
        }}
      >
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatListScreen;