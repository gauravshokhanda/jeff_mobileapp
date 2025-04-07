import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, SafeAreaView, Dimensions } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { API,baseUrl } from "../config/apiConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, serverTimestamp } from "firebase/database";
import axios from "axios";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsoO7K9oSJJHXFVuIxlRowg5MZQjHYAVM",
  authDomain: "ac5d-533ea.firebaseapp.com",
  databaseURL: "https://ac5d-533ea-default-rtdb.firebaseio.com/",
  projectId: "ac5d-533ea",
  storageBucket: "ac5d-533ea.appspot.com",
  messagingSenderId: "99535253661",
  appId: "1:99535253661:web:4bd8a9ed02839a49a2a474"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const POST_CONTENT_WIDTH = SCREEN_WIDTH * 0.92;

const ChatScreen = () => {
  const { user_id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const router = useRouter();

  const chatRoomId = [currentUserId, user_id].sort().join('_');

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://g32.iamdeveloper.in/api/users/listing/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data:", response.data.data); // Debug log
        setUser(response.data.data);
      } catch (error) {
        setStatusMessage({
          type: 'error',
          message: 'Failed to fetch user details: ' + (error.response?.data?.message || error.message)
        });
      }
    };

    if (user_id) fetchUser();
  }, [user_id, token]);

  // Real-time message listener
  useEffect(() => {
    setIsLoading(true);
    const messagesRef = ref(database, `chats/${chatRoomId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      setIsLoading(false);
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, msg]) => ({
          id,
          text: msg.text,
          sender: msg.senderId === currentUserId ? "me" : "other",
          seen: msg.seen || false,
          timestamp: msg.timestamp
        }));
        setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp).reverse());
        setStatusMessage({ type: 'success', message: 'Messages loaded successfully' });
      } else {
        setMessages([]);
        setStatusMessage({ type: 'info', message: 'No messages yet' });
      }
    }, (error) => {
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        message: 'Failed to fetch messages: ' + error.message
      });
    });

    return () => unsubscribe();
  }, [chatRoomId, currentUserId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      senderId: currentUserId,
      timestamp: serverTimestamp(),
      seen: false,
    };

    try {
      // 1. Send to Firebase for real-time updates
      const messagesRef = ref(database, `chats/${chatRoomId}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, newMessage);

      // 2. Send to backend API
      const messagePayload = {
        message: inputText,
        receiver_id: user_id,
      };

      const apiResponse = await axios.post('https://g32.iamdeveloper.in/api/send-message', messagePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear input and show API response
      setInputText("");
      setStatusMessage({ 
        type: 'success', 
        message: `Message sent successfully. API Response: ${JSON.stringify(apiResponse.data)}`
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatusMessage({
        type: 'error',
        message: `Failed to send message: ${error.response?.data?.message || error.message}`
      });
    }
  };

  const renderMessage = ({ item }) => (
    <View className={`flex-row items-end mx-3 my-2 ${item.sender === "me" ? "self-end flex-row-reverse" : "self-start"}`}>
      <Image
        source={{
          uri: item.sender === "me" 
            ? "https://randomuser.me/api/portraits/men/2.jpg" 
            : user?.image ? `${baseUrl}${user.image}` : "https://via.placeholder.com/50"
        }}
        defaultSource={{ uri: "https://via.placeholder.com/50" }}
        onError={(e) => console.log("Message avatar error:", e.nativeEvent.error)}
        className="w-8 h-8 rounded-full mx-2"
      />
      <View className={`p-3 max-w-[75%] rounded-lg flex-row items-end ${item.sender === "me" ? "bg-sky-950" : "bg-white border border-gray-300"}`}>
        <Text className={`${item.sender === "me" ? "text-white" : "text-gray-900"} text-lg`}>{item.text}</Text>
        {item.sender === "me" && (
          <Ionicons 
            name="checkmark-done" 
            size={16} 
            color={item.seen ? "white" : "gray"} 
            style={{ marginLeft: 5 }}
          />
        )}
      </View>
    </View>
  );

  const renderStatusMessage = () => {
    if (!statusMessage.message) return null;

    const statusStyles = {
      success: 'bg-green-100 border-green-500 text-green-700',
      error: 'bg-red-100 border-red-500 text-red-700',
      info: 'bg-blue-100 border-blue-500 text-blue-700'
    };

    return (
      <View className={`p-3 mx-3 my-2 rounded-lg border ${statusStyles[statusMessage.type]}`}>
        <Text>{statusMessage.message}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient colors={["#082f49", "transparent"]} style={{ height: SCREEN_HEIGHT * 0.4 }}>
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          {user ? (
            <>
              <Image 
                source={{ 
                  uri: user.image ? `${baseUrl}${user.image}` : "https://via.placeholder.com/50"
                }}
                defaultSource={{ uri: "https://via.placeholder.com/50" }}
                onError={(e) => console.log("Header image error:", e.nativeEvent.error)}
                className="w-10 h-10 rounded-full mr-3"
              />
              <Text className="text-white text-lg font-bold">{user.name}</Text>
            </>
          ) : (
            <Text className="text-white text-lg font-bold">Loading...</Text>
          )}
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
        className="flex-1"
      >
        <View
          className="flex-1 rounded-3xl bg-white"
          style={{
            width: POST_CONTENT_WIDTH,
            marginHorizontal: (SCREEN_WIDTH - POST_CONTENT_WIDTH) / 2,
            marginTop: -SCREEN_HEIGHT * 0.25,
          }}
        >
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-700 text-lg">Loading messages...</Text>
            </View>
          ) : (
            <>
              {renderStatusMessage()}
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                inverted
                renderItem={renderMessage}
                contentContainerStyle={{ paddingVertical: 10 }}
              />
            </>
          )}

          <View className="flex-row items-center p-4 bg-white border-t border-gray-300">
            <TouchableOpacity className="mr-2">
              <Entypo name="emoji-happy" size={28} color="gray" />
            </TouchableOpacity>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              className="flex-1 p-3 bg-gray-200 rounded-full text-gray-900"
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} className="ml-3 bg-sky-950 p-3 rounded-full">
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;