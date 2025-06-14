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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { API, baseUrl } from "../config/apiConfig";
import { ref, onValue, push, set, serverTimestamp } from "firebase/database";
import { database } from "../app/lib/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import ImageViewing from "react-native-image-viewing";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const POST_CONTENT_WIDTH = SCREEN_WIDTH * 0.92;

const ChatScreen = () => {
  const { user_id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isImageViewVisible, setImageViewVisible] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const router = useRouter();

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

  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        await API.post(
          "mark-messages-as-read",
          { sender_id: user_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log("Failed to mark messages as read:", error.message);
      }
    };

    if (user_id && token) {
      markMessagesAsRead();
    }
  }, [user_id, token]);

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
            image: msg.image || null,
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

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const imageUri = selectedImage;
    setInputText("");
    setSelectedImage(null);

    const chatRoomId = [currentUserId, user_id].sort().join("_");

    const formData = new FormData();
    formData.append("message", inputText);
    formData.append("receiver_id", user_id);

    if (imageUri) {
      const filename = imageUri.split("/").pop();
      const fileType = filename.split(".").pop();

      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await API.post("/send-message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Send message failed");
      }

      const imageUrl = response.data.data?.file_path || null;

      const newMessage = {
        text: inputText,
        senderId: currentUserId,
        timestamp: serverTimestamp(),
        seen: false,
        image: imageUrl,
      };

      const messagesRef = ref(database, `chats/${chatRoomId}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, newMessage);
    } catch (error) {
      console.log("Error sending message:", error);
      setStatusMessage({
        type: "error",
        message: "Failed to send message: " + error.message,
      });
    }
  };

  const pickImageAndSend = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri); // Preview only
      }
    } catch (err) {
      console.log("Image selection failed:", err);
      setStatusMessage({
        type: "error",
        message: "Image selection failed: " + err.message,
      });
    }
  };

  const renderMessage = ({ item }) => (
    <View
      className={`mx-3 my-2 max-w-[80%] ${item.sender === "me" ? "self-end items-end" : "self-start items-start"
        }`}
    >
      <View
        className={`p-3 rounded-xl ${item.sender === "me" ? "bg-sky-950" : "bg-gray-100"
          }`}
      >
        {item.image && (
          <TouchableOpacity
            onPress={() => {
              setFullScreenImage([{ uri: item.image }]);
              setImageViewVisible(true);
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginBottom: 5,
                backgroundColor: "#f3f4f6",
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {!!item.text && (
          <Text
            className={`text-base ${item.sender === "me" ? "text-white" : "text-gray-900"
              }`}
            style={{ flexWrap: "wrap" }}
          >
            {item.text}
          </Text>
        )}
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
        className={`p-3 mx-3 my-2 rounded-lg border ${statusStyles[statusMessage.type]
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
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-1">{user.name}</Text>
                {user.premium === 1 && (
                  <Ionicons name="checkmark-circle" size={18} color="#e0f2fe" />
                )}
              </View>
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

          {selectedImage && (
            <View className="px-4">
              <View className="relative w-24 h-24 mb-2">
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 96, height: 96, borderRadius: 8 }}
                />
                <TouchableOpacity
                  onPress={() => setSelectedImage(null)}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: "white",
                    borderRadius: 12,
                    padding: 2,
                  }}
                >
                  <Ionicons name="close" size={16} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="flex-row items-end p-4 bg-white border-t border-gray-300">
            <TouchableOpacity className="mr-2" onPress={pickImageAndSend}>
              <Ionicons name="image-outline" size={28} color="gray" />
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

      {/* Fullscreen Image Viewer */}
      <ImageViewing
        images={fullScreenImage || []}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
