import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { FlashList } from "@shopify/flash-list";
import debounce from "lodash.debounce";
import { API } from "../config/apiConfig";
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

const CitySearch = ({ city, setCity, localeCity, setLocaleCity }) => {
    const [cities, setCities] = useState([]);
    const [localeCities, setLocaleCities] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [localeLoading, setLocaleLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMoreCities, setHasMoreCities] = useState(true);
    const [showLocaleList, setShowLocaleList] = useState(false);

    const token = useSelector((state) => state.auth.token);

    // Search for Cities with Pagination
    const handleCitySearch = useCallback(
        debounce(async (query, reset = false) => {
            if (!query) {
                setCities([]);
                setHasMoreCities(true);
                return;
            }

            setSearchLoading(true);

            try {
                const response = await API.post(
                    `/citie-search?page=${reset ? 1 : page}`,
                    { city: query },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // ➡️ Validate response structure
                if (!response.data?.data) {
                    throw new Error("Invalid response format for city search.");
                }

                const cityData = response.data.data.map((city) => ({
                    key: city.id.toString(),
                    label: city.city,
                }));

                setCities((prevCities) =>
                    reset ? cityData : [...prevCities, ...cityData]
                );
                setHasMoreCities(response.data.next_page_url !== null);
                if (reset) setPage(1);
            } catch (error) {
                console.log("City Search Error:", error.message, error.response?.data); // ➡️ Debug log
                // Alert.alert("Error", error.message || "City search failed.");
            } finally {
                setSearchLoading(false);
            }
        }, 500),
        [token, page]
    );

    // Load more data for pagination
    const loadMoreCities = () => {
        if (!searchLoading && hasMoreCities && city) {
            setPage((prevPage) => prevPage + 1);
            handleCitySearch(city);
        }
    };

    // Fetch Locale Cities after selecting a city
    const handleLocaleCitySearch = async (selectedCity) => {
        setLocaleLoading(true);
        setLocaleCities([]);
        setShowLocaleList(true);

        try {
            const response = await API.get(
                `/city-local-names?city=${encodeURIComponent(selectedCity)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ➡️ Validate response structure
            if (!response.data?.local_names?.data) {
                throw new Error("Invalid response format for locale cities.");
            }

            const localeCityData = response.data.local_names.data.map((locale) => ({
                key: locale.id.toString(),
                label: locale.LOCALE_NAME,
            }));

            setLocaleCities(localeCityData);
        } catch (error) {
            console.log("Locale City Error:", error.message, error.response?.data); // ➡️ Debug log
            Alert.alert("Error", error.message || "Failed to fetch locale cities.");
        } finally {
            setLocaleLoading(false);
        }
    };

    // Handle locale city selection and hide FlashList
    const handleLocaleSelection = (label) => {
        setLocaleCity(label);
        setShowLocaleList(false);
    };

    return (
        <View className="flex-1">
            {/* Main City Search */}
            <View className="flex-row items-center border-b border-gray-300 mt-5">
                <Ionicons name="search" size={18} color="black" />
                <TextInput
                    className="flex-1 text-lg text-gray-800 ml-5 py-2"
                    placeholder="Search city"
                    placeholderTextColor="#A0AEC0"
                    onChangeText={(text) => {
                        setCity(text);
                        setPage(1);
                        handleCitySearch(text, true);
                    }}
                    value={city}
                />
                {searchLoading && !cities.length && (
                    <ActivityIndicator size="small" color="#0000ff" />
                )}
            </View>

            {/* City List with Pagination */}
            {cities.length > 0 && (
                <FlashList
                    data={cities}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setCity(item.label);
                                setCities([]);
                                handleLocaleCitySearch(item.label);
                            }}
                            className="p-3 border-b border-gray-200 bg-white"
                        >
                            <Text className="text-base">{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    estimatedItemSize={44}
                    onEndReached={loadMoreCities}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        searchLoading && hasMoreCities ? (
                            <View className="py-2">
                                <ActivityIndicator size="small" color="#0000ff" />
                            </View>
                        ) : null
                    }
                    contentContainerStyle={{ paddingBottom: 0 }}
                    style={{ maxHeight: cities.length * 44 > 150 ? 150 : cities.length * 44 }}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Locale City Section */}
            {(localeCities.length > 0 || localeCity) && (
                <View className="mt-5">
                    <Text className="text-lg font-semibold">Locale City</Text>
                    <TextInput
                        className="border border-gray-300 p-2 rounded-md mt-2 bg-gray-50"
                        value={localeCity}
                        placeholder="Select a locale city"
                        editable={false}
                    />
                    {showLocaleList && localeCities.length > 0 && (
                        <FlashList
                            data={localeCities}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleLocaleSelection(item.label)}
                                    className="p-3 border-b border-gray-200 bg-gray-100"
                                >
                                    <Text className="text-base">{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            estimatedItemSize={44}
                            contentContainerStyle={{ paddingBottom: 0 }}
                            style={{ maxHeight: localeCities.length * 44 > 150 ? 150 : localeCities.length * 44 }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                    {localeLoading && (
                        <View className="py-2">
                            <ActivityIndicator size="small" color="#0000ff" />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default CitySearch;