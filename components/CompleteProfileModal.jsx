import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import debounce from "lodash.debounce";
import { API } from "../config/apiConfig";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

export default function CompleteProfileModal({
  visible,
  onClose,
  onSubmit,
  initialData = {},
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  const [cities, setCities] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (visible) {
      setName(initialData.name || "");
      setCity(initialData.city || "");
      setAddress(initialData.address || "");
      setNumber(initialData.number || "");
      setEmail(initialData.email || "");
    }
  }, [visible, initialData]);

  const handleCitySearch = useCallback(
    debounce(async (query, currentPage = 1) => {
      if (!query) return;
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
        Alert.alert("Error", error.response?.data?.message || "City search failed.");
      } finally {
        setSearchLoading(false);
        setLoadingMore(false);
      }
    }, 500),
    [token]
  );

  const handleCityChange = (text) => {
    setCity(text);
    setPage(1);
    handleCitySearch(text, 1);
  };

  const loadMoreCities = () => {
    if (hasMoreCities && !searchLoading && !loadingMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      handleCitySearch(city, nextPage);
    }
  };

  const handleSubmit = () => {
    onSubmit({ name, city, address, number, email });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="bg-white rounded-2xl p-6 w-full max-h-[90%]">
          <Text className="text-xl font-bold mb-4 text-center text-sky-900">
            Update Your Profile
          </Text>

          {/* Name */}
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Full Name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />

          {/* City Search with Suggestions */}
          <View className="mb-3">
            <View className="flex-row items-center border border-gray-300 rounded-md p-3 bg-white">
              {/* <Ionicons name="location-outline" size={20} color="gray" /> */}
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="City"
                placeholderTextColor="gray"
                value={city}
                onChangeText={handleCityChange}
              />
              {searchLoading && (
                <ActivityIndicator size="small" color="#0C4A6E" />
              )}
            </View>

            {cities.length > 0 && (
              <View
                style={{
                  maxHeight: 150,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  marginTop: 4,
                }}
              >
                <FlatList
                  data={cities}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCity(item.label);
                        setCities([]);
                      }}
                      style={{
                        padding: 10,
                        borderBottomColor: "#eee",
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={
                    hasMoreCities && (
                      <TouchableOpacity
                        onPress={loadMoreCities}
                        style={{
                          padding: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#0284C7", fontWeight: "bold" }}>
                          Load More
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                />
              </View>
            )}
          </View>

          {/* Address */}
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Address"
            placeholderTextColor="gray"
            value={address}
            onChangeText={setAddress}
          />

          {/* Mobile Number */}
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Mobile Number"
            placeholderTextColor="gray"
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
          />

          {/* Buttons */}
          <View className="flex-row justify-end gap-2 space-x-6 mt-3">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text className="text-sky-950 font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
