import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Image,
    StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { API } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';
import { FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';

export default function FloorMapScreen() {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [area, setArea] = useState('');
    const [projectType, setProjectType] = useState('');
    const [squareFit, setSquareFit] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [fileName, setFileName] = useState(null);

    const token = useSelector((state) => state.auth.token);
    const router = useRouter();

    const handleFileUpload = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf"],
            copyToCacheDirectory: true,
        });

        setFileName(result.assets[0]?.name || "Uploaded File");
        setImageUri(result.assets[0]?.uri);
    };

    const handleRemoveImage = () => {
        setImageUri(null);
        setFileName(null);
    };

    const handleSubmit = async () => {
        if (!city || !zipCode || !area || !projectType) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append("city", city);
        data.append("zip_code", zipCode);
        data.append("area", area);
        data.append("project_type", projectType);

        try {
            const response = await API.post("regional_multipliers/details", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const breakdownCost = JSON.stringify(response.data.data);
            router.push(`/BreakdownCost?breakdownCost=${breakdownCost}&screenName=FloorMapScreen`);

            setName('');
            setCity('');
            setZipCode('');
            setArea('');
            setProjectType('');
            setImageUri('');
        } catch (error) {
            console.error("Error occurred:", error.message);
            if (error.response) {
                Alert.alert('Error', error.response.data.message || 'API Error occurred!');
            } else {
                Alert.alert('Error', 'Network or server issue occurred!');
            }
        } finally {
            setLoading(false);
        }
    };

    const projectTypeOptions = [
        { key: '1', label: 'Basic' },
        { key: '2', label: 'Mid-range' },
        { key: '3', label: 'Luxury' },
    ];

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
                <View className={`py-4 bg-sky-950 ${Platform.OS === 'ios' ? 'pt-14' : ''}`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className={`absolute z-10 left-4 ${Platform.OS === 'ios' ? 'top-16' : 'top-5'}`} >
                        <Ionicons name='arrow-back' size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold text-center text-white">
                        Floor Map Details
                    </Text>
                </View>

                <View className="px-6 mt-4">
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
                                    <FontAwesome
                                        name="cloud-upload"
                                        size={50}
                                        color="#0284C7"
                                        className="pt-2"
                                    />
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
                    <View>
                        <View className="space-y-6 mt-6">
                            {/* Name */}
                            <View className="mx-2">
                                <Text className="text-gray-800 font-semibold mb-1 text-base">Name</Text>
                                <TextInput
                                    className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                    placeholder="Enter city"
                                    placeholderTextColor="#A0AEC0"
                                    onChangeText={setName}
                                    value={name}
                                />
                            </View>

                            {/* City */}
                            <View className="mx-2">
                                <Text className="text-gray-800 font-semibold mb-1 text-base">City</Text>
                                <TextInput
                                    className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                    placeholder="Enter city"
                                    placeholderTextColor="#A0AEC0"
                                    onChangeText={setCity}
                                    value={city}
                                />
                            </View>
                            {/* Zip Code */}
                            <View className="mx-2">
                                <Text className="text-gray-800 font-semibold mb-1 text-base">Zip Code</Text>
                                <TextInput
                                    className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                    placeholder="Enter zip code"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="numeric"
                                    onChangeText={setZipCode}
                                    value={zipCode}
                                />
                            </View>
                        </View>

                        {/* Area */}
                        <View className="mx-2">
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Area in Square feet</Text>
                            <TextInput
                                className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter area"
                                placeholderTextColor="#A0AEC0"
                                onChangeText={setArea}
                                value={area}
                            />
                        </View>

                        {/* Project Type */}
                        <View className="mx-2">
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Project Type</Text>
                            <ModalSelector
                                data={projectTypeOptions}
                                initValue={projectType || "Select project type"}
                                onChange={(option) => setProjectType(option.label)}
                                style={{
                                    backgroundColor: '#FFF',
                                }}
                                initValueTextStyle={{ color: projectType ? 'black' : '#A0AEC0', textAlign: 'start', padding: 5, borderRadius: 10, }}
                                selectTextStyle={{ color: 'black', fontSize: 16 }}
                            />
                        </View>

                        {/* Submit Button */}
                        <View className="mt-4">
                            <TouchableOpacity
                                onPress={handleSubmit}
                                className="bg-sky-900 py-4 rounded-xl shadow-md"
                            >
                                <Text className="text-white text-center font-semibold">Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Full Screen Loading Indicator */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
