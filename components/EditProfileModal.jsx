import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { API } from "../config/apiConfig";
import { useSelector } from "react-redux";

const EditProfileModal = ({ visible, onClose, userData, onUpdate }) => {
  const token = useSelector((state) => state.auth.token);
  const [form, setForm] = useState({
    name: "",
    number: "",
    address: "",
    city: "",
    company_name: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        number: userData.number || "",
        address: userData.address || "",
        city: userData.city || "",
        email: userData.email || "",
        company_name: userData.company_name || "",
      });
    }
  }, [userData]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post("user/profile_update", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        onUpdate(form);
        onClose();
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error) {
      console.log("Profile update error:", error.response?.data || error.message);
      const apiResponse = error.response?.data?.message || "something went wrong"
      Alert.alert("Error", apiResponse);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/40 px-4">
        <View className="w-full bg-white p-6 rounded-2xl shadow-md">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Edit Profile
          </Text>

          <TextInput
            className="border-b border-gray-300 mb-3 pb-1 text-base"
            placeholder="Name"
            value={form.name}
            onChangeText={(val) => handleChange("name", val)}
          />
          <TextInput
            className="border-b border-gray-300 mb-3 pb-1 text-base"
            placeholder="Mobile Number"
            value={form.number}
            onChangeText={(val) => handleChange("number", val)}
            keyboardType="phone-pad"
          />
          <TextInput
            className="border-b border-gray-300 mb-3 pb-1 text-base"
            placeholder="Address"
            value={form.address}
            onChangeText={(val) => handleChange("address", val)}
          />
          <TextInput
            className="border-b border-gray-300 mb-3 pb-1 text-base"
            placeholder="City"
            value={form.city}
            onChangeText={(val) => handleChange("city", val)}
          />
          <TextInput
            className="border-b border-gray-300 mb-4 pb-1 text-base"
            placeholder="Company Name"
            value={form.company_name}
            onChangeText={(val) => handleChange("company_name", val)}
          />

          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-semibold text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text className="text-sky-700 font-semibold text-base">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;
