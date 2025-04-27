import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const postContentWidth = screenWidth * 0.92;

const PropertyPost = () => {
  const { breakdownCost } = useSelector((state) => state.breakdownCost);
  const token = useSelector((state) => state.auth.token);
  const parsedCost = useMemo(() => breakdownCost ? JSON.parse(breakdownCost) : {}, [breakdownCost]);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    numberOfDays: "",
    totalCost: "",
    zipCode: "",
    area: "",
    city: "",
    projectType: "",
    description: "",
    designImages: [],
    floorMapImages: [],
  });

  useEffect(() => {
    if (parsedCost?.days) {
      setForm((prev) => ({
        ...prev,
        numberOfDays: parsedCost.days.estimated_time?.toString() || "",
        totalCost: parsedCost.total_cost?.toString() || "",
        zipCode: parsedCost.zip_code || "",
        area: parsedCost.area || "",
        city: parsedCost.city || "",
        projectType: parsedCost.days.project_type || "",
      }));
    }
  }, [parsedCost]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const pickImages = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length) {
      const images = result.assets.map((asset) => asset.uri);
      updateForm(field, [...form[field], ...images]);
    }
  };

  const removeImage = (field, index) => {
    updateForm(field, form[field].filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const required = ["numberOfDays", "totalCost", "zipCode", "area", "city", "projectType", "description"];
    for (const field of required) {
      if (!form[field]?.trim()) {
        Alert.alert("Missing Field", `Please fill ${field.replace(/([A-Z])/g, ' $1')}`);
        return false;
      }
    }
    if (!form.floorMapImages.length || !form.designImages.length) {
      Alert.alert("Missing Images", "Please upload floor map and design images.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    const basicFields = {
      number_of_days: form.numberOfDays,
      total_cost: form.totalCost.replace(/,/g, ""),
      zipcode: form.zipCode,
      area: form.area,
      city: form.city,
      project_type: form.projectType,
      description: form.description,
    };

    Object.entries(basicFields).forEach(([key, value]) => formData.append(key, value));

    form.floorMapImages.forEach((uri, idx) => {
      formData.append("floor_maps_image[]", { uri, type: "image/jpeg", name: `floor_map_${idx}.jpg` });
    });

    form.designImages.forEach((uri, idx) => {
      formData.append("design_image[]", { uri, type: "image/jpeg", name: `design_image_${idx}.jpg` });
    });

    try {
      setLoading(true);
      await axios.post("https://g32.iamdeveloper.in/api/job-post", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Job posted successfully!", [{ text: "OK", onPress: () => router.replace("/") }]);
      resetForm();
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      numberOfDays: "",
      totalCost: "",
      zipCode: "",
      area: "",
      city: "",
      projectType: "",
      description: "",
      designImages: [],
      floorMapImages: [],
    });
  };

  const handleBack = () => {
    Alert.alert("Confirmation", "Are you sure you want to go back?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => router.back() },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#082f49" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient colors={["#082f49", "transparent"]} style={{ height: "40%" }}>
        <TouchableOpacity className="absolute top-6 left-5" onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white py-5 text-center">Property Post</Text>
      </LinearGradient>

      <View className="flex-1 bg-white rounded-t-3xl shadow-lg p-4" style={{
        marginTop: -screenHeight * 0.25,
        width: postContentWidth,
        marginHorizontal: (screenWidth - postContentWidth) / 2,
      }}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              { label: "Number of Days", field: "numberOfDays" },
              { label: "Total Cost", field: "totalCost" },
              { label: "Zip Code", field: "zipCode" },
              { label: "Area", field: "area" },
              { label: "City", field: "city" },
              { label: "Project Type", field: "projectType" },
            ].map(({ label, field }) => (
              <InputField key={field} label={label} value={form[field]} editable={false} />
            ))}

            <InputField
              label="Description"
              value={form.description}
              multiline
              numberOfLines={5}
              onChangeText={(text) => updateForm("description", text)}
            />

            <ImageUploader
              label="Design Images"
              images={form.designImages}
              onPick={() => pickImages("designImages")}
              onRemove={(idx) => removeImage("designImages", idx)}
            />

            <ImageUploader
              label="Floor Map Images"
              images={form.floorMapImages}
              onPick={() => pickImages("floorMapImages")}
              onRemove={(idx) => removeImage("floorMapImages", idx)}
            />

            <TouchableOpacity
              className="bg-sky-950 rounded-xl py-4 mt-8"
              onPress={handleSubmit}
            >
              <Text className="text-white font-bold text-lg text-center">Submit Application</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const InputField = ({ label, value, editable = true, ...props }) => (
  <View className="mb-6">
    <Text className="pl-4 pb-2 text-gray-600 font-medium">{label}</Text>
    <TextInput
      className="bg-gray-100 p-4 rounded-2xl text-sky-800"
      placeholder={`Enter ${label}`}
      value={value}
      editable={editable}
      {...props}
    />
  </View>
);

const ImageUploader = ({ label, images, onPick, onRemove }) => (
  <View className="mb-6">
    <Text className="text-gray-600 ml-4 mb-2 font-medium">{label}</Text>
    {images.length > 0 ? (
      <View className="flex-row flex-wrap">
        {images.map((uri, idx) => (
          <View key={idx} className="relative w-24 h-24 m-2">
            <Image source={{ uri }} className="w-full h-full rounded-2xl" />
            <TouchableOpacity
              className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
              onPress={() => onRemove(idx)}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={onPick}
          className="w-24 h-24 m-2 bg-gray-300 rounded-2xl flex items-center justify-center"
        >
          <Ionicons name="add" size={32} color="#082f49" />
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        onPress={onPick}
        className="bg-gray-100 p-4 rounded-2xl items-center justify-center"
      >
        <Text className="text-sky-500">Upload {label}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default PropertyPost;
