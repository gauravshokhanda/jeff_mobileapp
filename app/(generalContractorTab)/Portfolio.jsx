import React, { useState, useEffect } from "react";
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

const PortfolioScreen = ({ navigation }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    project_name: "",
    city: "",
    address: "",
    description: "",
    images: [], // Ensure images is always an array
    imageNames: [],
  });

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        console.log("Token being sent:", token);
        const response = await axios.post(
          "https://g32.iamdeveloper.in/api/user-detail",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const userData = response.data;
          const portfolioImages = JSON.parse(userData.portfolio || "[]");
          const portfolioData = portfolioImages.map((image, index) => ({
            id: index.toString(),
            image: `https://g32.iamdeveloper.in/public/${image}`,
            name: userData.project_name || `Project ${index + 1}`,
            description: userData.description || "No description available.",
            year: new Date(userData.created_at).getFullYear().toString(),
          }));
          setPortfolioItems(portfolioData);
        }
      } catch (error) {
        Alert.alert(
          "API Error",
          error.response?.data?.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPortfolio();
    }
  }, [token]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // iOS supports this, Android may not
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      console.log("Selected Images:", result.assets);

      setNewPortfolio((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          ...result.assets.map((asset) => asset.uri),
        ], // Ensure it's always an array
        imageNames: [
          ...(prev.imageNames || []),
          ...result.assets.map(
            (asset) => asset.fileName || `image_${Date.now()}.jpg`
          ),
        ],
      }));
    }
  };

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

      // Append each image separately with the same key name
      newPortfolio.images.forEach((uri, index) => {
        formData.append(`portfolio_images[]`, {
          uri,
          name: newPortfolio.imageNames[index] || `image_${index}.jpg`,
          type: "image/jpeg", // Adjust as needed
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

      console.log("API Response:", response.data); // Log the response
      Alert.alert("Success", JSON.stringify(response.data, null, 2)); // Show response in an alert

      if (response.status === 200) {
        setPortfolioItems([
          ...portfolioItems,
          {
            id: Date.now().toString(),
            ...newPortfolio,
            year: new Date().getFullYear().toString(),
          },
        ]);
        setModalVisible(false);
        setNewPortfolio({
          project_name: "",
          city: "",
          address: "",
          description: "",
          images: [],
          portfolio_images: [],
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
        <View className="flex-row gap-2 items-center">
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
            data={portfolioItems.filter((item) =>
              item.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="flex-row p-4 my-3 gap-3 items-center bg-gray-100 rounded-lg shadow-sm">
                <Image
                  source={{ uri: item.image }}
                  className="w-32 h-32 rounded-lg"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="text-gray-700 mt-1">{item.description}</Text>
                  <Text className="text-black font-semibold mt-2">
                    Year: {item.year}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Add Portfolio Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 bg-white p-6">
          <ScrollView>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute right-4 top-4 p-2"
            >
              <Ionicons name="close-circle" size={30} color="black" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-gray-900 mb-4 mt-10 text-center">
              Add Portfolio Item
            </Text>

            <TextInput
              placeholder="Project Name"
              placeholderTextColor="gray"
              value={newPortfolio.project_name}
              onChangeText={(text) =>
                setNewPortfolio({ ...newPortfolio, project_name: text })
              }
              className="border p-2 rounded-lg mb-3"
            />

            <TextInput
              placeholder="City"
              placeholderTextColor="gray"
              value={newPortfolio.city}
              onChangeText={(text) =>
                setNewPortfolio({ ...newPortfolio, city: text })
              }
              className="border p-2 rounded-lg mb-3"
            />

            <TextInput
              placeholder="Address"
              placeholderTextColor="gray"
              value={newPortfolio.address}
              onChangeText={(text) =>
                setNewPortfolio({ ...newPortfolio, address: text })
              }
              className="border p-2 rounded-lg mb-3"
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor="gray"
              value={newPortfolio.description}
              onChangeText={(text) =>
                setNewPortfolio({ ...newPortfolio, description: text })
              }
              className="border p-2 rounded-lg mb-3"
            />

            <TouchableOpacity
              onPress={pickImage}
              className="p-3 bg-sky-950 rounded-lg"
            >
              <Text className="text-white text-center">Pick an Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={addPortfolioItem}
              className="p-3 bg-sky-950 mt-3 rounded-lg"
            >
              <Text className="text-white text-center">Add Portfolio</Text>
            </TouchableOpacity>
          </ScrollView>

          <View className="mt-3">
            <Text className="text-gray-900 font-semibold">
              Selected Images:
            </Text>
            <ScrollView horizontal className="mt-2">
              {newPortfolio.images && newPortfolio.images.length > 0 ? (
                newPortfolio.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    className="w-24 h-24 m-2 rounded-lg"
                  />
                ))
              ) : (
                <Text className="text-gray-500">No images selected</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PortfolioScreen;
