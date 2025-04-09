import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddPortfolioModal from "../../components/addPortfolioModal";
import { useRouter } from "expo-router";
import { API, baseUrl } from "../../config/apiConfig";
import { Alert } from "react-native";

const ProfileCard = () => {
  const token = useSelector((state) => state.auth.token);
  const navigation = useNavigation();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: null,
    fetching: false,
  });

  const defaultHomeImage = require("../../assets/images/AC5D_Logo.jpg");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await API.post(
          "user-detail",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        setUserData({
          ...data,
          upload_organisation: data.upload_organisation
            ? `${baseUrl}${data.upload_organisation}`
            : null,
          image: data.image ? `${baseUrl}${data.image}` : null,
        });
      } catch (error) {
        console.log("Failed to load user data:", error);
        // Alert.alert("Error", "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  // Fetch portfolios
  useEffect(() => {
    if (userData?.id) fetchPortfolios(1, true);
  }, [userData]);

  const fetchPortfolios = async (page, reset = false) => {
    if (
      pagination.fetching ||
      (pagination.lastPage && page > pagination.lastPage)
    )
      return;

    try {
      setPagination((prev) => ({ ...prev, fetching: true }));
      const response = await API.get(
        `portfolios/contractor/${userData.id}?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { portfolios } = response.data;
      setPortfolios((prev) =>
        reset ? portfolios.data : [...prev, ...portfolios.data]
      );
      setPagination({
        currentPage: portfolios.current_page,
        lastPage: portfolios.last_page,
        fetching: false,
      });
    } catch (error) {
      console.log("Error fetching portfolios:", error);
      // Alert.alert("Error", "Failed to load portfolios");
      setPagination((prev) => ({ ...prev, fetching: false }));
    }
  };

  // Add portfolio
  const addPortfolioItem = async (newData) => {
    try {
      const formData = new FormData();
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

      const response = await API.post("portfolio/store", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        Alert.alert("Success", "Portfolio added successfully!", [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              fetchPortfolios(1, true);
            },
          },
        ]);
      }
    } catch (error) {
      console.log("Error adding portfolio:", error.response?.data || error);
      // Alert.alert("Error", "Failed to add portfolio");
    }
  };

  // Render portfolio item
  const renderPortfolioItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm flex-row items-center"
      onPress={() => navigation.navigate("PortfolioDetail", { id: item.id })}
    >
      <Image
        source={{
          uri: `https://g32.iamdeveloper.in/public/${
            JSON.parse(item.portfolio_images)[0]
          }`,
        }}
        className="w-24 h-24 rounded-lg mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">
          {item.project_name}
        </Text>
        <Text className="text-gray-600 text-sm">
          {item.city}, {item.address}
        </Text>
        <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#0369a1" />
    </TouchableOpacity>
  );

  if (loading || !userData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0369a1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with Organization Image */}
      <View className="relative">
        <Image
          source={
            userData.upload_organisation
              ? { uri: userData.upload_organisation }
              : defaultHomeImage
          }
          className="w-full h-56"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-12 left-4 bg-white p-2 rounded-full shadow-md"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0369a1" />
        </TouchableOpacity>
        <View className="absolute bottom-[-40] left-6">
          <Image
            source={{
              uri: userData.image || "https://via.placeholder.com/150",
            }}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
        </View>
      </View>

      {/* User Details Card */}
      <View className="bg-white mx-4 mt-12 p-6 rounded-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-3">
          Personal Information
        </Text>
        <View className="space-y-2">
          <Text className="text-gray-700 text-base">{userData.name}</Text>
          {userData.email && (
            <Text className="text-gray-600 text-base">{userData.email}</Text>
          )}
          {userData.number && (
            <Text className="text-gray-600 text-base">{userData.number}</Text>
          )}
          {(userData.address || userData.city) && (
            <Text className="text-gray-600 text-base">
              {userData.address ? `${userData.address}, ` : ""}
              {userData.city || ""}
            </Text>
          )}
          {userData.company_name && (
            <Text className="text-gray-700 font-semibold text-base mt-2">
              {userData.company_name
                ? `${userData.company_name}`
                : "Company Name not defined !"}
            </Text>
          )}
          {/* {userData.company_address && (
            <Text className="text-gray-600 text-base">
              {userData.company_address}
            </Text>
          )} */}
        </View>
      </View>

      {/* Portfolio Section */}
      <View className="flex-1 mx-4 mt-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-semibold text-gray-800">
            Portfolios
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={28} color="#0369a1" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={portfolios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPortfolioItem}
          onEndReached={() => fetchPortfolios(pagination.currentPage + 1)}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center py-4">
              No portfolios yet
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Add Portfolio Modal */}
      {modalVisible && (
        <AddPortfolioModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onClose={() => setModalVisible(false)}
          addPortfolioItem={addPortfolioItem}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileCard;
