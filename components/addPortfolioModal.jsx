import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";

const ProfileCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    project_name: "",
    city: "",
    address: "",
    description: "",
    images: [],
  });
  const token = useSelector((state) => state.auth.token);

  const pickPortfolioImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const updatedImages = result.assets.map((asset) => asset.uri);
      setNewPortfolio((prev) => ({
        ...prev,
        images: [...prev.images, ...updatedImages],
      }));
    }
  }, []);

  const addPortfolioItem = async () => {
    const { project_name, city, address, description, images } = newPortfolio;
    if (!project_name || !city || !address || !description || images.length === 0) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("project_name", project_name);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("description", description);

    images.forEach((uri, index) => {
      formData.append("portfolio_images[]", {
        uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
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
      if (response.status === 200) {
        Alert.alert("Success", "Portfolio added successfully!");
        setModalVisible(false);
        setNewPortfolio({
          project_name: "",
          city: "",
          address: "",
          description: "",
          images: [],
        });
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      {/* Add Portfolio Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 bg-white p-6">
          <ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute right-4 top-4 p-2"
            >
              <Ionicons name="close-circle" size={40} color="black" />
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
              onPress={pickPortfolioImage}
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
            <Text className="text-gray-900 font-semibold">Selected Images:</Text>
            <ScrollView horizontal className="mt-2">
              {newPortfolio.images.length > 0 ? (
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
    </>
  );
};

export default ProfileCard;
