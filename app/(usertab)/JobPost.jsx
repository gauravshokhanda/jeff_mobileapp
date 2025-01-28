import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image,ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const JobApplicationScreen = () => {
    const [loading, setLoading] = useState(false);
    const breakdownCostDetail = useSelector((state) => state.breakdownCost.breakdownCost);
    const token = useSelector((state) => state.auth.token);

    const [form, setForm] = useState({
        numberOfDays: "",
        totalCost: "",
        zipCode: "",
        area: "",
        city: "",
        projectType: "",
        designImages: [],
        floorMapImages: [],
        description: "",
    });

    useEffect(() => {
        if (breakdownCostDetail) {
            setForm((prevForm) => ({
                ...prevForm,
                numberOfDays: breakdownCostDetail?.days?.estimated_time?.toString() || "",
                totalCost: breakdownCostDetail?.total_cost?.toString() || "",
                zipCode: breakdownCostDetail?.zip_code || "",
                area: breakdownCostDetail?.area || "",
                city: breakdownCostDetail?.city || "",
                projectType: breakdownCostDetail?.days?.project_type || "",
                floorMapImages: breakdownCostDetail?.floor_maps ? [breakdownCostDetail.floor_maps] : [],
            }));
        }
    }, [breakdownCostDetail]);

    const handleImagePick = async (field) => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ["image/*"],
            multiple: true,
            copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setForm((prevForm) => ({
                ...prevForm,
                [field]: [...prevForm[field], ...result.assets.map(asset => asset.uri)],
            }));
        }
    };

    const removeImage = (field, index) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: prevForm[field].filter((_, i) => i !== index),
        }));
    };

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('number_of_days', parseInt(form.numberOfDays, 10));
        formData.append('total_cost', form.totalCost);
        formData.append('zipcode', form.zipCode);
        formData.append('area', form.area);
        formData.append('city', form.city);
        formData.append('project_type', form.projectType);
        formData.append('description', form.description);

        form.floorMapImages.forEach((uri, index) => {
            formData.append(`floor_maps_image[]`, {
                uri,
                type: 'image/jpeg',
                name: `floor_map_image_${index}.jpg`,
            });
        });

        form.designImages.forEach((uri, index) => {
            formData.append(`design_image[]`, {
                uri,
                type: 'image/jpeg',
                name: `design_image_${index}.jpg`,
            });
        });

        console.log("Form Data:", formData);

        setLoading(true);

        try {
            const response = await axios.post('https://g32.iamdeveloper.in/api/job-post', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert("Success", "Your job application has been posted successfully!");

            setForm({
                numberOfDays: "",
                totalCost: "",
                zipCode: "",
                area: "",
                city: "",
                projectType: "",
                designImages: [],
                floorMapImages: [],
                description: "",
            });

        } catch (error) {
            if (error.response) {
                Alert.alert('Error:', error.response.data);
            } else {
                console.log('Error:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }



    return (
        <ScrollView className="flex-1">
            <TouchableOpacity className="absolute top-4 left-3 z-10">
                <Ionicons name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
            <Text className="text-3xl font-extrabold text-center mb-6 bg-sky-950 text-white p-3">Job Application</Text>
            <View className="p-4">
                <View className="flex-row mb-6 space-x-4">
                    <View className="flex-1">
                        <Text className="pl-4 pb-2 text-gray-600">Number of Days</Text>
                        <TextInput
                            className="bg-white p-4 rounded-2xl text-sky-800 mx-1"
                            placeholder="Enter number of days"
                            keyboardType="numeric"
                            value={form.numberOfDays}
                            onChangeText={(text) => handleInputChange('numberOfDays', text)}
                            style={{
                                elevation: 15,
                                shadowColor: "blue",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }}
                        />
                    </View>
                    <View className="flex-1">
                    <Text className="pl-4 pb-2 text-gray-600">Total cost</Text>

                        <TextInput
                            className="bg-white p-4 rounded-2xl shadow-lg text-sky-800 mx-1"
                            placeholder="Enter total cost"
                            keyboardType="numeric"
                            value={form.totalCost}
                            style={{
                                elevation: 15,
                                shadowColor: "blue",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }}
                            onChangeText={(text) => handleInputChange('totalCost', text)}
                        />
                    </View>
                </View>

                <View className="flex-row mb-6 space-x-4">
                    <View className="flex-1">
                    <Text className="pl-4 pb-2 text-gray-600">Zip code</Text>

                        <TextInput
                            className="bg-white p-4 rounded-2xl shadow-lg text-sky-800 mx-1"
                            placeholder="Enter zip code"
                            keyboardType="numeric"
                            value={form.zipCode}
                            style={{
                                elevation: 15,
                                shadowColor: "blue",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }}
                            onChangeText={(text) => handleInputChange('zipCode', text)}
                        />
                    </View>

                    <View className="flex-1">
                    <Text className="pl-4 pb-2 text-gray-600">Area </Text>

                        <TextInput
                            style={{
                                elevation: 15,
                                shadowColor: "blue",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }}
                            className="bg-white p-4 rounded-2xl shadow-lg text-sky-800 mx-1"
                            placeholder="Enter area"
                            value={form.area}
                            onChangeText={(text) => handleInputChange('area', text)}
                        />
                    </View>
                </View>

                <View className="flex-row mb-6 space-x-4">
                    <View className="flex-1">
                    <Text className="pl-4 pb-2 text-gray-600">City</Text>

                        <TextInput
                            className="bg-white p-4 rounded-2xl shadow-lg text-sky-800 mx-1"
                            placeholder="Enter city"
                            value={form.city}
                            style={{
                                elevation: 15,
                                shadowColor: "blue",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }}
                            onChangeText={(text) => handleInputChange('city', text)}
                        />
                    </View>

                    <View className="flex-1">
                    <Text className="pl-4 pb-2 text-gray-600">Project type</Text>

                        <TextInput
                            className="bg-white p-4 rounded-2xl shadow-lg text-sky-800 mx-1"
                            placeholder="Enter project type"
                            value={form.projectType}
                            style={{
                                elevation: 15,
                                shadowColor: "blue",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }}
                            onChangeText={(text) => handleInputChange('projectType', text)}
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <TextInput
                        className="bg-white p-4 rounded-2xl shadow-lg text-sky-800 h-48 justify-start align-top"
                        placeholder="Enter project description"
                        value={form.description}
                        multiline
                        numberOfLines={10}
                        style={{
                            elevation: 15,
                            shadowColor: "blue",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                        }}
                        onChangeText={(text) => handleInputChange('description', text)}
                    />
                </View>
                <View className="mb-6">
                {form.designImages.length === 0 && (
                    <TouchableOpacity
                        className="bg-white p-4 rounded-2xl shadow-lg flex items-center justify-center"
                        onPress={() => handleImagePick('designImages')}
                    >
                        <Text className="text-sky-500">Upload Design Images</Text>
                    </TouchableOpacity>
                )}
                <View className="flex-row flex-wrap mt-3 ">

                    
                {form.designImages.length > 0 && (
                    <View className="border-dashed border-2 border-gray-400 p-2 rounded-lg mt-3">
                        <Text className="text-center text-sky-500">Design Images</Text>
                        <View className="flex-row flex-wrap mt-2">
                            {form.designImages.map((uri, index) => (
                                <View key={index} className="relative w-24 h-24 m-1">
                                    <Image source={{ uri }} className="w-full h-full rounded-2xl" />
                                    <TouchableOpacity
                                        onPress={() => removeImage('designImages', index)}
                                        className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                                    >
                                        <Ionicons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                </View>
                
                
            </View>

            {/* Floor Map Images Upload */}
            <View className="mb-6">
                {form.floorMapImages.length === 0 && (
                    <TouchableOpacity
                        className="bg-white p-4 rounded-2xl shadow-lg flex items-center justify-center"
                        onPress={() => handleImagePick('floorMapImages')}
                    >
                        <Text className="text-sky-500">Upload Floor Map Images</Text>
                    </TouchableOpacity>
                )}
                <View className="">
                <View className="flex-row flex-wrap mt-3">
                {form.floorMapImages.length > 0 && (
                    <View className="border-dashed border-2 border-gray-400 p-2 rounded-lg mt-3">
                        <Text className="text-center text-sky-500">Floor Map Images</Text>
                        <View className="flex-row flex-wrap mt-2">
                            {form.floorMapImages.map((uri, index) => (
                                <View key={index} className="relative w-24 h-24 m-1">
                                    <Image source={{ uri }} className="w-full h-full rounded-2xl" />
                                    <TouchableOpacity
                                        onPress={() => removeImage('floorMapImages', index)}
                                        className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                                    >
                                        <Ionicons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                </View>
                </View>
            
            </View>

                <TouchableOpacity
                    className="bg-sky-600 p-2 rounded-2xl shadow-lg flex items-center w-[50%] text-center ml-[22%]"
                    style={{
                        elevation: 15,
                        shadowColor: "#082f49",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                    }}
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-bold text-lg">Submit Application</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default JobApplicationScreen;
