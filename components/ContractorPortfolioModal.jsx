import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert,
    useWindowDimensions
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { FlashList } from '@shopify/flash-list';
import debounce from 'lodash.debounce';
import { API } from '../config/apiConfig';
import { useSelector } from "react-redux";
import axios from 'axios';

export default function ContractorPortfolioModal({ visible, onClose, addPortfolioItem }) {
    const [projectName, setProjectName] = useState('');
    const [cityName, setCityName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [cities, setCities] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreCities, setHasMoreCities] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [localeCities, setLocaleCities] = useState([]);
    const [hasMoreLocaleCities, setHasMoreLocaleCities] = useState(true);
    const [localeCity, setLocaleCity] = useState('');
    const [localePage, setLocalePage] = useState(1);
    const [searchLoading, setSearchLoading] = useState(false);

    const token = useSelector((state) => state.auth.token);
    const { height: screenHeight } = useWindowDimensions();

    useEffect(() => {
        if (!visible) {
            // Reset all states when modal closes
            setProjectName('');
            setCityName('');
            setAddress('');
            setDescription('');
            setSelectedImages([]);
            setCities([]);
            setLocaleCities([]);
            setLocaleCity('');
            setPage(1);
            setLocalePage(1);
        }
    }, [visible]);

    const handleCitySearch = useCallback(
        debounce(async (query, currentPage = 1) => {
            if (!query) {
                setCities([]);
                return;
            }
            setSearchLoading(true);

            try {
                const response = await axios.post(
                    `https://g32.iamdeveloper.in/api/citie-search?page=${currentPage}`,
                    { city: query },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const cityData = response.data.data.map((city) => ({
                    key: city.id.toString(),
                    label: city.city,
                    zip: city.pincode,
                }));

                setCities(currentPage === 1 ? cityData : [...cities, ...cityData]);
                setHasMoreCities(currentPage < response.data.pagination.last_page);
            } catch (error) {
                Alert.alert('Error', error.response?.data?.message || 'City search failed');
            } finally {
                setSearchLoading(false);
                setLoadingMore(false);
            }
        }, 500),
        [token]
    );

    const loadMoreCities = () => {
        if (hasMoreCities && !loadingMore) {
            setLoadingMore(true);
            setPage(prev => {
                handleCitySearch(cityName, prev + 1);
                return prev + 1;
            });
        }
    };

    const handleLocaleSearch = async (selectedCity, currentPage = 1) => {
        try {
            const response = await API.get(
                `/city-local-names?page=${currentPage}&city=${encodeURIComponent(selectedCity)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const localeData = response.data.local_names?.data?.map((locale) => ({
                key: locale.id.toString(),
                label: locale.LOCALE_NAME,
                zip: locale.zip,
            }));

            setLocaleCities(prev => 
                currentPage === 1 ? localeData : [...prev, ...localeData]
            );
            setHasMoreLocaleCities(currentPage < response.data.local_names.last_page);
        } catch (error) {
            Alert.alert('Error', 'Failed to load locale cities');
        }
    };

    const handleMainCitySelect = (item) => {
        setCityName(item.label);
        setCities([]);
        setLocalePage(1);
        handleLocaleSearch(item.label, 1);
    };

    const handleLocaleSelect = (item) => {
        setLocaleCity(item.label);
        setLocaleCities([]);
    };

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const compressed = await Promise.all(
                result.assets.map(async (img) => 
                    await ImageManipulator.manipulateAsync(
                        img.uri,
                        [{ resize: { width: 800 } }],
                        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                    )
                )
            );
            setSelectedImages([...selectedImages, ...compressed.map(i => i.uri)]);
        }
    };

    const validateForm = () => {
        if (!projectName || !cityName || !address || !description) {
            Alert.alert('Error', 'Please fill all required fields');
            return false;
        }
        if (selectedImages.length === 0) {
            Alert.alert('Error', 'Please select at least one image');
            return false;
        }
        return true;
    };

    const handleUpload = () => {
        if (!validateForm()) return;

        const portfolioItem = {
            projectName,
            city: cityName,
            localeCity,
            address,
            description,
            images: selectedImages,
        };

        addPortfolioItem(portfolioItem);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-6 rounded-2xl w-[90%]" 
                     style={{ maxHeight: screenHeight * 0.9 }}>
                    <TouchableOpacity
                        className="absolute top-3 right-3 z-10"
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text className="text-xl font-bold mb-4">Add Portfolio Item</Text>

                        {/* Project Name */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Project Name*</Text>
                            <TextInput
                                className="border border-gray-300 p-3 rounded-lg"
                                placeholder="Enter project name"
                                value={projectName}
                                onChangeText={setProjectName}
                            />
                        </View>

                        {/* Main City Search */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">City*</Text>
                            <TextInput
                                className="border border-gray-300 p-3 rounded-lg"
                                placeholder="Search city"
                                value={cityName}
                                onChangeText={text => {
                                    setCityName(text);
                                    setPage(1);
                                    handleCitySearch(text);
                                }}
                            />
                            {cities.length > 0 && (
                                <View className="mt-2 border border-gray-200 rounded-lg max-h-40">
                                    <FlashList
                                        data={cities}
                                        keyExtractor={item => item.key}
                                        estimatedItemSize={45}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                className="p-3 border-b border-gray-100"
                                                onPress={() => handleMainCitySelect(item)}
                                            >
                                                <Text>{item.label}</Text>
                                            </TouchableOpacity>
                                        )}
                                        onEndReached={loadMoreCities}
                                        onEndReachedThreshold={0.5}
                                        ListFooterComponent={
                                            loadingMore && <ActivityIndicator className="py-2" />
                                        }
                                    />
                                </View>
                            )}
                        </View>

                        {/* Locale City Selection */}
                        {cityName && (
                            <View className="mb-4">
                                <Text className="text-gray-600 mb-1">Locale Area</Text>
                                <TextInput
                                    className="border border-gray-300 p-3 rounded-lg"
                                    placeholder="Select locale area"
                                    value={localeCity}
                                    editable={false}
                                />
                                {localeCities.length > 0 && (
                                    <View className="mt-2 border border-gray-200 rounded-lg max-h-40">
                                        <FlashList
                                            data={localeCities}
                                            keyExtractor={item => item.key}
                                            estimatedItemSize={45}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    className="p-3 border-b border-gray-100"
                                                    onPress={() => handleLocaleSelect(item)}
                                                >
                                                    <Text>{item.label} ({item.zip})</Text>
                                                </TouchableOpacity>
                                            )}
                                            onEndReached={() => {
                                                if (hasMoreLocaleCities) {
                                                    handleLocaleSearch(cityName, localePage + 1);
                                                    setLocalePage(prev => prev + 1);
                                                }
                                            }}
                                            onEndReachedThreshold={0.5}
                                            ListFooterComponent={
                                                hasMoreLocaleCities && <ActivityIndicator className="py-2" />
                                            }
                                        />
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Address */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Address*</Text>
                            <TextInput
                                className="border border-gray-300 p-3 rounded-lg"
                                placeholder="Enter project address"
                                value={address}
                                onChangeText={setAddress}
                                multiline
                            />
                        </View>

                        {/* Description */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Description*</Text>
                            <TextInput
                                className="border border-gray-300 p-3 rounded-lg h-24"
                                placeholder="Describe your project"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        {/* Image Upload */}
                        <View className="mb-6">
                            <Text className="text-gray-600 mb-2">Project Images*</Text>
                            <TouchableOpacity
                                className="bg-gray-100 p-4 rounded-lg items-center"
                                onPress={pickImages}
                            >
                                <Ionicons name="cloud-upload" size={24} color="gray" />
                                <Text className="text-gray-600 mt-2">
                                    {selectedImages.length > 0 
                                        ? `${selectedImages.length} images selected`
                                        : "Tap to select images"}
                                </Text>
                            </TouchableOpacity>
                            
                            {selectedImages.length > 0 && (
                                <ScrollView horizontal className="mt-4">
                                    {selectedImages.map((uri, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri }}
                                            className="w-20 h-20 rounded-lg mr-2"
                                        />
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            className="bg-blue-600 p-4 rounded-lg items-center"
                            onPress={handleUpload}
                        >
                            <Text className="text-black font-bold p-3 rounded-xl bg-sky-950 text-white">Upload Portfolio</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}