import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API, baseUrl } from "../../config/apiConfig";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function PropertyDetails() {
    console.log("my listing page open");
  const { id } = useLocalSearchParams();
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const [selectedPropertyType, setSelectedPropertyType] = useState("detail");
  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [designImages, setDesignImages] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const [newImages, setNewImages] = useState([]);

  const propertyTypes = [
    { id: "detail", label: "Detail" },
    { id: "gallery", label: "Gallery" },
  ];

  const labeledFields = [
    { key: "address", label: "Address" },
    { key: "property_type", label: "Property Type" },
    { key: "house_type", label: "House Type" },
    { key: "area", label: "Area (sqft)" },
    { key: "locale", label: "Locality" },
    { key: "price", label: "Price" },
    { key: "furnish_type", label: "Furnish Type" },
    { key: "bhk", label: "BHK" },
  ];

  const handleFetchListing = async () => {
    try {
      const response = await API.get(`realstate-property/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.property) {
        const propertyData = response.data.property;
        const imagePaths = JSON.parse(propertyData.property_images || "[]");
        const imagesWithUrls = imagePaths.map((img) => `${baseUrl}/${img}`);

        setProperty(propertyData);
        setEditData({ ...propertyData });
        setMainImage(imagesWithUrls[0] || null);
        setDesignImages(imagesWithUrls);
        setNewImages([...imagesWithUrls]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleFetchListing();
  }, [token, id]);

  const handleImageReplace = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const updated = [...newImages];
      updated[index] = result.assets[0].uri;
      setNewImages(updated);
    }
  };

  const handleAddAnotherImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setNewImages([...newImages, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleUpdateProperty = async () => {
    const formData = new FormData();

    Object.entries(editData).forEach(([key, value]) => {
      if (key !== "property_images" && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Send server image paths that remain
    const remainingImagePaths = designImages.map((img) =>
      img.replace(`${baseUrl}/`, "")
    );
    remainingImagePaths.forEach((img) =>
      formData.append("property_images[]", img)
    );

    // Send new images only
    newImages.forEach((uri) => {
      const name = uri.split("/").pop();
      const type = `image/${name.split(".").pop()}`;
      formData.append("images[]", {
        uri,
        name,
        type,
      });
    });

    try {
      await API.post(`realstate-property/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEditModalVisible(false);
      handleFetchListing();
      Alert.alert("Success", "Property updated successfully");
    } catch (error) {
      Alert.alert("Error", "Update failed");
      console.error("update error", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="absolute z-10 w-full flex-row mt-20 justify-between p-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-700 rounded-full p-2"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setEditModalVisible(true)}
          className="bg-sky-900 rounded-full p-2"
        >
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Main Image */}
        {mainImage && (
          <Image source={{ uri: mainImage }} className="w-full h-60" />
        )}

        {/* Thumbnail Gallery */}
        <View className="flex-row mt-3 px-3">
          {designImages.map((img, index) => (
            <TouchableOpacity key={img} onPress={() => setMainImage(img)}>
              <Image
                source={{ uri: img }}
                className="mr-2 rounded-lg"
                style={{
                  height: screenHeight * 0.1,
                  width: screenWidth * 0.25,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Property Tabs */}
        <View className="mt-4 p-4 bg-white rounded-lg mx-2 flex-row justify-center">
          {propertyTypes.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`px-6 py-2 border-b-2 ${selectedPropertyType === item.id
                  ? "border-sky-900"
                  : "border-gray-300"
                }`}
              onPress={() => setSelectedPropertyType(item.id)}
            >
              <Text
                className={`text-lg font-medium ${selectedPropertyType === item.id
                    ? "text-sky-900"
                    : "text-gray-400"
                  }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Property Content */}
        <View className="px-4 mt-4">
          {selectedPropertyType === "detail" ? (
            labeledFields.map((field) => (
              <View key={field.key} className="flex-row justify-between mb-3">
                <Text className="font-semibold w-[40%]">{field.label}:</Text>
                <Text className="text-gray-700 w-[60%]">
                  {property?.[field.key] || "-"}
                </Text>
              </View>
            ))
          ) : (
            <View className="flex-row flex-wrap justify-between gap-3">
              {designImages.map((img, idx) => (
                <Image
                  key={img}
                  source={{ uri: img }}
                  className="rounded-lg"
                  style={{
                    width: "48%",
                    height: 150,
                    marginBottom: 10,
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={editModalVisible} animationType="slide">
        <SafeAreaView className="flex-1 p-4 bg-white">
          {/* Modal Close Icon */}
          <TouchableOpacity
            onPress={() => setEditModalVisible(false)}
            style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
          >
            <Ionicons name="close-circle" size={30} color="gray" className="mt-16" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{ paddingTop: 40, paddingHorizontal: screenWidth * 0.08 }}>
            <Text className="text-2xl font-bold mb-4">Edit Property</Text>

            {labeledFields.map((field) => (
              <View key={field.key} className="mb-3">
                <Text className="font-semibold mb-1">{field.label}</Text>
                <TextInput
                  value={editData[field.key]}
                  onChangeText={(text) =>
                    setEditData((prev) => ({ ...prev, [field.key]: text }))
                  }
                  placeholder={`Enter ${field.label}`}
                  className="border border-gray-300 rounded px-3 py-2"
                />
              </View>
            ))}

            <Text className="font-semibold mt-5 mb-2">Images</Text>
            <View className="flex-row flex-wrap">
              {/* Existing Server Images (designImages) */}
              {designImages.map((img, index) => (
                <View key={img + index} style={{ margin: 5 }}>
                  <Image
                    source={{ uri: img }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const updated = [...designImages];
                      updated.splice(index, 1);
                      setDesignImages(updated);
                    }}
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: "red",
                      borderRadius: 10,
                      padding: 2,
                      zIndex: 1,
                    }}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Newly Added Images (newImages) */}
              {newImages.map((uri, index) => (
                <View key={uri + index} style={{ margin: 5 }}>
                  <Image
                    source={{ uri }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const updated = [...newImages];
                      updated.splice(index, 1);
                      setNewImages(updated);
                    }}
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: "red",
                      borderRadius: 10,
                      padding: 2,
                      zIndex: 1,
                    }}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Plus Icon to Add */}
              <TouchableOpacity
                onPress={handleAddAnotherImage}
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#e2e8f0",
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 5,
                }}
              >
                <Ionicons name="add" size={36} color="#475569" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mt-6 px-1">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="bg-gray-500 w-[48%] p-3 rounded"
              >
                <Text className="text-white text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateProperty}
                className="bg-sky-900 w-[48%] p-3 rounded"
              >
                <Text className="text-white text-center font-semibold">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
