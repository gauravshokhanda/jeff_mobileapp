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
    ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { API } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';

export default function FloorMapScreen() {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [area, setArea] = useState('');
    const [projectType, setProjectType] = useState('');
    const [squareFit, setSquareFit] = useState('');
    const [loading, setLoading] = useState(false);

    const token = useSelector((state) => state.auth.token);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!city || !zipCode || !area || !projectType || !squareFit) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        setLoading(true);
        const data = new FormData();
        data.append("city", city);
        data.append("zip_code", zipCode);
        data.append("area", area);
        data.append("project_type", projectType);
        data.append("square_fit", squareFit);
        console.log("form data", data);
        try {
            const response = await API.post("regional_multipliers/details", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("response", response.data.data.days);
            Alert.alert('Success', 'Data submitted successfully!');
            const breakdownCost = JSON.stringify(response.data.data.days);
            router.push(`/BreakdownCost?breakdownCost=${breakdownCost}&screenName=FloorMapScreen`);

            setName('');
            setCity('');
            setZipCode('');
            setArea('');
            setProjectType('');
            setSquareFit('');

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
                        className={`absolute z-10 left-4 ${Platform.OS === 'ios' ? 'top-16' : 'top-5'}`}>
                        <Ionicons name='arrow-back' size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold text-center text-white">
                        Floor Map Details
                    </Text>
                </View>

                <View className="px-6 mt-4">
                    {/* Input Fields */}
                    <View className="space-y-6 mt-6">
                        {/* Name */}
                        <View className="mx-2">
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Name</Text>
                            <TextInput
                                className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter Name"
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

                        {/* Area */}
                        <View className="mx-2">
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Area</Text>
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

                        {/* Square Fit */}
                        <View className="mx-2">
                            <Text className="text-gray-800 font-semibold mb-1 text-base">Square Fit</Text>
                            <TextInput
                                className="border border-gray-300 bg-white rounded-xl p-4 text-gray-900 shadow-sm"
                                placeholder="Enter square fit"
                                placeholderTextColor="#A0AEC0"
                                keyboardType="numeric"
                                onChangeText={setSquareFit}
                                value={squareFit}
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-sky-900 py-4 rounded-xl mt-8 shadow-lg"
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text className="text-white font-bold text-center text-lg">Submit</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Full-screen loading overlay */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFF" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

// Styles for full-screen loading
const styles = {
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    loadingText: {
        color: '#FFF',
        fontSize: 18,
        marginTop: 10,
    },
};
