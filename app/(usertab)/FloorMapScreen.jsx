import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { API } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setContractors } from '../../redux/slice/contractorsSlice';

export default function FloorMapScreen() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [floor_maps, setFloor_maps] = useState('');
    const [Input_area_details, setInput_area_details] = useState('');
    // const [description, setDescription] = useState('');
    const [landmark, setlandmark] = useState('');
    const [lat, setLat] = useState("")
    const [lang, setLang] = useState("")

    const [fileName, setFileName] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const token = useSelector((state) => state.auth.token);

    const router = useRouter();

    const dispatch = useDispatch()


    const handleFileUpload = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf'],
            copyToCacheDirectory: true,
        });

        setFileName(result.assets[0]?.name || 'Uploaded File');
        setImageUri(result.assets[0]?.uri);
        setFloor_maps(result.assets[0]?.uri);
    };

    const handleRemoveImage = () => {
        setImageUri(null);
        setFileName(null);
        setFloor_maps('');
    };

    const handleSubmit = async () => {
        router.push('/Contractor')

        if (!name || !address || !Input_area_details || !landmark || !floor_maps || !lat || !lang) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("Input_area_details", Input_area_details);
        formData.append("landmark", landmark);
        formData.append("lat", lat);
        formData.append("lang", lang);
        formData.append("floor_maps", {
            uri: floor_maps,
            type: floor_maps.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
            name: fileName || "uploaded_file",
        });

        try {
            const response = await API.post("floor_map_area/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data, message } = response.data;

            Alert.alert('Success', message || 'Floor map added successfully!');

            if (data?.nearby_contractors?.length > 0) {
                console.log("contractorsData", JSON.stringify(data.nearby_contractors));
                const contractorsParam = encodeURIComponent(JSON.stringify(data.nearby_contractors)); // Ensure the data is encoded correctly
                dispatch(setContractors(data.nearby_contractors));



            }
        } catch (error) {
            console.error("Error occurred:", error.message);
            if (error.response) {
                console.error("Server response:", error.response.data);
                Alert.alert('Error', error.response.data.message || 'API Error occurred!');
            } else {
                Alert.alert('Error', 'Network or server issue occurred!');
            }
        }
    };



    const handleGetLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required');
                return;
            }
            let loc = await Location.getCurrentPositionAsync({});
            setLat(loc.coords.latitude)
            setLang(loc.coords.longitude)
            Alert.alert(
                'Location Fetched',
                `Latitude: ${loc.coords.latitude}\nLongitude: ${loc.coords.longitude}`
            );
        }
        catch (error) {
            console.log("error", error)
        }
        // Alert.alert('Location', 'Fetching your current location...');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
                className="bg-gray-100"
            >
                {/* Header Section */}
                <View className="py-4 bg-sky-950">
                    <Text className="text-3xl font-bold text-center text-white">
                        Floor Map Details
                    </Text>
                </View>
                <View className="px-6 mt-4">
                    {/* Upload Section */}
                    <View className="bg-white shadow-lg rounded-2xl p-6">
                        <Text className="text-gray-800 font-semibold text-lg mb-4">
                            Upload Floormap
                        </Text>
                        <View className="border-dashed border-2 border-sky-900 rounded-xl items-center bg-gray-50">
                            {/* Display preview if imageUri is available */}
                            {imageUri ? (
                                <View className="w-full items-center justify-start mb-1">
                                    <Text className="text-gray-800 font-semibold text-center mb-1">
                                        Preview
                                    </Text>
                                    <View className="relative">
                                        <Image
                                            source={{ uri: imageUri }}
                                            className="w-40 h-40 rounded-lg object-contain"
                                            resizeMode="contain"
                                        />
                                        <TouchableOpacity
                                            onPress={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                                        >
                                            <FontAwesome name="close" size={16} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <FontAwesome name="cloud-upload" size={50} color="#0284C7" className="pt-2" />
                                    <Text className="text-gray-900 mt-4">Upload your files</Text>
                                    <Text className="text-sm text-gray-400 mb-4">
                                        Supported formats: JPG, PNG, PDF
                                    </Text>
                                </>
                            )}

                            {/* Add Floormap Button (only shown if no imageUri exists) */}
                            {!imageUri && (
                                <TouchableOpacity
                                    onPress={handleFileUpload}
                                    className="bg-sky-900 py-3 my-5 px-8 rounded-lg shadow-md"
                                >
                                    <Text className="text-white font-bold text-base">
                                        Add Floormap
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Input Fields */}
                    <View className="space-y-6 mt-6">
                        {/* Name and Address */}
                        <View className="flex-row space-x-4">
                            <View className="flex-1 mx-2">
                                <Text className="text-gray-800 font-semibold mb-1 text-base">Name</Text>
                                <TextInput
                                    className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                    placeholder="Enter name"
                                    placeholderTextColor="#A0AEC0"
                                    onChangeText={setName}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-800 font-semibold mb-1 text-base">Address</Text>
                                <View className="relative">
                                    <Feather
                                        name="map-pin"
                                        size={18}
                                        color="gray"
                                        className="absolute top-5 left-3"
                                    />
                                    <TextInput
                                        className="border border-gray-300 bg-white rounded-xl p-4 pl-10 text-gray-900 shadow-sm"
                                        placeholder="Enter address"
                                        placeholderTextColor="#A0AEC0"
                                        onChangeText={setAddress}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Area and landmark */}
                        <View className="flex-row space-x-4">
                            <View className="flex-1 mx-2">
                                <Text className="text-gray-800 font-semibold mb-1 text-base">Area</Text>
                                <TextInput
                                    className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                    placeholder="Enter area"
                                    placeholderTextColor="#A0AEC0"
                                    onChangeText={setInput_area_details}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-800 font-semibold mb-1 text-base">landmark</Text>
                                <TextInput
                                    className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                    placeholder="Enter landmark"
                                    placeholderTextColor="#A0AEC0"
                                    onChangeText={setlandmark}
                                />
                            </View>
                        </View>

                        {/* Description */}
                        {/* <View>
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Description</Text>
                            <TextInput
                                className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter description"
                                placeholderTextColor="#A0AEC0"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                onChangeText={setDescription}
                            />
                        </View> */}
                    </View>

                    {/* Get My Location Button */}
                    <View className="mt-6">
                        <TouchableOpacity
                            onPress={handleGetLocation}
                            className="border border-sky-200 py-4 rounded-xl bg-white"
                        >
                            <Text

                                className="text-sky-950 font-bold text-center text-lg">Get My Location</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-sky-900 py-4 rounded-xl mt-8 shadow-lg"
                    >
                        <Text className="text-white font-bold text-center text-lg">Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
