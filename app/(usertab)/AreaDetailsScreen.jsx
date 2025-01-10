import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router"

export default function AreaDetailsScreen() {
    const placeHolderImage = require('../../assets/images/Mapscreen/areaDetailBanner.png');
    const { area } = useSelector((state) => state.polygon);
    const fadeAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

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
                        onPress={() => router.push('/CostDetail')}
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
