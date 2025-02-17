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
} from "react-native";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatScreen = () => {
  const { user_id, id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [draftAttachment, setDraftAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user_id || !id) return;

        setLoading(true);

        // Fetch user details
        const userResponse = await axios.get(
          `https://g32.iamdeveloper.in/api/users/listing/${user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.status === 200) {
          setUser(userResponse.data.data);
        }

        // Fetch property details
        const propertyResponse = await axios.get(
          `https://g32.iamdeveloper.in/api/realstate-property/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (propertyResponse.status === 200) {
          console.log("API working");
          console.log(propertyResponse.data);

          const propertyData = propertyResponse.data.property;

          setProperty(propertyData);

          // Prepare a draft attachment for sending
          setDraftAttachment({
            id: propertyData.id,
            title: `${propertyData.bhk} in ${propertyData.city}`,
            image: "https://via.placeholder.com/200", // Replace with actual image field if available
            price: `₹${propertyData.price}`,
            address: propertyData.address,
          });
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (user_id && id) {
      fetchData();
    }
  }, [user_id, id]);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      attachment: draftAttachment, // Include property attachment if available
    };

    setMessages([newMessage, ...messages]);
    setInputText("");

    // Clear the draft attachment after sending
    setDraftAttachment(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      {/* Header */}
      <View className="bg-sky-950 mt-12 flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : user ? (
          <>
            <Image
              source={{
                uri: user.profile_photo || "https://via.placeholder.com/50",
              }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <Text className="text-white text-lg font-bold">{user.name}</Text>
          </>
        ) : (
          <Text className="text-white text-lg font-bold">User Not Found</Text>
        )}
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        renderItem={({ item }) => (
          <View
            className={`flex-row items-end mx-3 my-2 ${
              item.sender === "me" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            <Image
              source={{
                uri:
                  item.sender === "me"
                    ? "https://randomuser.me/api/portraits/men/2.jpg"
                    : user?.profile_photo || "https://via.placeholder.com/50",
              }}
              className="w-8 h-8 rounded-full mx-1"
            />
            <View
              className={`p-3 w-[80%] rounded-lg ${
                item.sender === "me"
                  ? "bg-sky-950 self-end"
                  : "bg-white border border-gray-300 self-start"
              }`}
            >
              <Text
                className={`${
                  item.sender === "me" ? "text-white" : "text-gray-900"
                } text-lg`}
              >
                {item.text}
              </Text>

              {/* Sent Property Attachment */}
              {item.attachment && (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/RealEstateDetails?id=${item.attachment.id}`)
                  }
                  className="mt-2 bg-gray-200 p-2 rounded-lg"
                >
                  <Text className="text-gray-900 text-center font-semibold">
                    {item.attachment.title}
                  </Text>
                  <Text className="text-gray-600 text-center">
                    {item.attachment.address}
                  </Text>
                  <Text className="text-green-600 text-center font-bold">
                    {item.attachment.price}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Draft Property Attachment (Bottom, Above Input) */}
      {draftAttachment && (
        <View className="flex-row items-center bg-white p-3 border-t border-gray-300">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold">
              {draftAttachment.title}
            </Text>
            <Text className="text-gray-600">{draftAttachment.address}</Text>
            <Text className="text-green-600 font-bold">
              {draftAttachment.price}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setDraftAttachment(null)}
            className="ml-2"
          >
            <AntDesign name="closecircle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}

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
        <TouchableOpacity
          onPress={sendMessage}
          className="ml-3 bg-sky-950 p-3 rounded-full"
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
