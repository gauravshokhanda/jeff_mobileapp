import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Platform } from "react-native";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../../config/apiConfig";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";


const ContractorScreen = () => {
    const token = useSelector((state) => state.auth.token);
    const [contractors, setContractors] = useState([]);

    useEffect(() => {
        const fetchContractors = async () => {
            try {
                const response = await API.get("contractors/listing", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formattedData = response.data.data.map((item) => ({
                    id: item.id.toString(),
                    image: { uri: `${baseUrl}${item.image}` },
                    name: item.name,
                    email: item.email,
                    contactNumber: item.company_registered_number,
                    company: item.company_name,
                    address: item.company_address,
                    description: item.description,
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
        <View className="bg-white shadow-lg rounded-2xl p-4 mb-4">
            <View className="flex-row items-center bg-gray-200 rounded-full">
                <Image
                    source={item.image}
                    className="w-20 h-20 rounded-full border-2 border-sky-900"
                    resizeMode="cover"
                />
                <View className="ml-12 flex-1">
                    <Text className="text-xl font-semibold text-sky-950">{item.name}</Text>
                    <Text className="text-gray-600">{item.company}</Text>
                </View>
            </View>

            <View className="mt-3 border-t border-gray-200 pt-3">
                <View className="flex-row">
                    <Text className="font-semibold text-sky-950 text-lg">Email : </Text>
                    <Text className="text-gray-600 pt-1">{item.email}</Text>
                </View>
                <View className="flex-row">
                    <Text className="font-semibold text-sky-950 text-lg">phone : </Text>
                    <Text className="text-gray-600 pt-1">{item.contactNumber}</Text>
                </View>
                <View className="flex-row">
                    <Text className="font-semibold text-sky-950 text-lg">address : </Text>
                    <Text className="text-gray-600 pt-1">{item.address}</Text>
                </View>

                <Text className="text-gray-700 mt-1 italic">{item.description}</Text>
                <View className="flex-row items-center mt-2 rounded-xl pl-3">
                    <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    <Text className="text-gray-500 text-xs p-1">{item.createdAt}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1">
            <View
                className={`flex-row justify-center items-center bg-sky-950 py-3 px-10  pb-4 ${Platform.OS === 'ios' ? 'mt-16' : ''}`}>


                {/* Search Bar */}
                <View className="flex-row items-center border border-white rounded-full px-4 mt-2 bg-white">
                    <Ionicons name="search" size={24} color="#000000" />
                    <TextInput
                        className="flex-1 ml-2 text-black"
                        placeholder="Start Search"
                        placeholderTextColor="#000000"
                    />
                    {/* Filter Icon */}
                    <Ionicons name="filter" size={24} color="#000000" className="ml-4" />
                </View>
            </View>
            <View className="flex-1 bg-gradient-to-b from-blue-100 to-gray-100 p-4">


                <FlatList
                    data={contractors}
                    renderItem={renderContractor}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

export default ContractorScreen;
