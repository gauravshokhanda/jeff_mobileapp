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
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { API, baseUrl } from "../../config/apiConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, serverTimestamp } from "firebase/database";

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

const ChatScreen = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const { user_id, id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [draftAttachment, setDraftAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const token = useSelector((state) => state.auth.token);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const router = useRouter();

  const chatRoomId = [currentUserId, user_id].sort().join('_');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user_id) {
          const userResponse = await API.get(`users/listing/${user_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userResponse.status === 200) {
            setUser(userResponse.data.data);
          }
        }

        if (id) {
          const propertyResponse = await API.get(`realstate-property/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (propertyResponse.status === 200) {
            const propertyData = propertyResponse.data;
            setDraftAttachment({
              id: propertyData.id,
              title: `${propertyData.bhk} in ${propertyData.city}`,
              image: "https://via.placeholder.com/200",
              price: `₹${propertyData.price}`,
              address: propertyData.address,
            });
          } else {
            setDraftAttachment(null);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error.response?.data || error.message);
        setStatusMessage({
          type: 'error',
          message: 'Failed to fetch data: ' + (error.response?.data?.message || error.message)
        });
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (user_id || id) {
      fetchData();
    }
  }, [id, user_id, token]);

  // Real-time message listener
  useEffect(() => {
    setLoading(true);
    const messagesRef = ref(database, `chats/${chatRoomId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, msg]) => ({
          id,
          text: msg.text,
          sender: msg.senderId === currentUserId ? "me" : "other",
          timestamp: msg.timestamp
        }));
        setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp).reverse());
        setStatusMessage({ type: 'success', message: 'Messages loaded successfully' });
      } else {
        setMessages([]);
        setStatusMessage({ type: 'info', message: 'No messages yet' });
      }
    }, (error) => {
      setLoading(false);
      setStatusMessage({
        type: 'error',
        message: 'Failed to fetch messages: ' + error.message
      });
    });

    return () => unsubscribe();
  }, [chatRoomId, currentUserId]);

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      text: inputText,
      senderId: currentUserId,
      timestamp: serverTimestamp(),
    };

    try {
      const messagesRef = ref(database, `chats/${chatRoomId}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, newMessage);
      setInputText("");
      setStatusMessage({ type: 'success', message: 'Message sent successfully' });
      // Note: draftAttachment is not sent to Firebase, kept local
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: 'Failed to send message: ' + error.message
      });
    }
  };

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

  const renderMessage = ({ item }) => (
    <View
      className={`flex-row items-end mx-3 my-2 ${item.sender === "me" ? "self-end flex-row-reverse" : "self-start"}`}
    >
      <Image
        source={{
          uri: item.sender === "me"
            ? "https://randomuser.me/api/portraits/men/2.jpg"
            : user?.profile_photo || "https://via.placeholder.com/50",
        }}
        className="w-8 h-8 rounded-full mx-1"
      />
      <View
        className={`p-3 rounded-lg ${item.sender === "me" ? "bg-sky-950 self-end" : "bg-white border border-gray-300 self-start"}`}
      >
        <Text
          className={`${item.sender === "me" ? "text-white" : "text-gray-900"} text-lg`}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.4 }}
      >
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : user ? (
            <>
              <Image
                source={{
                  uri: baseUrl + user.image || "https://via.placeholder.com/50",
                }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <Text className="text-white text-lg font-bold">{user.name}</Text>
            </>
          ) : (
            <Text className="text-white text-lg font-bold">User Not Found</Text>
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
            width: postContentWidth,
            marginHorizontal: (screenWidth - postContentWidth) / 2,
            marginTop: -screenHeight * 0.25,
          }}
        >
          {loading ? (
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

          {draftAttachment && (
            <View className="flex-row items-center bg-white p-3 border-t border-gray-300">
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">{draftAttachment.title}</Text>
                <Text className="text-gray-600">{draftAttachment.address}</Text>
                <Text className="text-green-600 font-bold">{draftAttachment.price}</Text>
              </View>
              <TouchableOpacity onPress={() => setDraftAttachment(null)} className="ml-2">
                <AntDesign name="closecircle" size={24} color="red" />
              </TouchableOpacity>
            </View>
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
            />
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