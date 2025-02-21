import { View, Dimensions, Text, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
export default function RealStateChatList() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;

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
    <SafeAreaView className="flex-1 bg-gray-200">

      <LinearGradient
        colors={['#082f49', 'transparent']}
        style={{ height: screenHeight * 0.4 }}
      >
        <View className="mt-8 px-4  items-center justify-center">
          <Text className="text-3xl font-bold text-white">Chats</Text>
        </View>


      </LinearGradient>


      <View className="rounded-3xl"
        style={{
          position: 'absolute',
          top: screenHeight * 0.12,
          width: postContentWidth,
          height: screenHeight * 0.85,
          left: (screenWidth - postContentWidth) / 2,
          backgroundColor: 'white',
          borderRadius: 25,
        }}
      >
        <View className="flex-1">
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push("ChatScreen", { name: item.name, image: item.image })}
                className="flex-row items-center p-4 border-b border-gray-300 "
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
      </View>
    </SafeAreaView >
  );
}