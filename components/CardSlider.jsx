import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../config/apiConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";


const CardSlider = () => {
  const token = useSelector((state) => state.auth.token);
  const navigation = useNavigation();
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getContractors = async () => {
      setLoading(true)
      try {
        const response = await API.get("contractors/listing", {
          headers: { Authorization: `Bearer ${token}` },
        });


        const formattedData = response.data.data.map((item) => ({
          id: item.id.toString(),
          image: { uri: `${baseUrl}${item.image}` },
          name: item.name,
          title: item.company_name,
          description: item.description,
          profileLink: `${baseUrl}${item.upload_organisation}`,
          contact: item.company_registered_number || "Not Available",
        }));

        setContractors(formattedData);
      } catch (error) {
        console.log("Error fetching contractors:", error);
      } finally {
        setLoading(false);
      }
    };

    getContractors();
  }, []);

  const handleVisitProfile = (id) => {
    // Alert.alert("Visit Profile", `Redirecting to: ${profileLink}`);
    router.push(`/ContractorProfile?id=${id}`)
  };

  const handleCall = (phone) => {
    Alert.alert("Calling", `Dialing: ${phone}`);
  };

  const renderCard = ({ item }) => (
    <View className="bg-gray-200 rounded-xl p-4 mx-2 w-44 items-center"
      style={{
        elevation: 5,
        shadowColor: "#082f49",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }}>

      <Image source={item.image} className="w-20 h-20 rounded-full mb-3" resizeMode="cover" />
      <Text className="text-lg font-semibold text-gray-900 text-center" numberOfLines={1}>
        {item.name}
      </Text>
      <Text className="text-sm text-gray-500 text-center" numberOfLines={1}>
        {item.title}
      </Text>
      <Text className="text-xs text-gray-600 text-center mt-1 mb-3" numberOfLines={2}>
        {item.description}
      </Text>
      <View className="flex-row space-x-2">
        <TouchableOpacity className="bg-blue-600 rounded-md px-2 bg-sky-950 justify-center" onPress={() => handleVisitProfile(item.id)}>
          <Text className="text-white text-xs font-medium">Visit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-green-600 rounded-md px-3 py-2 bg-sky-950 justify-center ml-1" onPress={() => handleCall(item.contact)}>
          <Text className="text-white text-xs font-medium">Call Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="py-3">
      {loading ? (
        <ActivityIndicator size="large" color="#000" className="mt-10" />
      ) : (
        <View>
          <FlatList
            data={contractors}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

           <View className="flex-row justify-center mt-5">
                   <TouchableOpacity
                     onPress={() => router.push('ContractorLists')} // Adjust route name as needed
                     className="bg-sky-950 rounded-full py-3 px-8 items-center"
                   >
                     <Text className="text-white font-bold">View All Contractors</Text>
                   </TouchableOpacity>
                 </View>
        </View>



      )}

    </View>
  );
};

export default CardSlider;

