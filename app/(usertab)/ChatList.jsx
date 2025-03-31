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
import { useSelector } from "react-redux";

const ChatListScreen = () => {
  const { width: screenWidth } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const API_URL = "https://g32.iamdeveloper.in/api/recent-chats";
  const BASE_URL = "https://g32.iamdeveloper.in/";

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const formattedChats = data.users.map(user => ({
          id: user.id.toString(),
          name: user.name,
          lastMessage: "Start a conversation",
          image: user.image
            ? `${BASE_URL}${user.image}`
            : `${BASE_URL}images/default-profile.jpg`,
          email: user.email,
        }));
        setChats(formattedChats);
      } else {
        throw new Error("Failed to load chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error.message);
      setError("Error fetching chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChats();
    } else {
      setError("Please log in to view chats");
      setLoading(false);
    }
  }, [token]);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/ChatScreen",
          params: { user_id: item.id, name: item.name, image: item.image }
        })
      }
      className="flex-row items-center p-4 bg-white rounded-xl mb-3 border border-gray-100"
    >
      <Image
        source={{ uri: item.image }}
        defaultSource={{ uri: `${BASE_URL}images/default-profile.jpg` }}
        className="w-14 h-14 rounded-full mr-4"
        resizeMode="cover"
        onError={() => console.log(`Failed to load image for ${item.name}`)}
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#0369a1" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-sky-950 text-lg font-medium">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <Text className="text-red-500 text-lg font-medium">{error}</Text>
        <TouchableOpacity
          onPress={fetchChats}
          className="mt-6 bg-sky-900 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={["#082f49", "#0c4a6e"]} className="pt-12 pb-6">
        <View className="px-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 bg-white rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="#0369a1" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1 text-center">
            Messages
          </Text>
          <View className="w-10" />
        </View>

        <View className="px-4 mt-4">
          <View className="bg-white p-3 rounded-xl flex-row items-center">
            <Ionicons name="search" size={20} color="#0369a1" />
            <TextInput
              placeholder="Search Messages"
              placeholderTextColor="#64748b"
              className="flex-1 ml-3 text-base text-gray-800"
            />
            <Ionicons name="filter-sharp" size={20} color="#0369a1" />
          </View>
        </View>
      </LinearGradient>

      <View
        className="flex-1 px-4 pt-4"
        style={{
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