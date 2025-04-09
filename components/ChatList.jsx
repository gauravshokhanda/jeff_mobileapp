import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../config/apiConfig";
import { useFocusEffect } from "@react-navigation/native"; // ✅ NEW IMPORT

const { width: screenWidth } = Dimensions.get("window");
const postContentWidth = screenWidth * 0.92;

const ChatListScreen = () => {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await API.get("recent-chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        const formattedChats = data.users.map((user) => ({
          id: user.id.toString(),
          name: user.name,
          lastMessage: "Start a conversation",
          image: user.image ? `${baseUrl}${user.image}` : null,
          email: user.email,
          unreadCount: user.message_unread_count,
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

  // ✅ Fetch chats every time screen is focused
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchChats();
      } else {
        setError("Please log in to view chats");
        setLoading(false);
      }
    }, [token])
  );

  const renderChatItem = ({ item }) => {
    const firstLetter = item.name?.charAt(0)?.toUpperCase() || "?";

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/ChatScreen",
            params: { user_id: item.id, name: item.name, image: item.image },
          })
        }
        className="flex-row items-center p-4 bg-white rounded-2xl mb-3 border border-gray-200"
        style={styles.shadow}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="w-14 h-14 rounded-full mr-4"
            resizeMode="cover"
          />
        ) : (
          <View className="w-14 h-14 rounded-full bg-sky-900 mr-4 justify-center items-center">
            <Text className="text-white text-lg font-bold">{firstLetter}</Text>
          </View>
        )}

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-800">
              {item.name}
            </Text>
            {item.unreadCount > 0 && (
              <View className="bg-sky-950 p-2 rounded-full">
                <Text className="text-white text-xs font-bold">
                  {item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#0369a1" />
      </TouchableOpacity>
    );
  };

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
        <Text className="text-red-500 text-lg font-medium text-center">
          {error}
        </Text>
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
      <LinearGradient
        colors={["#082f49", "#0c4a6e"]}
        style={styles.headerGradient}
      >
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
          <View className="bg-white px-3 py-2 rounded-xl flex-row items-center">
            <Ionicons name="search" size={20} color="#0369a1" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#64748b"
              className="flex-1 ml-3 text-base text-gray-800"
            />
            <Ionicons name="filter-sharp" size={20} color="#0369a1" />
          </View>
        </View>
      </LinearGradient>

      <View
        className="flex-1 pt-4"
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

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingBottom: 24,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ChatListScreen;
