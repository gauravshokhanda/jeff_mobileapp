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
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { useSelector } from 'react-redux';
import { API } from '../../config/apiConfig';

export default function Dashboard() {
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [area, setArea] = useState('');
  const [projectType, setProjectType] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(null);

  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async () => {
    console.log("handle function")
    if (!city || !zipCode || !area || !projectType) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);

    const data = {
      city,
      zip_code: zipCode,
      area,
      project_type: projectType,
    };

    try {
      console.time("API Call"); // Start timer for debugging
      const response = await API.post("regional_multipliers/details", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.timeEnd("API Call"); // End timer for debugging

      const { total_cost } = response.data.data;
      setTotalCost(total_cost);

      // Batch state updates to avoid multiple re-renders
      setCity('');
      setZipCode('');
      setArea('');
      setProjectType('');
    } catch (error) {
      console.error("Error occurred:", error.message);
      Alert.alert('Error', error.response?.data?.message || 'An unknown error occurred');
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="py-6 bg-sky-950 shadow-lg">
          <Text className="text-3xl font-extrabold text-center text-white tracking-wide">Cost Calculator</Text>
        </View>

        <View className="p-6 bg-white m-4 rounded-lg shadow-md border border-gray-300">
          <Text className="text-gray-700 mb-1 text-lg font-bold">City:</Text>
          <TextInput
            placeholder="Enter City"
            value={city}
            onChangeText={setCity}
            className="border border-gray-300 rounded-md p-3 mb-4"
          />

          <Text className="text-gray-700 mb-1 text-lg font-bold">Zip Code:</Text>
          <TextInput
            placeholder="Enter Zip Code"
            keyboardType="numeric"
            value={zipCode}
            onChangeText={setZipCode}
            className="border border-gray-300 rounded-md p-3 mb-4"
          />

          <Text className="text-gray-700 mb-1 text-lg font-bold">Area in Square Feet:</Text>
          <TextInput
            placeholder="Enter Area"
            value={area}
            onChangeText={setArea}
            className="border border-gray-300 rounded-md p-3 mb-4"
          />

          <Text className="text-gray-700 mb-2 text-lg font-bold">Construction Type:</Text>
          <ModalSelector
            data={projectTypeOptions}
            initValue={projectType || "Select Project Type"}
            onChange={(option) => setProjectType(option.label)}
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 16 }}
            initValueTextStyle={{ padding: 10, color: '#555' }}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-sky-900 py-3 rounded-md shadow-md"
            disabled={loading}
          >
            <Text className="text-white text-center text-lg font-bold">CALCULATE</Text>
          </TouchableOpacity>

          {totalCost && (
            <View className="mt-4">
              <Text className="text-gray-800 text-lg font-semibold">Result:</Text>
              <Text className="mt-2 p-3 bg-gray-100 border border-gray-300 rounded-md">
                ${totalCost}
              </Text>
            </View>
          )}
        </View>

        {loading && (
          <View className="absolute inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center">
            <ActivityIndicator size="large" color="#FFF" />
            <Text className="text-sky-950 mt-3">Calculating...</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
