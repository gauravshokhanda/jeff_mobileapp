// Final version of PropertyPost with Buildable Area field added and Project Type badge styled

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
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { API } from "../../config/apiConfig";
import ImagePickerModal from "../../components/ImagePickerModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const postContentWidth = screenWidth * 0.92;

const PropertyPost = () => {
  const { breakdownCost } = useSelector((state) => state.breakdownCost);
  const token = useSelector((state) => state.auth.token);
  const parsedCost = useMemo(() => (breakdownCost ? JSON.parse(breakdownCost) : {}), [breakdownCost]);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    numberOfDays: "",
    totalCost: "",
    zipCode: "",
    area: "",
    buildableArea: "",
    city: "",
    projectType: "",
    description: "",
    designImages: [],
    floorMapImages: [],
  });
  const [imageField, setImageField] = useState(null); // stores current field like 'designImages'
  const [imagePickerVisible, setImagePickerVisible] = useState(false);


  useEffect(() => {
    if (parsedCost?.days) {
      setForm((prev) => ({
        ...prev,
        numberOfDays: parsedCost.days.estimated_time?.toString() || "",
        totalCost: parsedCost.total_cost?.toString() || "",
        zipCode: parsedCost.zip_code || "",
        area: parsedCost.area?.toString() || "",
        buildableArea: parsedCost.buildable_area?.toString() || "",
        city: parsedCost.city || "",
        projectType: parsedCost.days.project_type || "",
      }));
    }
  }, [parsedCost]);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleBack = () => {
    Alert.alert("Confirmation", "Are you sure you want to go back?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => router.back() },
    ]);
  };
  const pickImages = (field) => {
    setImageField(field);
    setImagePickerVisible(true);
  };
  const handleImagePicked = (picked) => {
    const assets = Array.isArray(picked) ? picked : [picked];
    const uris = assets.map(a => a.uri).filter(Boolean);
    updateForm(imageField, [...form[imageField], ...uris]);
  };


  const removeImage = (field, idx) => {
    updateForm(field, form[field].filter((_, i) => i !== idx));
  };




  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    const basicFields = {
      number_of_days: form.numberOfDays,
      total_cost: form.totalCost.replace(/,/g, ""),
      zipcode: form.zipCode,
      area: form.area,
      buildable_area: form.buildableArea,
      city: form.city,
      project_type: form.projectType,
      description: form.description,
    };

    Object.entries(basicFields).forEach(([key, value]) => formData.append(key, value));

    form.floorMapImages.forEach((uri, idx) => {
      formData.append("floor_maps_image[]", {
        uri,
        type: "image/jpeg",
        name: `floor_map_${idx}.jpg`,
      });
    });
    form.designImages.forEach((uri, idx) => {
      formData.append("design_image[]", {
        uri,
        type: "image/jpeg",
        name: `design_image_${idx}.jpg`,
      });
    });

    try {
      setLoading(true);
      await API.post("job-post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Success", "Job posted successfully!", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
      resetForm();
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const required = [
      "numberOfDays",
      "totalCost",
      "zipCode",
      "area",
      "buildableArea",
      "city",
      "projectType",
      "description",
    ];
    for (const field of required) {
      if (!form[field]?.trim()) {
        Alert.alert("Missing Field", `Please fill ${field.replace(/([A-Z])/g, " $1")}`);
        return false;
      }
    }
    if (!form.floorMapImages.length || !form.designImages.length) {
      Alert.alert("Missing Images", "Please upload floor map and design images.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setForm({
      numberOfDays: "",
      totalCost: "",
      zipCode: "",
      area: "",
      buildableArea: "",
      city: "",
      projectType: "",
      description: "",
      designImages: [],
      floorMapImages: [],
    });
  };

  const InputField = ({ label, value, editable = true, style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className="mb-5">
        <Text className="ml-1 mb-1 text-sky-900 font-semibold text-sm">{label}</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: isFocused ? "#0ea5e9" : "#cbd5e1",
            borderRadius: 12,
            backgroundColor: editable ? "#f8fafc" : "#e2e8f0",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
          }}
        >
          <TextInput
            placeholder={`Enter ${label}`}
            value={value}
            editable={editable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline={props.multiline}
            numberOfLines={props.numberOfLines}
            onChangeText={props.onChangeText}
            style={[
              {
                padding: 12,
                fontSize: 16,
                color: "#075985", // text-sky-800
                textAlignVertical: props.multiline ? "top" : "auto",
              },
              style,
            ]}
          />

        </View>
      </View>
    );
  };

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
        <View className="flex-row items-center justify-between px-5 pt-4">
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-2xl font-semibold text-white text-center flex-1 ml-3">
            Property Post
          </Text>

          <View className="bg-white/30 px-4 py-1 rounded-full border border-white ml-3">
            <Text className="text-white font-medium text-sm">{form.projectType}</Text>
          </View>
        </View>

      </LinearGradient>


      <View
        className="flex-1 bg-white rounded-t-3xl shadow-lg p-4"
        style={{
          marginTop: -screenHeight * 0.25,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
        }}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between">
              <View style={{ width: "48%" }}>
                <InputField label="Number of Days" value={form.numberOfDays} editable={false} />
              </View>
              <View style={{ width: "48%" }}>
                <InputField label="Total Cost" value={form.totalCost} editable={false} />
              </View>
            </View>

            <View className="flex-row justify-between">
              <View style={{ width: "48%" }}>
                <InputField label="Zip Code" value={form.zipCode} editable={false} />
              </View>
              <View style={{ width: "48%" }}>
                <InputField label="City" value={form.city} editable={false} />
              </View>
            </View>

            <View className="flex-row justify-between">
              <View style={{ width: "48%" }}>
                <InputField label="Area" value={form.area} editable={false} />
              </View>
              <View style={{ width: "48%" }}>
                <InputField label="Buildable Area" value={form.buildableArea} editable={false} />
              </View>
            </View>

            <InputField
              label="Description"
              value={form.description}
              multiline
              numberOfLines={6}
              onChangeText={(text) => updateForm("description", text)}
              style={{ minHeight: 100, textAlignVertical: "top" }}
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
              className="bg-sky-950 rounded-xl py-4 mt-5"
              onPress={handleSubmit}
            >
              <Text className="text-white font-bold text-lg text-center">
                Submit Application
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      
      <ImagePickerModal
        visible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onImagePicked={handleImagePicked}
        multiple={true}
      />

    </SafeAreaView>
  );
};

export default PropertyPost;

