import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  TextInput,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../../config/apiConfig";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import SortingModal from "../../components/SortingModal";
import { useWindowDimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";

const getMimeType = (uri) => {
  const extension = uri.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
};

export default function MyPosts() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;

  const userId = useSelector((state) => state.auth.user.id);
  const token = useSelector((state) => state.auth.token);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const iconRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const openModal = () => {
    iconRef.current?.measure((_fx, _fy, _width, _height, px, py) => {
      const leftPosition = Math.min(px, width - 150);
      const topPosition = Math.min(py + _height + 5, height - 100);
      setPosition({ top: topPosition, left: leftPosition });
    });
    setModalVisible(true);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setModalVisible(false);
    setCurrentPage(1);
    fetchPosts(1);
  };

  useEffect(() => {
    fetchPosts(1);
  }, [userId, token, searchQuery]);

  const fetchPosts = async (page = 1, append = false, order = sortOrder) => {
    setLoading(true);
    try {
      const response = await API.get(
        `job-posts/${userId}&sort_order=${order}`,
        {
          params: { page, city: searchQuery, sort_order: order },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newPosts = response.data.data.data || [];
      setResults(append ? [...results, ...newPosts] : newPosts);
      setLastPage(response.data.data.last_page || 1);
    } catch {
      if (!append) setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNextPage = () => {
    if (!loading && currentPage < lastPage) {
      const prevScrollOffset = scrollOffset;
      setCurrentPage((prev) => prev + 1);
      fetchPosts(currentPage + 1, true);
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: prevScrollOffset,
          animated: false,
        });
      }, 200);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchPosts(1, false);
  };

  const onScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      fetchPosts();
      return;
    }
    try {
      const response = await API.post(
        `citie-search`,
        { city: query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filteredResults = response.data.data || [];
      setResults(filteredResults);
    } catch {
      setResults([]);
    }
  };

  const renderItem = ({ item }) => {
    let imageUrls = [];
    try {
      const parsedImages = item.design_image
        ? JSON.parse(item.design_image)
        : [];
      imageUrls = parsedImages.map((imagePath) => `${baseUrl}${imagePath}`);
    } catch {}

    return (
      <View
        className="bg-white my-2 rounded-xl overflow-hidden shadow-lg"
        style={{
          shadowColor: "#082f49",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 10,
        }}
      >
        {imageUrls.length > 0 && (
          <FlatList
            horizontal
            data={imageUrls}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item: url }) => (
              <View style={{ width: postContentWidth, height: 150 }}>
                <Image
                  source={{ uri: url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={postContentWidth}
            decelerationRate="fast"
          />
        )}
        <View className="flex-row justify-between p-3">
          <View>
            <Text className="text-2xl font-bold text-sky-950">
              ${parseFloat(item.total_cost).toLocaleString()}
            </Text>
            <Text className="text-lg text-semiBold text-gray-600">
              #{item.zipcode}, {item.city}
            </Text>
            <Text>{item.area} sqft</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold">
              {item.project_type} Apartment
            </Text>
            <TouchableOpacity
              className="bg-sky-950 px-4 py-2 rounded-full mt-3"
              onPress={() => {
                setEditingPost(item);
                setEditModalVisible(true);
              }}
            >
              <Text className="text-white font-semibold text-sm">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const EditPostModal = () => {
    const [area, setArea] = useState(editingPost.area);
    const [cost, setCost] = useState(editingPost.total_cost);
    const [zipcode, setZipcode] = useState(editingPost.zipcode);
    const [projectType, setProjectType] = useState(editingPost.project_type);
    const [description, setDescription] = useState(editingPost.description);
    const [images, setImages] = useState(
      editingPost.design_image ? JSON.parse(editingPost.design_image) : []
    );

    const handleImagePick = async (index) => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const updatedImages = [...images];
        updatedImages[index] = result.assets[0].uri;
        setImages(updatedImages);
      }
    };

    const handleUpdate = async () => {
      const formData = new FormData();
      formData.append("area", area);
      formData.append("total_cost", cost);
      formData.append("zipcode", zipcode);
      formData.append("project_type", projectType);
      formData.append("description", description);

      images.forEach((img, index) => {
        if (img.startsWith("file://")) {
          const type = getMimeType(img);
          const name = img.split("/").pop() || `design_${index}.jpg`;
          formData.append("design_image[]", { uri: img, name, type });
        }
      });

      try {
        await API.post(`job-post/update/${editingPost.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Post updated successfully");
        setEditModalVisible(false);
        handleRefresh();
      } catch (err) {
        console.log("Update error:", err.response?.data || err.message);
        Alert.alert("Error", "Failed to update post");
      }
    };

    return (
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white w-full max-w-md rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-semibold text-black">
                Edit Portfolio
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-6 relative">
              <TouchableOpacity onPress={() => handleImagePick(0)}>
                <Image
                  source={{
                    uri:
                      images[0]?.startsWith("http") ||
                      images[0]?.startsWith("file:")
                        ? images[0]
                        : `${baseUrl}${images[0]}`,
                  }}
                  className="w-24 h-24 rounded-full bg-gray-200"
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 right-0 bg-sky-900 p-2 rounded-full border border-white">
                  <Ionicons name="pencil" size={16} color="white" />
                </View>
              </TouchableOpacity>
              {!images[0] && (
                <Text className="text-sm text-gray-500 mt-2">No photo yet</Text>
              )}
            </View>

            {[
              ["Project Name", projectType, setProjectType],
              ["Description", description, setDescription],
              ["Address", area, setArea],
              ["Zipcode", zipcode, setZipcode],
            ].map(([label, val, setter], idx) => (
              <View key={idx} className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">{label}</Text>
                <TextInput
                  value={val}
                  onChangeText={setter}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                  placeholder={`Enter ${label}`}
                />
              </View>
            ))}

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="bg-gray-200 px-6 py-3 rounded-lg"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                className="bg-sky-900 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.45 }}
      >
        <View className="mt-5">
          <TouchableOpacity
            className="absolute top-6 z-10 left-5"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white py-4 text-center">
            My Post
          </Text>
        </View>

        <View className="mx-5">
          <View
            className="bg-white rounded-full flex-row items-center"
            style={{
              height: screenHeight * 0.06,
              paddingHorizontal: screenWidth * 0.04,
            }}
          >
            <Ionicons name="search" size={18} color="black" />
            <TextInput
              placeholder="Search by City"
              placeholderTextColor="gray"
              className="flex-1 text-lg text-black"
              style={{
                fontSize: 14,
                marginLeft: screenWidth * 0.03,
                paddingVertical: Platform.OS === "android" ? 6 : 12,
              }}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <SortingModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSelect={handleSort}
              position={position}
            />
          </View>
        </View>
      </LinearGradient>

      <View
        className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -screenHeight * 0.28,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
          overflow: "hidden",
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : results.length > 0 ? (
            <FlatList
              ref={flatListRef}
              showsVerticalScrollIndicator={false}
              data={results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              refreshing={loading}
              onRefresh={handleRefresh}
              onScroll={onScroll}
              onEndReached={loadNextPage}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                loading && currentPage > 1 ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : null
              }
            />
          ) : (
            <View className="flex-1 justify-center items-center gap-4">
              <Text className="text-gray-500 text-lg">
                {searchQuery
                  ? `No posts found for "${searchQuery}"`
                  : "No posts available"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  className="bg-sky-950 px-6 py-3 rounded-lg"
                  onPress={() => router.push("/")}
                >
                  <Text className="text-white font-semibold text-lg">
                    Create a Post
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {editModalVisible && <EditPostModal />}
    </SafeAreaView>
  );
}
