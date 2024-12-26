import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from "expo-document-picker";

export default function FloorMapScreen() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [floor_maps, setFloor_maps] = useState("");
    const [Input_area_details, setInput_area_details] = useState("");
    const [description, setDescription] = useState("");
    const [landmarks, setLandmarks] = useState("");

    const [fileName, setFileName] = useState(null);
    const [imageUri, setImageUri] = useState(null);

    const handleFileUpload = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf'],
            copyToCacheDirectory: true,
        });

        setFileName(result.assets[0].name);
        setImageUri(result.assets[0].uri);
        setFloor_maps(result.assets[0].uri);
    };

    const handleRemoveImage = () => {
        setImageUri(null);
        setFileName(null);
        setFloor_maps("");
    };

    const handleSubmit = () => {
        if (!name || !address || !Input_area_details || !description || !landmarks || !floor_maps) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        const materialCost = 5000;
        const laborCost = 3000;
        const estimatedCost = materialCost + laborCost;

        Alert.alert(
            "Price Breakup",
            `Material Cost: ₹${materialCost}\nLabor Cost: ₹${laborCost}\nYour Estimated Cost: ₹${estimatedCost}`,
            [{ text: "OK" }]
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                className="px-5"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-center text-sky-900">
                        Floor Map Details
                    </Text>
                </View>

                {/* Upload Section */}
                <View className="bg-white shadow-lg rounded-2xl p-6 mt-8">
                    <Text className="text-gray-800 font-semibold text-lg mb-4">Upload Floormap</Text>
                    <View className="border-dashed border-2 border-sky-900 rounded-xl p-8 items-center">
                        {imageUri && (
                            <View className="relative w-full items-center">
                                <TouchableOpacity
                                    onPress={handleRemoveImage}
                                    style={{
                                        position: 'absolute',
                                        top: -10,
                                        left: 10,
                                        zIndex: 1,
                                        backgroundColor: 'white',
                                        borderRadius: 50,
                                        padding: 5,
                                    }}
                                >
                                    <FontAwesome name="close" size={20} color="red" />
                                </TouchableOpacity>

                                <Text className="text-gray-800 font-semibold mb-4 mt-4">Preview</Text>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={{
                                        width: '100%',
                                        height: 250,
                                        resizeMode: 'contain',
                                        borderRadius: 15,
                                        marginBottom: 15,
                                    }}
                                />
                            </View>
                        )}
                        <FontAwesome name="cloud-upload" size={60} color="#0284C7" />
                        <Text className="text-gray-900 mt-4">Upload your files</Text>
                        <Text className="text-sm text-gray-400 mb-4">
                            Supported formats: JPG, PNG, PDF
                        </Text>
                        <TouchableOpacity
                            onPress={handleFileUpload}
                            className="bg-sky-900 py-3 px-8 rounded-lg shadow-md">
                            <Text className="text-white font-bold text-base">Add Floormap</Text>
                        </TouchableOpacity>
                        {fileName && (
                            <Text className="text-sm text-gray-900 mt-4">
                                Uploaded: {fileName}
                            </Text>
                        )}
                        <Text className="text-xs text-gray-400 mt-4">
                            Max file size: 10MB
                        </Text>
                    </View>
                </View>

                {/* Input Fields */}
                <View className="space-y-6 mt-8">
                    {/* Row 1 */}
                    <View className="flex-row justify-between space-x-4">
                        {/* Name */}
                        <View style={{ flex: 1 }}>
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Name</Text>
                            <TextInput
                                className="border border-sky-900 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter name"
                                placeholderTextColor="#A0AEC0"
                                onChangeText={setName}
                            />
                        </View>

                        {/* Address */}
                        <View style={{ flex: 1 }}>
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Address</Text>
                            <TextInput
                                className="border border-sky-900 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter address"
                                placeholderTextColor="#A0AEC0"
                                onChangeText={setAddress}
                            />
                        </View>
                    </View>

                    {/* Row 2 */}
                    <View className="flex-row justify-between space-x-4">
                        {/* Area */}
                        <View style={{ flex: 1 }}>
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Area</Text>
                            <TextInput
                                className="border border-sky-900 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter area"
                                placeholderTextColor="#A0AEC0"
                                onChangeText={setInput_area_details}
                            />
                        </View>

                        {/* Landmarks */}
                        <View style={{ flex: 1 }}>
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Landmarks</Text>
                            <TextInput
                                className="border border-sky-900 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter landmarks"
                                placeholderTextColor="#A0AEC0"
                                onChangeText={setLandmarks}
                            />
                        </View>
                    </View>

                    {/* Description */}
                    <View>
                        <Text className="text-gray-900 font-semibold mb-1 text-base">Description</Text>
                        <TextInput
                            className="border border-sky-900 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                            placeholder="Enter description"
                            placeholderTextColor="#A0AEC0"
                            multiline
                            numberOfLines={10}
                            textAlignVertical="top"
                            onChangeText={setDescription}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-sky-900 py-4 rounded-xl mt-10 shadow-lg"
                    style={{ shadowColor: '#0284C7', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }}
                >
                    <Text className="text-white font-bold text-center text-lg">Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}