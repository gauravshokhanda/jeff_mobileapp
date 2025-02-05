import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons"; // Entypo for emoji icon

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey, how are you?", sender: "other", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "2", text: "I'm good! What about you?", sender: "me", image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: "3", text: "Same here, just working on some projects.", sender: "other", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  ]);

  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    setMessages([{ id: Date.now().toString(), text: inputText, sender: "me", image: "https://randomuser.me/api/portraits/men/2.jpg" }, ...messages]);
    setInputText("");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-100">
      {/* Header */}
      <View className={`bg-sky-950  flex-row items-center p-4 ${Platform.OS === 'ios' ? 'mt-12' : ''}`}>
        <TouchableOpacity className="mr-3">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} className="w-10 h-10 rounded-full mr-3" />
        <Text className="text-white text-lg font-bold">John Doe</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted  // Messages start from bottom
        renderItem={({ item }) => (
          <View className={`flex-row items-end mx-3 my-2 ${item.sender === "me" ? "self-end flex-row-reverse" : "self-start"}`}>
            <Image source={{ uri: item.image }} className="w-8 h-8 rounded-full mx-2" />
            <View className={`p-3 max-w-[75%] rounded-lg ${item.sender === "me" ? "bg-sky-950" : "bg-white border border-gray-300"}`}>
              <Text className={`${item.sender === "me" ? "text-white" : "text-gray-900"} text-lg`}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Chat Input Box */}
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
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;