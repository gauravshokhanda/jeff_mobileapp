import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { API, baseUrl } from "../config/apiConfig";
import { ref, onValue, push, set, serverTimestamp } from "firebase/database";
import { database } from "../app/lib/firebaseConfig";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const POST_CONTENT_WIDTH = SCREEN_WIDTH * 0.92;

const ChatScreen = () => {
  const { user_id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const router = useRouter();

  // Fetch recipient user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`users/listing/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
      } catch (error) {
        setStatusMessage({
          type: "error",
          message:
            "Failed to fetch user details: " +
            (error.response?.data?.message || error.message),
        });
      }
    };

    if (user_id) fetchUser();
  }, [user_id, token]);

  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        await API.post(
          "mark-messages-as-read",
          { sender_id: user_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to mark messages as read:", error.message);
      }
    };

    if (user_id && token) {
      markMessagesAsRead();
    }
  }, [user_id, token]);

  // Real-time messages from Firebase
  useEffect(() => {
    if (!user_id || !currentUserId) return;

    setIsLoading(true);
    const chatRoomId = [currentUserId, user_id].sort().join("_");
    const messagesRef = ref(database, `chats/${chatRoomId}`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        setIsLoading(false);
        const data = snapshot.val();
        if (data) {
          const messagesArray = Object.entries(data).map(([id, msg]) => ({
            id,
            text: msg.text,
            sender: msg.senderId === currentUserId ? "me" : "other",
            seen: msg.seen || false,
            timestamp: msg.timestamp,
          }));
          setMessages(
            messagesArray.sort((a, b) => a.timestamp - b.timestamp).reverse()
          );
        } else {
          setMessages([]);
        }
      },
      (error) => {
        setIsLoading(false);
        setStatusMessage({
          type: "error",
          message: "Failed to fetch messages: " + error.message,
        });
      }
    );

    return () => unsubscribe();
  }, [user_id, currentUserId]);

  // Send message
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const messageToSend = inputText; // preserve current input
  setInputText(""); // clear input immediately


    const newMessage = {
      text: inputText,
      senderId: currentUserId,
      timestamp: serverTimestamp(),
      seen: false,
    };

    try {
      const chatRoomId = [currentUserId, user_id].sort().join("_");
      const messagesRef = ref(database, `chats/${chatRoomId}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, newMessage);

      await API.post(
        "send-message",
        { message: inputText, receiver_id: user_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
      setStatusMessage({
        type: "error",
        message: `Failed to send message: ${
          error.response?.data?.message || error.message
        }`,
      });
    }
  };

  // Render message bubble (no images)
  const renderMessage = ({ item }) => (
    <View
      className={`mx-3 my-2 max-w-[80%] ${
        item.sender === "me" ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <View
        className={`p-3 rounded-xl ${
          item.sender === "me" ? "bg-sky-950" : "bg-gray-100"
        }`}
      >
        <Text
          className={`text-base ${
            item.sender === "me" ? "text-white" : "text-gray-900"
          }`}
          style={{ flexWrap: "wrap" }}
        >
          {item.text}
        </Text>
      </View>
      {item.sender === "me" && (
        <Ionicons
          name="checkmark-done"
          size={14}
          color={item.seen ? "gray" : "lightgray"}
          style={{ marginTop: 2 }}
        />
      )}
    </View>
  );

  const renderStatusMessage = () => {
    if (!statusMessage.message) return null;

    const statusStyles = {
      success: "bg-green-100 border-green-500 text-green-700",
      error: "bg-red-100 border-red-500 text-red-700",
      info: "bg-blue-100 border-blue-500 text-blue-700",
    };

    return (
      <View
        className={`p-3 mx-3 my-2 rounded-lg border ${
          statusStyles[statusMessage.type]
        }`}
      >
        <Text>{statusMessage.message}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: SCREEN_HEIGHT * 0.4 }}
      >
        <View className="flex-row mt-5 items-center p-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          {user ? (
            <>
              {user.image ? (
                <Image
                  source={{ uri: `${baseUrl}${user.image}` }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-white mr-3 items-center justify-center">
                  <Text className="text-sky-900 text-lg font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
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
                contentContainerStyle={{
                  paddingVertical: 10,
                  flexGrow: 1,
                  justifyContent:
                    messages.length === 0 ? "center" : "flex-start",
                  alignItems: messages.length === 0 ? "center" : "stretch",
                }}
                ListEmptyComponent={
                  <Text className="text-gray-400 text-base">
                    No messages yet
                  </Text>
                }
              />
            </>
          )}

          {/* Input bar */}
          <View className="flex-row items-end p-4 bg-white border-t border-gray-300">
            <TouchableOpacity className="mr-2">
              <Entypo name="emoji-happy" size={28} color="gray" />
            </TouchableOpacity>

            <View className="flex-1 bg-gray-200 rounded-2xl px-3 py-2 max-h-32">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                multiline
                className="text-gray-900 text-base"
                style={{ maxHeight: 100 }}
              />
            </View>

            <TouchableOpacity
              onPress={sendMessage}
              className="ml-3 bg-sky-950 p-3 rounded-full"
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
