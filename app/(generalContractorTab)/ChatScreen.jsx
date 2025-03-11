import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, SafeAreaView, Dimensions } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

const ChatScreen = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const { user_id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey, how are you?", sender: "other" },
    { id: "2", text: "I'm good! What about you?", sender: "me" },
    { id: "3", text: "Same here, just working on some projects.", sender: "other" },
  ]);
  const [inputText, setInputText] = useState("");
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://g32.iamdeveloper.in/api/users/listing/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.response?.data || error.message);
      }
    };

    if (user_id) {
      fetchUser();
    }
  }, [user_id]);

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    setMessages([{ id: Date.now().toString(), text: inputText, sender: "me" }, ...messages]);
    setInputText("");
  };

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
          {user ? (
            <>
              <Image source={{ uri: user.profile_photo || "https://via.placeholder.com/50" }} className="w-10 h-10 rounded-full mr-3" />
              <Text className="text-white text-lg font-bold">{user.name}</Text>
            </>
          ) : (
            <Text className="text-white text-lg font-bold">Loading...</Text>
          )}
        </View>
      </LinearGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20} // Adjust this value based on your header height
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
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            inverted // Messages start from bottom
            renderItem={({ item }) => (
              <View className={`flex-row items-end mx-3 my-2 ${item.sender === "me" ? "self-end flex-row-reverse" : "self-start"}`}>
                <Image
                  source={{ uri: item.sender === "me" ? "https://randomuser.me/api/portraits/men/2.jpg" : user?.profile_photo || "https://via.placeholder.com/50" }}
                  className="w-8 h-8 rounded-full mx-2"
                />
                <View className={`p-3 max-w-[75%] rounded-lg ${item.sender === "me" ? "bg-sky-950" : "bg-white border border-gray-300"}`}>
                  <Text className={`${item.sender === "me" ? "text-white" : "text-gray-900"} text-lg`}>{item.text}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
          />


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