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
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

const PortfolioDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    type: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const fetchPortfolioDetails = async () => {
      if (!id || !token) return;
      try {
        const response = await axios.get(`https://g32.iamdeveloper.in/api/portfolios/${id}`, {
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
  }, [id, token]);

  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this portfolio?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`https://g32.iamdeveloper.in/api/portfolio/delete/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Success", "Portfolio deleted!", [{ text: "OK", onPress: () => router.push("portfolio") }]);
          } catch (error) {
            console.error("Error deleting portfolio:", error);
          }
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    try {
      await axios.post(`https://g32.iamdeveloper.in/api/portfolio/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Success", "Portfolio updated successfully!", [{ text: "OK", onPress: () => setModalVisible(false) }]);
      setPortfolio({ ...portfolio, ...formData });
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-10" />;
  }

  if (!portfolio) {
    return <Text className="text-center text-red-500 mt-10">Portfolio not found</Text>;
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="bg-sky-950 py-4 mt-10 px-4 flex-row items-center justify-between">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-lg font-semibold text-white">Portfolio Details</Text>

        {/* Edit & Delete Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Feather name="edit" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Feather name="trash-2" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView className="p-4">
        {/* Portfolio Image */}
        {portfolio.portfolio_images && (
          <Image
            source={{ uri: `https://g32.iamdeveloper.in/public/${JSON.parse(portfolio.portfolio_images)[0]}` }}
            className="w-full h-72 rounded-lg mb-4 shadow-lg"
          />
        )}

        {/* Portfolio Details */}
        <View className="bg-gray-100 p-5 rounded-lg shadow-md">
          <DetailRow label="Project Name" value={portfolio.project_name} />
          <DetailRow label="Description" value={portfolio.description} />
          <DetailRow label="Type" value={portfolio.type} />
          <DetailRow label="Address" value={`${portfolio.address}, ${portfolio.city}`} />
          <DetailRow label="Year" value={new Date(portfolio.created_at).getFullYear()} />
        </View>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-black/50 p-6">
          <View className="bg-white p-6 rounded-lg">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold">Edit Portfolio</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <TextInputField label="Project Name" value={formData.project_name} onChange={(text) => setFormData({ ...formData, project_name: text })} />
            <TextInputField label="Description" value={formData.description} onChange={(text) => setFormData({ ...formData, description: text })} />
            <TextInputField label="Type" value={formData.type} onChange={(text) => setFormData({ ...formData, type: text })} />
            <TextInputField label="Address" value={formData.address} onChange={(text) => setFormData({ ...formData, address: text })} />
            <TextInputField label="City" value={formData.city} onChange={(text) => setFormData({ ...formData, city: text })} />

            {/* Buttons */}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="px-4 py-2 bg-gray-300 rounded-lg mr-2">
                <Text className="text-black">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate} className="px-4 py-2 bg-sky-950 rounded-lg">
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View className="mb-4">
    <Text className="text-lg font-semibold text-gray-800">{label}:</Text>
    <Text className="text-gray-700">{value}</Text>
  </View>
);

const TextInputField = ({ label, value, onChange }) => (
  <View className="mb-4">
    <Text className="text-gray-700 mb-1">{label}</Text>
    <TextInput value={value} onChangeText={onChange} className="border border-gray-300 p-2 rounded-lg" />
  </View>
);

export default PortfolioDetail;
