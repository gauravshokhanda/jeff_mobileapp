import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  Dimensions
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import * as ImagePicker from "expo-image-picker";
import EditPortfolioModal from "../../components/EditPortfolioModal";
import { API } from "../../config/apiConfig";
import { LinearGradient } from 'expo-linear-gradient';

const PortfolioDetail = () => {
  const { id } = useLocalSearchParams();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    type: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const fetchPortfolioDetails = async () => {
      console.log("fetchportfolio function")
      console.log("portfolio details", id)
      if (!id || !token) return;
      try {
        const response = await API.get(`portfolios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setPortfolio(response.data.portfolio);
          setFormData({
            project_name: response.data.portfolio.project_name,
            description: response.data.portfolio.description,
            type: response.data.portfolio.type,
            address: response.data.portfolio.address,
            city: response.data.portfolio.city,
          });
        }
      } catch (error) {
        console.error("Error fetching portfolio details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioDetails();
  }, [id, token, modalVisible]);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this portfolio?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await API.delete(`portfolio/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert("Success", "Portfolio deleted!", [
                { text: "OK", onPress: () => router.push("Portfolio") },
              ]);
            } catch (error) {
              console.error("Error deleting portfolio:", error);
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append selected image
      if (selectedImage) {
        const localUri = selectedImage;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const ext = match ? match[1].toLowerCase() : '';
        const type = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;

        formDataToSend.append('portfolio_images[]', {
          uri: Platform.OS === 'ios' ? localUri.replace('file://', '') : localUri,
          name: filename,
          type: type,
        });
      } else {
        console.log('No new image selected');
      }

      const response = await API.post(`portfolio/update/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Server response:', response.data);

      Alert.alert('Success', 'Portfolio updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setSelectedImage(null);
            setLoading(true);
            setPortfolio(null);
            setTimeout(() => {
              router.replace(`/PortfolioDetail?id=${id}`);
            }, 100);
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Update failed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update portfolio. Try again.');
    }
  };




  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-10" />;
  }

  if (!portfolio) {
    return (
      <Text className="text-center text-red-500 mt-10">
        Portfolio not found
      </Text>
    );
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.14, paddingTop: Platform.OS === "ios" ? 50 : 20 }}
      >
        <View className="px-4 flex-row items-center justify-between">

          {/* Left: Back Button */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white p-2 rounded-full shadow"
            >
              <Feather name="arrow-left" size={22} color="#082f49" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-white ml-2">
              Portfolio Details
            </Text>
          </View>

          {/* Right: Edit and Delete buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-white p-2 rounded-full shadow"
            >
              <Feather name="edit-2" size={20} color="#082f49" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-white p-2 rounded-full shadow"
            >
              <Feather name="trash-2" size={20} color="#B91C1C" />
            </TouchableOpacity>
          </View>

        </View>
        
      </LinearGradient>
      <ScrollView className="4">
        {portfolio.portfolio_images && (
          <View className="h-72 w-full rounded-lg overflow-hidden">
            <Swiper
              showsPagination={true}
              autoplay={true}
              autoplayTimeout={2}
              loop={true}
              dot={<View className="w-2 h-2 bg-gray-400 mx-1 rounded-full" />}
              activeDot={
                <View className="w-2 h-2 bg-blue-950 mx-1 rounded-full" />
              }
            >
              {JSON.parse(portfolio.portfolio_images).map((image, index) => (
                <Image
                  key={index}
                  source={{
                    uri: `https://g32.iamdeveloper.in/public/${image}`,
                  }}
                  className="w-full h-72"
                  resizeMode="cover"
                />
              ))}
            </Swiper>
          </View>
        )}
        <View className="bg-gray-100 p-5 rounded-lg mt-8">
          <DetailRow label="Project Name" value={portfolio.project_name} />
          <DetailRow label="Description" value={portfolio.description} />

          <DetailRow
            label="Address"
            value={`${portfolio.address}, ${portfolio.city}`}
          />
          <DetailRow
            label="Year"
            value={new Date(portfolio.created_at).getFullYear()}
          />
        </View>
      </ScrollView>

      {/* EDIT MODAL */}
      <EditPortfolioModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        portfolio={portfolio}
        formData={formData}
        setFormData={setFormData}
        handleUpdate={handleUpdate}
        pickImage={pickImage}
        selectedImage={selectedImage}
      />
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View className="mb-4">
    <Text className="text-lg font-semibold text-gray-800">{label}:</Text>
    <Text className="text-gray-700">{value}</Text>
  </View>
);

export default PortfolioDetail;