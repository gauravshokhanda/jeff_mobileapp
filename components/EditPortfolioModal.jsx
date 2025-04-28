import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import TextInputField from './TextInputField';
import debounce from 'lodash.debounce';
import { API } from '../config/apiConfig';
import { useSelector } from 'react-redux';

export default function EditPortfolioModal({
  modalVisible,
  setModalVisible,
  portfolio,
  formData,
  setFormData,
  handleUpdate,
  pickImage,
  selectedImage, 
}) {
  const token = useSelector((state) => state.auth.token);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleCitySearch = useCallback(
    debounce(async (query, currentPage = 1) => {
      if (!query) {
        setCities([]);
        return;
      }
      setSearchLoading(true);
      try {
        const response = await API.post(
          `/citie-search?page=${currentPage}`,
          { city: query },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const cityData = response.data.data.map((city) => ({
          key: city.id.toString(),
          label: city.city,
          zip: city.pincode,
        }));

        if (currentPage === 1) {
          setCities(cityData);
        } else {
          setCities((prev) => [...prev, ...cityData]);
        }

        setHasMoreCities(currentPage < response.data.pagination.last_page);
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'City search failed.');
      } finally {
        setSearchLoading(false);
        setLoadingMore(false);
      }
    }, 500),
    [token]
  );

  const loadMoreCities = () => {
    if (hasMoreCities && !searchLoading && !loadingMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      handleCitySearch(formData.city, nextPage);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center bg-black/50 p-6">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="bg-white p-6 rounded-lg">
              {/* Modal Header */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-semibold">Edit Portfolio</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* Round Image with Edit Icon */}
              <View className="items-center mb-6">
                <View className="relative w-32 h-32">
                  <Image
                    source={{
                      uri: selectedImage
                        ? selectedImage
                        : portfolio?.portfolio_images
                        ? `https://g32.iamdeveloper.in/public/${JSON.parse(portfolio.portfolio_images)[0]}`
                        : 'https://via.placeholder.com/150',
                    }}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#0C4A6E',
                      borderRadius: 20,
                      padding: 6,
                    }}
                  >
                    <MaterialIcons name="edit" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Form Fields */}
              <TextInputField
                label="Project Name"
                value={formData.project_name}
                onChange={(text) => setFormData({ ...formData, project_name: text })}
              />
              <TextInputField
                label="Description"
                value={formData.description}
                onChange={(text) => setFormData({ ...formData, description: text })}
              />
              <TextInputField
                label="Address"
                value={formData.address}
                onChange={(text) => setFormData({ ...formData, address: text })}
              />

              {/* City Search Field */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-1">City</Text>
                <View className="border border-gray-300 rounded-lg px-3 py-2 bg-white">
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={18} color="black" />
                    <TextInput
                      className="flex-1 text-base ml-2 text-gray-800"
                      placeholder="Enter city"
                      placeholderTextColor="#A0AEC0"
                      value={formData.city}
                      onChangeText={(text) => {
                        setFormData({ ...formData, city: text });
                        setPage(1);
                        handleCitySearch(text, 1);
                      }}
                    />
                    {searchLoading && (
                      <ActivityIndicator size="small" color="#0C4A6E" style={{ marginLeft: 8 }} />
                    )}
                  </View>

                  {cities.length > 0 && (
                    <View style={{ marginTop: 6, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
                      {cities.map((item) => (
                        <TouchableOpacity
                          key={item.key}
                          onPress={() => {
                            setFormData({ ...formData, city: item.label });
                            setCities([]);
                          }}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 4,
                            backgroundColor: '#F9FAFB',
                            borderBottomColor: '#E5E7EB',
                            borderBottomWidth: 1,
                          }}
                        >
                          <Text style={{ fontSize: 16, color: '#111827' }}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}

                      {hasMoreCities && (
                        <TouchableOpacity
                          onPress={loadMoreCities}
                          style={{
                            paddingVertical: 10,
                            alignItems: 'center',
                            backgroundColor: '#E0F2FE',
                            borderRadius: 5,
                            marginTop: 4,
                          }}
                        >
                          <Text style={{ color: '#0369A1', fontWeight: '600' }}>Load More</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-end mt-2">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
                >
                  <Text className="text-black">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdate}
                  className="px-4 py-2 bg-sky-950 rounded-lg"
                >
                  <Text className="text-white">update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}