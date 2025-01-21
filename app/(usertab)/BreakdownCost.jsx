import { View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Circle } from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setBreakdownCost } from '../../redux/slice/breakdownCostSlice';

export default function BreakdownCost() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { breakdownCost, screenName } = useLocalSearchParams();
    const parsedData = JSON.parse(breakdownCost);

    useEffect(() => {
        dispatch(setBreakdownCost(parsedData));
    }, [breakdownCost, dispatch])
    const { estimated_time, project_type, square_fit, data } = parsedData.days;

    const totalDays = Object.values(data).reduce((acc, day) => acc + day, 0);
    const categories = Object.entries(data);

    const categoryColors = categories.map(() =>
        `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );

    const handlePost = () => {
        // Add your post handling logic here (e.g., API call, navigation, etc.)
        console.log("Post Button Pressed");
    };

    return (
        <View className={`flex-1 bg-white ${Platform.OS === 'ios' ? 'mt-16' : ''}`}>
            {/* Header Section */}
            <View className="flex-row justify-between items-center bg-sky-900 p-5 rounded-b-2xl shadow-lg">
                <TouchableOpacity onPress={() => router.push(screenName)}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-2xl font-extrabold text-white">Cost Breakdown</Text>
                <Text className="text-lg text-white opacity-75">{project_type}</Text>
            </View>

            {/* Total Cost Section */}
            <View className={`px-6 py-4 mt-6 bg-gray-50 rounded-lg shadow-md ${Platform.OS === 'ios' ? 'mx-3' : ''}`}>
                <Text className="text-lg text-gray-600 font-semibold">Total Cost</Text>
                <Text className="text-4xl font-extrabold text-gray-800">
                    ${new Intl.NumberFormat('en-US', { style: 'decimal' }).format(parsedData.total_cost)}
                </Text>
            </View>

            {/* Total Days Section */}
            <View className={`px-6 py-4 mt-6 bg-gray-50 rounded-lg shadow-md mb-4 ${Platform.OS === 'ios' ? 'mx-3' : ''}`}>
                <Text className="text-lg text-gray-600 font-semibold">Total Days</Text>
                <Text className="text-4xl font-extrabold text-gray-800">{totalDays}</Text>
            </View>

            {/* Breakdown List Section */}
            <View className="flex-1 px-5 rounded-2xl">
                <FlashList
                    data={categories}
                    renderItem={({ item, index }) => (
                        <View
                            key={item[0]}
                            className="flex-row justify-between items-center bg-white h-28 mb-4 rounded-lg shadow-lg px-2 w-[95%]"
                            style={{ borderColor: categoryColors[index], borderWidth: 1.5, borderRadius: 5 }}
                        >
                            <Circle
                                size={50}
                                progress={item[1] / totalDays}
                                color={categoryColors[index]}
                                thickness={4}
                                showsText={true}
                                formatText={() => `${Math.round((item[1] / totalDays) * 100)}%`}
                            />
                            {/* Category Details */}
                            <View className="flex-1 ml-4">
                                <Text className="text-xl font-semibold text-gray-700">
                                    {item[0].replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                                </Text>
                                <Text className="text-sm text-gray-500">{item[1]} days</Text>
                            </View>
                        </View>
                    )}
                    estimatedItemSize={80}
                    keyExtractor={(item) => item[0]}
                />
            </View>

            {/* Post Button Section */}
            <View className="m-4">
                <TouchableOpacity
                    onPress={handlePost}
                    className="bg-sky-500 py-3 rounded-full shadow-lg flex-row items-center justify-center"
                >
                    <Text className="text-white text-xl font-bold">Post</Text>
                    <Ionicons name="send" size={24} color="white" className="ml-3" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
