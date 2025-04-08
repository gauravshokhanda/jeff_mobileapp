import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  SafeAreaView,
  Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { debounce } from "lodash";
import CitySearch from "../../components/CitySearch";
import { API } from "../../config/apiConfig";
import { LinearGradient } from 'expo-linear-gradient';
import ContractorPortfolioModal from "../../components/ContractorPortfolioModal";

const Portfolio = ({ navigation }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cityQuery, setCityQuery] = useState("");

  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const [newPortfolio, setNewPortfolio] = useState({
    projectName: "",
    cityName: "",
    address: "",
    description: "",
    selectedImages: [],
    imageNames: [],
  });

  // Function to parse search input into project name and city
  const parseSearchInput = (input) => {
    const words = input.trim().split(/\s+/);
    let projectName = "";
    let city = "";

    if (words.length > 1) {
      city = words.pop();
      projectName = words.join(" ");
    } else {
      projectName = words[0] || "";
    }

    return { projectName, city };
  };

  // Fetch Portfolio Function with search params
  const fetchPortfolio = async (page = 1, searchQuery = "") => {
    if (!token) return; // Prevent API call if no token

    try {
      setLoading(true);
      const userResponse = await API.post(
        "user-detail",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (userResponse.status !== 200)
        throw new Error("Failed to fetch user details");

      const contractorId = userResponse.data?.id;

      if (!contractorId) throw new Error("Contractor ID is missing");

      const { projectName, city } = parseSearchInput(searchQuery);

      // Build the API URL with query parameters
      let apiUrl = `portfolios/contractor/${contractorId}?page=${page}`;
      if (projectName) apiUrl += `&project_name=${encodeURIComponent(projectName)}`;
      if (city) apiUrl += `&city=${encodeURIComponent(city)}`;

      const portfolioResponse = await API.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (portfolioResponse.status !== 200) {
        if (portfolioResponse.status === 404) {
          setPortfolioItems([]); // Clear items on 404 instead of throwing error
          return;
        }
        throw new Error("Failed to fetch portfolios");
      }

      const portfolios = portfolioResponse.data.portfolios;

      if (!portfolios?.data || !Array.isArray(portfolios.data)) {
        setPortfolioItems([]); // Set empty array if data format is invalid
        return;
      }

      const formattedData = portfolios.data.map((item) => {
        let images = [];
        try {
          images = JSON.parse(item.portfolio_images || "[]");
        } catch (err) {
          console.error("Error parsing portfolio images:", err);
        }

        return {
          id: String(item.id),
          name: item.project_name || "No Name",
          description: item.description || "No description available",
          image: images.length
            ? `https://g32.iamdeveloper.in/public/${images[0]}`
            : "https://via.placeholder.com/150",
          year: item.created_at
            ? new Date(item.created_at).getFullYear()
            : "N/A",
        };
      });

      setPortfolioItems(formattedData);
      setCurrentPage(portfolios.current_page);
      setLastPage(portfolios.last_page);
    } catch (error) {
      console.error("API Error:", error);
      if (error.response?.status !== 404) {
        Alert.alert("API Error", error.message || "An error occurred");
      }
      setPortfolioItems([]); // Clear items on error
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchPortfolio(1, query);
    }, 500),
    [token]
  );

  // Handle search input changes
  const handleSearch = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const addPortfolioItem = async (newData) => {
    if (
      !newData.projectName.trim() ||
      !newData.cityName.trim() ||
      !newData.address.trim() ||
      !newData.description.trim() ||
      newData.selectedImages.length === 0
    ) {
      Alert.alert("Error", "All fields are required, including at least one image.");
      return;
    }

    try {
      let formData = new FormData();
      formData.append("project_name", newData.projectName);
      formData.append("city", newData.cityName);
      formData.append("address", newData.address);
      formData.append("description", newData.description);

      newData.selectedImages.forEach((uri, index) => {
        formData.append(`portfolio_images[]`, {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const response = await API.post(
        "portfolio/store",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        Alert.alert("Success", "Portfolio added successfully!", [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              fetchPortfolio();
            },
          },
        ]);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      Alert.alert("API Error", error.response?.data?.message || "An error occurred");
    }
  };

  // Pick Image Function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setNewPortfolio((prev) => ({
        ...prev,
        selectedImages: [...prev.selectedImages, ...result.assets.map((asset) => asset.uri)],
        imageNames: [
          ...prev.imageNames,
          ...result.assets.map(
            (asset) => asset.fileName || `image_${Date.now()}.jpg`
          ),
        ],
      }));
    }
  };

  const fetchCities = async (page = 1, query = "") => {
    try {
      const response = await API.post(
        `citie-search?page=${page}&search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data || !response.data.cities) {
        throw new Error("Empty response or missing 'cities' field");
      }

      setCitySuggestions((prev) =>
        page === 1 ? response.data.cities : [...prev, ...response.data.cities]
      );

      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("Error fetching cities:", error.response || error);
      Alert.alert("Error", "Failed to fetch cities.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortfolio(); // Initial fetch
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchPortfolio();
      }
    }, [token])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={['#082f49', 'transparent']}
        style={{ height: screenHeight * 0.4 }}
      >
        <View className="mt-8 px-4">
          <Text className="text-2xl font-semibold text-white ml-5">My Portfolio</Text>
        </View>
        <View className="ml-5 mt-5 items-end">
          <View className="bg-gray-100 h-12 mr-5 rounded-full px-3 flex-row items-center justify-between">
            <Ionicons name="search" size={18} color="black" />
            <TextInput
              placeholder="Search (e.g., New project ATLANTA)"
              placeholderTextColor={"gray"}
              style={{ fontSize: 14 }}
              className="flex-1 ml-5 text-lg"
              value={searchText}
              onChangeText={handleSearch}
            />
            <Ionicons name="filter-sharp" size={26} color="black" />
          </View>
        </View>
      </LinearGradient>

      <View
        className="rounded-3xl"
        style={{
          position: 'absolute',
          top: screenHeight * 0.20,
          width: postContentWidth,
          height: screenHeight * 0.80,
          left: (screenWidth - postContentWidth) / 2,
          backgroundColor: 'white',
        }}
      >
        <View className="mt-6 px-4 w-full">
          <View className="flex-row gap-2 mb-2 items-center">
            <Text className="font-bold text-xl text-sky-950 tracking-widest">
              Portfolios
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle" size={30} color="gray" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="skyblue" className="mt-10" />
          ) : portfolioItems.length === 0 ? (
            <Text className="text-center text-gray-500 mt-10">
              No portfolios found
            </Text>
          ) : (
            <FlatList
              className="mb-48"
              data={portfolioItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/PortfolioDetail?id=${item.id}`)}
                >
                  <View className="flex-row p-4 my-3 gap-3 items-center bg-gray-200 rounded-lg shadow-sm">
                    <Image
                      source={{ uri: item.image }}
                      className="w-32 h-32 rounded-lg"
                    />
                    <View className="ml-4 flex-1">
                      <Text className="text-lg font-bold text-gray-900">
                        {item.name}
                      </Text>
                      <Text className="text-gray-700 mt-1">
                        {item.description}
                      </Text>
                      <Text className="text-black font-semibold mt-2">
                        Year: {item.year}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              refreshing={loading}
              onRefresh={() => fetchPortfolio()}
            />
          )}
        </View>
      </View>

      <ContractorPortfolioModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        setPortfolioData={setNewPortfolio}
        addPortfolioItem={addPortfolioItem}
      />
    </SafeAreaView>
  );
};

export default Portfolio;