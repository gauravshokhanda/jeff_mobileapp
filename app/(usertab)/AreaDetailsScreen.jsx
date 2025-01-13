import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router"
import { API } from '../../config/apiConfig';

export default function AreaDetailsScreen() {
    const placeHolderImage = require('../../assets/images/Mapscreen/areaDetailBanner.png');
    const { area } = useSelector((state) => state.polygon);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const token = useSelector((state) => state.auth.token);
    const areaDeatils = useSelector((state) => state.polygon)




    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);
    const scheduleCost = async () => {
        console.log("schedule cost function");
        console.log("city:", areaDeatils.city);
        console.log("zipcode:", areaDeatils.zipCode);
        console.log("area:", areaDeatils.area);

        // Properly construct the data object
        const data = {
            city: "ADJUNTAS", // Ensure this is a string
            zip_code: areaDeatils.zipCode, // Ensure this is a string or number as per API expectations
            area: areaDeatils.area, // Ensure this is a string or number as per API expectations
            project_type: "Basic",
            square_fit: "1000"
        };

        console.log("formdata:", data);

        try {
            // Send the request with serialized JSON data
            const response = await API.post("regional_multipliers/details", JSON.stringify(data), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // Ensure proper header for JSON requests
                },
            });

            console.log("response:", response.data);

            if (response.data && response.data.data) {
                // Encode and navigate to the next route with cost details
                const scheduleCost = encodeURIComponent(JSON.stringify(response.data.data));
                router.push(`/CostDetail?CostDetails=${scheduleCost}`);
            } else {
                Alert.alert("Error", "No response data available");
            }
        } catch (error) {
            console.error("error:", error.message);
            Alert.alert("Error", "An error occurred while fetching schedule cost");
        }
    };


    return (
        <Animated.View
            className="flex-1"
            style={{
                opacity: fadeAnim,
                backgroundColor: '#F0F4F8', // Soft gradient background

            }}>
            <View>
                <TouchableOpacity
                    className="absolute top-6 z-10 left-5"
                    onPress={() => router.push("/MapScreen")}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-3xl font-semibold text-white mb-4 bg-sky-950 py-4 text-center">Your Area Details</Text>

            </View>

            <View className='p-4 flex-1'>


                <View className="items-center mb-8 pt-8">
                    <Image source={placeHolderImage} style={{ width: '100%', height: 200, borderRadius: 10 }} />
                </View>

                <View className="px-6 items-center flex-1 mt-10">
                    <Text className="text-2xl text-gray-600 mb-6 mt-5">
                        Your area is <Text className="text-3xl font-bold px-2">{area}</Text>
                        ft²
                    </Text>

                    <TouchableOpacity
                        // onPress={() => router.push('/CostDetail')}
                        onPress={scheduleCost}
                        className="bg-sky-700 px-8 py-4 rounded-full flex-row items-center justify-center"
                        style={{ elevation: 3 }}
                    >
                        <Text className="text-white text-lg font-semibold">Calculate Cost</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
}
