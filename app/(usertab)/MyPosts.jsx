import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Platform, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { API, baseUrl } from '../../config/apiConfig';
import { router } from 'expo-router';
import Ionicons from "@expo/vector-icons/Ionicons";


export default function MyPosts() {
    const { width: screenWidth } = Dimensions.get('window');
    const postContentWidth = screenWidth - 20;

    const userId = useSelector((state) => state.auth.user.id);
    // console.log("user", userId)
    const token = useSelector((state) => state.auth.token);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMyPosts = async () => {

            try {
                const response = await API.get(`job-posts/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // console.log("Post Data:", response.data.data.data);
                setResults(response.data.data.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        getMyPosts();
    }, [userId, token]);

    const renderItem = ({ item }) => {
        let imageUrls = [];

        try {
            const parsedImages = item.design_image ? JSON.parse(item.design_image) : [];
            imageUrls = parsedImages.map(imagePath => `${baseUrl}${imagePath}`);
        } catch (error) {
            console.error("Error processing images:", error);
        }

        return (
            <View
                className="bg-white mx-6 my-2 rounded-xl overflow-hidden shadow-lg"
                style={{
                    shadowColor: "#082f49",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 10
                }}
            >
                {imageUrls.length > 0 && (
                    <FlatList
                        horizontal
                        data={imageUrls}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item: url }) => (
                            <View style={{ width: postContentWidth, height: 150 }}>
                                <Image
                                    source={{ uri: url }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={postContentWidth}
                        decelerationRate="fast"
                    />
                )}
                <View className="flex-row justify-between p-3">
                    {/* Keep the rest of your post details the same */}
                    <View>
                        <Text className="text-2xl font-bold text-sky-950">
                            ${parseFloat(item.total_cost).toLocaleString()}
                        </Text>
                        <Text className="text-lg text-semiBold text-gray-600">#{item.zipcode},{item.city}</Text>
                        <Text >{item.area} sqft</Text>
                    </View>
                    <View>
                        <Text className="text-lg font-bold">{item.project_type} Apartment</Text>


                        <TouchableOpacity
                            className="bg-sky-950 w-20 rounded-xl ml-14"

                            onPress={() =>
                                router.push(`/EditPost?id=${item.id}`)
                            }

                        >
                            <Text className="text-white text-center py-2">Edit</Text>
                        </TouchableOpacity>
                        <Text className="text-center text-gray-600">Days-{item.number_of_days}</Text>

                    </View>
                </View>
            </View >
        );
    };

    // Keep the rest of your component the same
    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
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
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            )}

        </View>
    );
}
