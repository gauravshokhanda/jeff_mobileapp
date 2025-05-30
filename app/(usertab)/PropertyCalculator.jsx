import React, { useState, useCallback } from "react";
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
  SafeAreaView,
  Dimensions,
  RefreshControl
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import { useSelector } from "react-redux";
import { API } from "../../config/apiConfig";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash.debounce";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";


export default function PropertyCalculator() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [area, setArea] = useState("");
  const [buildableArea, setbuildableArea] = useState("");
  const [floors, setFloors] = useState("");
  const [projectType, setProjectType] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(null);
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const token = useSelector((state) => state.auth.token);
  const handleRefresh = async () => {
    setRefreshing(true);

    // Reset all fields or re-fetch any necessary data
    setCity("");
    setZipCode("");
    setArea("");
    setbuildableArea("");
    setFloors("");
    setProjectType("");
    setTotalCost(null);
    setCities([]);
    setPage(1);
    setHasMoreCities(true);

    // Optionally refetch something here (like default multipliers)
    setRefreshing(false);
  };


  const handleCitySearch = useCallback(
    debounce(async (query, currentPage = 1) => {
      if (!query) return;
      setSearchLoading(true);
      console.log("current page", currentPage);
      try {
        const response = await API.post(
          `/citie-search?page=${currentPage}`,
          { city: query },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const cityData = response.data.data.map((city) => ({
          key: city.id.toString(),
          label: city.city,
          zip: city.pincode,
        }));

        if (currentPage === 1) {
          setCities(cityData);
        } else {
          setCities((prevCities) => [...prevCities, ...cityData]);
        }
        console.log("next data", response.data.pagination.total);
        setHasMoreCities(currentPage < response.data.pagination.last_page);
      } catch (error) {
        console.log("City search error:", error);

        if (error.response?.data?.message) {
          Alert.alert("Error", error.response.data.message);
        } else {
          Alert.alert(
            "Error",
            "An unknown error occurred while searching for cities."
          );
        }
      } finally {
        setSearchLoading(false);
        setLoadingMore(false); // Reset loadingMore when request finishes
      }
    }, 500),
    [token]
  );

  const loadMoreCities = () => {
    console.log("load more");
    if (hasMoreCities && !searchLoading && !loadingMore) {
      setLoadingMore(true); // Mark loading as true
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        handleCitySearch(city, nextPage);
        return nextPage;
      });
    }
  };

  const getCity = async (zip) => {
    try {
      const response = await API.post(
        "get-cityname",
        { zipcode: zip },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const cityName = response.data.data.city;
      // console.log("cityname",response.data.data.city)
      setCity(cityName);
    } catch (error) {
      console.error("Error fetching city name:", error);
      Alert.alert(
        "Error",
        "Unable to fetch city name. Please check the zip code."
      );
    }
  };

  const handleSubmit = async () => {
    // console.log("handle function");
    if (!city || !zipCode || !area || !projectType || !buildableArea || !floors) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    // setLoading(true);

    const data = {
      city,
      zip_code: zipCode,
      area,
      project_type: projectType,
      buildable_area: buildableArea,
      floors
    };

    try {
      const response = await API.post("regional_multipliers/details", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { total_cost } = response.data.data;
      setTotalCost(total_cost);
    } catch (error) {
      console.log("Error occurred:", error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  };

  const projectTypeOptions = [
    { key: "1", label: "Basic" },
    { key: "2", label: "Mid-range" },
    { key: "3", label: "Luxury" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.4 }}
      >
        <View className="pt-10 px-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-white/10"
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-10">
            Cost Calculator
          </Text>
        </View>
      </LinearGradient>
      <View
        className="h-[90%] bg-white"
        style={{
          position: "absolute",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: screenHeight * 0.15,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
        }}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#0ea5e9"
              />
            }
          >
            <View className="p-6 bg-white rounded-3xl">
              <View className="mb-2">
                <Text className="text-gray-800 font-semibold mb-1 text-base">
                  City
                </Text>
                <TextInput
                  className="border border-gray-300 bg-white rounded-lg p-3 text-gray-900 shadow-sm"
                  placeholder="Search city"
                  placeholderTextColor="gray"
                  onChangeText={(text) => {
                    setCity(text);
                    setPage(1);
                    handleCitySearch(text, 1);
                  }}
                  value={city}
                />
                {searchLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#0000ff"
                    style={{ marginTop: 5 }}
                  />
                )}
                {cities.length > 0 && (
                  <FlashList
                    data={cities}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setCity(item.label);
                          setZipCode(item.zip);
                          setCities([]);
                        }}
                        style={{
                          padding: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: "#ccc",
                          backgroundColor: "#f9f9f9",
                        }}
                      // className="p-4 border-b border-b-gray-400 bg-gray-100"
                      >
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    estimatedItemSize={50}
                    style={{
                      maxHeight: 150,
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 5,
                      marginTop: 5,
                    }}
                    ListFooterComponent={
                      hasMoreCities && (
                        <View
                          style={{ alignItems: "center", marginVertical: 10 }}
                        >
                          <TouchableOpacity
                            onPress={loadMoreCities}
                            style={{
                              backgroundColor: "#0284C7",
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                              borderRadius: 5,
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "bold",
                              }}
                            >
                              Load More
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )
                    }
                  />
                )}
              </View>

              <Text className="text-gray-700 mb-1 text-lg font-bold">
                Zip Code:
              </Text>
              <TextInput
                placeholderTextColor="gray"
                placeholder="Enter Zip Code"
                keyboardType="numeric"
                value={zipCode}
                onChangeText={(text) => {
                  setZipCode(text);
                  if (text.length >= 5) {
                    // Call getCity only if the zip code length is sufficient
                    getCity(text);
                  } else {
                    setCity(""); // Clear city name for incomplete zip codes
                  }
                }}
                className="border border-gray-300 rounded-md p-3 mb-4"
              />

              <Text className="text-gray-700 mb-1 text-lg font-bold">
                Total Area in Square Feet:
              </Text>
              <TextInput
                placeholderTextColor="gray"
                placeholder="Enter Total Area"
                value={area}
                onChangeText={setArea}
                className="border border-gray-300 rounded-md p-3 mb-4"
              />

              <Text className="text-gray-700 mb-1 text-lg font-bold">
                Buildable Area in Square Feet:
              </Text>
              <TextInput
                placeholderTextColor="gray"
                placeholder="Enter Buildable Area"
                value={buildableArea}
                onChangeText={setbuildableArea}
                className="border border-gray-300 rounded-md p-3 mb-4"
              />

              <Text className="text-gray-700 mb-1 text-lg font-bold">
                Number of floors
              </Text>
              <TextInput
                placeholderTextColor="gray"
                placeholder="Enter number of floor"
                value={floors}
                onChangeText={setFloors}
                className="border border-gray-300 rounded-md p-3 mb-4"
              />

              <Text className="text-gray-700 mb-2 text-lg font-bold">
                Construction Type:
              </Text>
              <ModalSelector
                data={projectTypeOptions}
                initValue={projectType || "Select Project Type"}
                onChange={(option) => setProjectType(option.label)}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  marginBottom: 16,
                }}
                initValueTextStyle={{ padding: 10, color: "#555" }}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-sky-900 mt-2 py-3 rounded-md shadow-md"
                disabled={loading}
              >
                <Text className="text-white text-center text-lg font-bold">
                  CALCULATE
                </Text>
              </TouchableOpacity>

              {totalCost && (
                <View className="mt-4">
                  <Text className="text-gray-800 text-lg font-semibold">
                    Result:
                  </Text>
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
      </View>
    </SafeAreaView>
  );
}