import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image ,Platform} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const ChatListScreen = ({ navigation }) => {
  const router = useRouter();
  const [chats, setChats] = useState([
    { id: "1", name: "John Doe", lastMessage: "Hey, how are you?", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "2", name: "Alice Smith", lastMessage: "See you tomorrow!", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: "3", name: "Michael Johnson", lastMessage: "Can we reschedule?", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: "4", name: "John Doe", lastMessage: "Hey, how are you?", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "5", name: "Alice Smith", lastMessage: "See you tomorrow!", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: "6", name: "Michael Johnson", lastMessage: "Can we reschedule?", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: "7", name: "John Doe", lastMessage: "Hey, how are you?", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "8", name: "Alice Smith", lastMessage: "See you tomorrow!", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: "9", name: "Michael Johnson", lastMessage: "Can we reschedule?", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: "10", name: "John Doe", lastMessage: "Hey, how are you?", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "11", name: "Alice Smith", lastMessage: "See you tomorrow!", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: "12", name: "Michael Johnson", lastMessage: "Can we reschedule?", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  ]);

  return (
    <View className="flex-1 bg-gray-100">
      
      <View className={`bg-sky-950 p-4 flex-row items-center ${Platform.OS === 'ios' ? 'mt-10' : ''}`}>
        <Text className="text-white text-2xl font-bold">Chats</Text>
      </View>

     
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push("ChatScreen", { name: item.name, image: item.image })}
            className="flex-row items-center p-4 border-b border-gray-300 bg-white"
          >
            <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
              <Text className="text-gray-500">{item.lastMessage}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatListScreen;
