import {
  View,
  Dimensions,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect,useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../../config/apiConfig";
import { router } from "expo-router";
import moment from "moment";

export default function Index() {
  const token = useSelector((state) => state.auth.token);
  const [contractors, setContractors] = useState([]);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const [selectedTab, setSelectedTab] = useState("realEstate");
  const [realEstateList, setRealEstateList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  
  

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await API.get("contractors/listing", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedData = response.data.data.map((item) => ({
          id: item.id.toString(),
          image: { uri: `${baseUrl}${item.image}` },
          banner: { uri: `${baseUrl}${item.upload_organisation}` },
          name: item.name,
          email: item.email,
          city: item.city,
          contactNumber: item.company_registered_number,
          company: item.company_name,
          address: item.company_address,
          createdAt: moment(item.created_at).fromNow(),
        }));

        setContractors(formattedData);
      } catch (error) {
        console.error("Error fetching contractors:", error);
      }
    };

    fetchContractors();
  }, []);

  const renderContractor = ({ item }) => (
    <View className="bg-white shadow-lg rounded-2xl mb-4 overflow-hidden border">
      {/* Banner Section */}
      <View className="relative">
        <Image
          source={item.banner}
          className="w-full h-24"
          resizeMode="cover"
        />
        <View className="absolute bottom-1 left-4 flex-row items-center">
          <Image
            source={item.image}
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <View className="ml-4">
            <Text className="text-lg font-bold text-white">{item.name}</Text>
            <Text className="text-white text-sm">{item.company}</Text>
          </View>
        </View>
      </View>

      {/* Contact Details */}
      <View className="p-4">
        <View className="flex-row items-center mb-1">
          <Text className="font-semibold text-gray-700">Email: </Text>
          <Text className="text-gray-600">{item.email}</Text>
        </View>
        <View className="flex-row items-center mb-1">
          <Text className="font-semibold text-gray-700">Phone: </Text>
          <Text className="text-gray-600">{item.contactNumber}</Text>
        </View>
        <View className="flex-row items-center mb-1">
          <Text className="font-semibold text-gray-700">City: </Text>
          <Text className="text-gray-600">{item.city}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Text className="font-semibold text-gray-700">Address: </Text>
          <Text className="text-gray-600">{item.address}</Text>
        </View>
      </View>

      {/* Contact Icons */}
      <View className="flex-row justify-between gap-2 items-center px-4 pb-4">
        <TouchableOpacity className="bg-sky-950 p-2 rounded-lg"
          onPress={() => router.push(`ContractorProfile/?id=${item.id}`)}
        >
          <Text className="text-white">Visit Profile</Text>
        </TouchableOpacity>
        <View className="gap-5 flex-row">
          <TouchableOpacity
            onPress={() => router.push(`/ChatScreen?id=${item.id}`)}
          >
            <Ionicons name="mail-outline" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/ChatScreen?id=${item.id}`)}
          >
            <Ionicons name="call-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  
  useEffect(() => {
    const fetchRealEstateProperties = async (page = 1) => {
      try {
        const response = await API.get(`get-property/type?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        // Check if response and properties exist
        if (!response.data || !response.data.properties || !response.data.properties.data) {
          console.error("Invalid API response:", response.data);
          return;
        }
    
        // Extracting correct data
        const { data, last_page } = response.data.properties;
    
        // Ensure data is an array before mapping
        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }
    
        const formattedProperties = data.map((item) => ({
          
          id: item.id?.toString() || "N/A",
          user_id: item.user_id?.toString() || "N/A", 
          property_type: item.property_type || "Unknown",
          city: item.city || "Unknown",
          house_type: item.house_type || "Unknown",
          address: item.address || "Unknown",
          locality: item.locale || "Unknown",
          bhk: item.bhk || "N/A",
          area: item.area ? `${item.area} sqft` : "N/A",
          furnish_type: item.furnish_type || "N/A",
          price: item.price ? `₹${item.price}/month` : "N/A",
          available_from: item.available_from
            ? moment(item.available_from).format("MMMM D, YYYY")
            : "N/A",
        }));
    
        setRealEstateList(formattedProperties);
        setTotalPages(last_page || 1);
      } catch (error) {
        console.error("Error fetching real estate properties:", error);
      }
    };
    
    

    fetchRealEstateProperties();
  }, [token]);




  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient colors={["#082f49", "transparent"]} style={{ height: screenHeight * 0.4 }}>
        <View className="mt-8 px-4">
          <Text className="text-2xl font-semibold text-white">Properties & Contractors</Text>
        </View>
        <View className="mx-5 mt-5 items-end">
          <View className="bg-gray-100 h-12 mr-5 rounded-full px-3 flex-row items-center justify-between">
            <Ionicons name="search" size={18} color="black" />
            <TextInput placeholder="Search" placeholderTextColor={"gray"} style={{ fontSize: 14 }} className="flex-1 ml-5 text-lg" />
            <Ionicons name="filter-sharp" size={26} color="black" />
          </View>
        </View>
      </LinearGradient>

      <View
        className="rounded-3xl"
        style={{
          position: "absolute",
          top: screenHeight * 0.2,
          width: postContentWidth,
          height: screenHeight * 0.75,
          left: (screenWidth - postContentWidth) / 2,
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View className="flex-row justify-around mb-4">
            <TouchableOpacity onPress={() => setSelectedTab("realEstate")}
              className={`px-4 py-2 rounded-xl ${selectedTab === "realEstate" ? "bg-sky-950" : "bg-gray-300"}`}>
              <Text className={selectedTab === "realEstate" ? "text-white" : "text-black"}>Real Estate Property</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab("contractors")}
              className={`px-4 py-2 rounded-xl ${selectedTab === "contractors" ? "bg-sky-950" : "bg-gray-300"}`}>
              <Text className={selectedTab === "contractors" ? "text-white" : "text-black"}>Contractors</Text>
            </TouchableOpacity>
          </View>

          {selectedTab === "realEstate" ? (
            <FlatList
              data={realEstateList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="p-3 bg-gray-100 rounded-lg mb-2">
                  <Text className="text-lg font-semibold">{item.property_type}</Text>
                  <Text className="text-sm text-gray-600">{item.city}, {item.house_type}</Text>
                  <Text className="text-sm">Address: {item.address}</Text>
                  <Text className="text-sm">Locality: {item.locality}</Text>
                  <Text className="text-sm">BHK: {item.bhk}</Text>
                  <Text className="text-sm">Area: {item.area}</Text>
                  <Text className="text-sm">Furnish Type: {item.furnish_type}</Text>
                  <Text className="text-sm">Price: {item.price}</Text>
                  <Text className="text-sm">Available From: {item.available_from}</Text>

                  <View className="flex-row w-full justify-between mt-2">
                  <TouchableOpacity className="bg-sky-950 py-2 px-4  rounded-lg"><Text className="text-white">View Profile</Text></TouchableOpacity>
                  <TouchableOpacity className="bg-sky-950 py-2 px-4 rounded-lg"   onPress={() => router.push(`/ChatScreen?user_id=${item.user_id}&id=${item.id}`)} ><Text className="text-white">Chat</Text></TouchableOpacity>
                  </View>
                </View>
              )}
            />
          ) : (
            <FlatList
            data={contractors}
            renderItem={renderContractor}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 10 }}
          />
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}