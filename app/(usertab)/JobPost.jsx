import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const JobApplicationScreen = () => {
    const breakdownCostDetail = useSelector((state) => state.breakdownCost.breakdownCost);
    const token = useSelector((state) => state.auth.token);

    const [form, setForm] = useState({
        numberOfDays: "",
        totalCost: "",
        zipCode: "",
        area: "",
        city: "",
        projectType: "",
        designImage: null,
        floorMapImage: null,
        description: "",
    });

    // Update form state when breakdownCostDetail changes
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
                floorMapImage: breakdownCostDetail?.floor_maps || null,
            }));
        }
    }, [breakdownCostDetail]);

    const handleImagePick = async (field) => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf"],
            copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {

            const selectedUri = result.assets[0]?.uri;
            setForm((prevForm) => ({
                ...prevForm,
                [field]: selectedUri,
            }));
        }
    };

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('number_of_days', form.numberOfDays);
        formData.append('total_cost', form.totalCost);
        formData.append('zipcode', form.zipCode);
        formData.append('area', form.area);
        formData.append('city', form.city);
        formData.append('project_type', form.projectType);
        formData.append('description', form.description);
    
        if (form.floorMapImage) {
            formData.append('floor_maps_image[]', {
                uri: form.floorMapImage,
                type: 'image/jpeg', // Adjust according to the image type
                name: 'floor_map_image.jpg',
            });
        }
    
        if (form.designImage) {
            formData.append('design_image[]', {
                uri: form.designImage,
                type: 'image/jpeg', // Adjust according to the image type
                name: 'design_image.jpg',
            });
        }
    
        console.log("Form Data:", formData); // Check the form data before submitting
    
        try {
            const response = await axios.post('https://g32.iamdeveloper.in/api/job-post', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Form submitted successfully:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Response error:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    };
    

    return (
        <ScrollView className="flex-1">
            <TouchableOpacity className="absolute top-4 left-3 z-10">
                <Ionicons name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
            <Text className="text-3xl font-extrabold text-center mb-6 bg-sky-950 text-white p-3">Job Application</Text>
            <View className="p-4">
                <View className="flex-row mb-6 space-x-4">
                    <View className="flex-1">
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
                    <TouchableOpacity
                        className="bg-white p-4 rounded-2xl shadow-lg flex items-center justify-center"
                        style={{
                            elevation: 15,
                            shadowColor: "#082f49",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                        }}
                        onPress={() => handleImagePick('designImage')}
                    >
                        <Text className="text-sky-500">{form.designImage ? 'Change Design Image' : 'Upload Design Image'}</Text>
                    </TouchableOpacity>
                    {form.designImage && (
                        <Image
                            source={{ uri: form.designImage }}
                            className="w-full h-40 mt-3 rounded-2xl"
                        />
                    )}
                </View>

                <View className="mb-6">
                    <TouchableOpacity
                        className="bg-white p-4 rounded-2xl shadow-lg flex items-center justify-center "
                        style={{
                            elevation: 15,
                            shadowColor: "#082f49",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                        }}
                        onPress={() => handleImagePick('floorMapImage')}
                    >
                        <Text className="text-sky-500">{form.floorMapImage ? 'Change Floor Map Image' : 'Upload Floor Map Image'}</Text>
                    </TouchableOpacity>
                    {form.floorMapImage && (
                        <Image
                            source={{ uri: form.floorMapImage }}
                            className="w-full h-40 mt-3 rounded-2xl"
                        />
                    )}
                </View>

                <TouchableOpacity
                    className="bg-sky-600 p-4 rounded-2xl shadow-lg flex items-center "
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
