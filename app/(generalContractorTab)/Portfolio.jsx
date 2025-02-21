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

const PortfolioScreen = ({ navigation }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
 

  const router = useRouter();
  const [newPortfolio, setNewPortfolio] = useState({
    project_name: "",
    city: "",
    address: "",
    description: "",
    images: [],
    imageNames: [],
  });

  const token = useSelector((state) => state.auth.token);

  // Fetch Portfolio Function
  const fetchPortfolio = async (page = 1) => {
    try {
      console.log("Fetching user details...");

      const userResponse = await axios.post(
        "https://g32.iamdeveloper.in/api/user-detail",
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

      console.log("User details fetched successfully:", userResponse.data);
      const contractorId = userResponse.data?.id;

      if (!contractorId) throw new Error("Contractor ID is missing");

      console.log(
        `Fetching portfolios for contractor ID: ${contractorId}, Page: ${page}`
      );

      const portfolioResponse = await axios.get(
        `https://g32.iamdeveloper.in/api/portfolios/contractor/${contractorId}?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (portfolioResponse.status !== 200)
        throw new Error("Failed to fetch portfolios");

      console.log("Fetched portfolio data:", portfolioResponse.data);
      const portfolios = portfolioResponse.data.portfolios;

      if (!portfolios?.data || !Array.isArray(portfolios.data)) {
        throw new Error("Invalid portfolio data format");
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
      Alert.alert("API Error", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortfolio();
    }
  }, [token]);

  // Add Portfolio Item Function
  const addPortfolioItem = async () => {
    console.log("New Portfolio Data:", newPortfolio);

    if (
      !newPortfolio.project_name.trim() ||
      !newPortfolio.city.trim() ||
      !newPortfolio.address.trim() ||
      !newPortfolio.description.trim() ||
      newPortfolio.images.length === 0
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      let formData = new FormData();

      formData.append("project_name", newPortfolio.project_name);
      formData.append("city", newPortfolio.city);
      formData.append("address", newPortfolio.address);
      formData.append("description", newPortfolio.description);

      newPortfolio.images.forEach((uri, index) => {
        formData.append(`portfolio_images[]`, {
          uri,
          name: newPortfolio.imageNames[index] || `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      console.log("Form Data being sent:", formData);

      const response = await axios.post(
        "https://g32.iamdeveloper.in/api/portfolio/store",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);
      Alert.alert("Success", "Portfolio added successfully!", [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false); // Close modal
            fetchPortfolio();
            setNewPortfolio({
              // Reset input fields
              project_name: "",
              city: "",
              address: "",
              description: "",
              images: [],
              imageNames: [],
            });
          },
        },
      ]);

      if (response.status === 200) {
        fetchPortfolio(); // Fetch updated data from API
        setModalVisible(false);
        setNewPortfolio({
          project_name: "",
          city: "",
          address: "",
          description: "",
          images: [],
          imageNames: [],
        });
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      Alert.alert(
        "API Error",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPortfolio();
    }, [])
  );

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
      console.log("Selected Images:", result.assets);

      setNewPortfolio((prev) => ({
        ...prev,
        images: [...prev.images, ...result.assets.map((asset) => asset.uri)],
        imageNames: [
          ...prev.imageNames,
          ...result.assets.map(
            (asset) => asset.fileName || `image_${Date.now()}.jpg`
          ),
        ],
      }));
    }
  };

  const CitySearchModal = ({
    modalVisible,
    setModalVisible,
    newPortfolio,
    setNewPortfolio,
    fetchPortfolio,
    pickImage,
    addPortfolioItem,
  }) => {
   

   
   
  };
  const fetchCities = async (page = 1, query = "") => {
    try {
      const response = await axios.post(
        `https://g32.iamdeveloper.in/api/citie-search?page=${page}&search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Full API Response:", response.data); 
  
      if (!response.data || !response.data.cities) {
        throw new Error("Empty response or missing 'cities' field");
      }
  
      // If first page, reset cities. Otherwise, append results.
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
  
  

  return (
    <View className="flex-1 bg-white">
      <View className="bg-sky-950 p-4 h-24 mt-12 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 bg-white p-4 text-gray-900 rounded-lg ml-4"
          placeholder="Search portfolio..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View className="mt-6 px-4 w-full">
        <View className="flex-row gap-2 mb-2 items-center">
          <Text className="font-bold text-xl text-sky-950 tracking-widest">
            Portfolio
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="skyblue" className="mt-10" />
        ) : (
          <FlatList
            className="mb-48"
            data={portfolioItems.filter((item) =>
              item.name.toLowerCase().includes(searchText.toLowerCase())
            )}
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
          />
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-6">
          <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                fetchPortfolio();
                setModalVisible(false);
              }}
              className="absolute top-0 right-4 p-2"
            >
              <Ionicons name="close-circle" size={50} color="gray" />
            </TouchableOpacity>

            <Text className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Add Portfolio
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Project Name */}
              <TextInput
                placeholder="Project Name"
                placeholderTextColor="gray"
                value={newPortfolio.project_name}
                onChangeText={(text) =>
                  setNewPortfolio({ ...newPortfolio, project_name: text })
                }
                className="border border-gray-300 p-3 rounded-lg mb-4 text-gray-700"
              />

              {/* City Input with API Search */}
              <TextInput
                placeholder="City Name"
                placeholderTextColor="gray"
                value={cityQuery}
                onChangeText={(text) => {
                  setCityQuery(text);
                  fetchCities(text);
                }}
                className="border border-gray-300 p-3 rounded-lg mb-4 text-gray-700"
              />

              {/* City Suggestions */}
              {citySuggestions.length > 0 && (
                <FlatList
                  data={citySuggestions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setNewPortfolio({ ...newPortfolio, city: item });
                        setCityQuery(item);
                        setCitySuggestions([]); // Hide suggestions after selection
                      }}
                      className="p-2 border-b border-gray-200"
                    >
                      <Text className="text-gray-700">{item}</Text>
                    </TouchableOpacity>
                  )}
                  className="bg-white border border-gray-300 rounded-lg max-h-40"
                />
              )}

              {/* Address */}
              <TextInput
                placeholder="Address"
                placeholderTextColor="gray"
                value={newPortfolio.address}
                onChangeText={(text) =>
                  setNewPortfolio({ ...newPortfolio, address: text })
                }
                className="border border-gray-300 p-3 rounded-lg mb-4 text-gray-700"
              />

              {/* Description */}
              <TextInput
                placeholder="Description"
                placeholderTextColor="gray"
                value={newPortfolio.description}
                onChangeText={(text) =>
                  setNewPortfolio({ ...newPortfolio, description: text })
                }
                multiline
                numberOfLines={4}
                className="border border-gray-300 p-3 rounded-lg mb-6 text-gray-700 h-32"
              />

              {/* Pick Image Button */}
              <TouchableOpacity
                onPress={pickImage}
                className="p-4 bg-sky-950 rounded-lg mb-6 flex-row justify-center items-center"
              >
                <Ionicons name="image" size={24} color="white" />
                <Text className="text-white text-center font-semibold ml-2">
                  Pick an Image
                </Text>
              </TouchableOpacity>

              {/* Add Portfolio Button */}
              <TouchableOpacity
                onPress={addPortfolioItem}
                className="p-4 bg-sky-950 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Add Portfolio
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Selected Images Preview */}
            <View className="mt-4">
              <Text className="text-gray-800 font-semibold">
                Selected Images:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-2"
              >
                {newPortfolio.images && newPortfolio.images.length > 0 ? (
                  newPortfolio.images.map((image, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri: image }}
                        className="w-20 h-20 m-2 rounded-lg border-2 border-gray-200"
                      />

                      <TouchableOpacity
                        onPress={() => {
                          const updatedImages = newPortfolio.images.filter(
                            (img, imgIndex) => imgIndex !== index
                          );
                          setNewPortfolio({
                            ...newPortfolio,
                            images: updatedImages,
                          });
                        }}
                        className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md"
                      >
                        <Ionicons name="close-circle" size={20} color="gray" />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500">No images selected</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PortfolioScreen;
