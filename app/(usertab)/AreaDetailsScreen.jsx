import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { API } from "../../config/apiConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function AreaDetailsScreen() {
  const { width, height } = Dimensions.get("window");
  const postContentWidth = width * 0.92;

  const placeholderImage = require("../../assets/images/userImages/propertyArea.jpg");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const token = useSelector((state) => state.auth.token);
  const { area, zipCode } = useSelector((state) => state.polygon);

  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");

  // Animation effect on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchCityNameUsingGoogle = async () => {
      if (!zipCode) return;
  
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyCJz96AlMJOnmTQusq3R0qL38yOdsJ_60Y`
        );
        const data = await response.json();
  
        if (data.status === "OK" && data.results.length > 0) {
          const components = data.results[0].address_components;
  
          // Try locality (city)
          const cityComponent = components.find((c) =>
            c.types.includes("locality")
          );
  
          // Fallback to district or state
          const district = components.find((c) =>
            c.types.includes("administrative_area_level_2")
          );
          const state = components.find((c) =>
            c.types.includes("administrative_area_level_1")
          );
  
          const city =
            cityComponent?.long_name ||
            district?.long_name ||
            state?.long_name;
  
          if (city) {
            console.log("📍 City resolved from Google API:", city);
            setCityName(city);
          } else {
            console.warn("❌ No valid city/district/state found from ZIP code.");
          }
        } else {
          console.warn("❌ No results from Google Geocoding API.");
        }
      } catch (error) {
        console.error("🌐 Google API Error:", error.message);
      }
    };
  
    fetchCityNameUsingGoogle();
  }, [zipCode]);
  
  

  const handleCostCalculation = async () => {
    if (!cityName || !zipCode || !area) {
      Alert.alert("Missing info", "Please wait for area and city to load.");
      return;
    }

    const payload = {
      city: cityName,
      zip_code: zipCode,
      area,
      project_type: "Basic",
      square_fit: "1000",
    };

    setLoading(true);
    try {
      const response = await API.post(
        "regional_multipliers/details",
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.data) {
        const encodedData = encodeURIComponent(JSON.stringify(response.data.data));
        router.push(`/CostDetail?CostDetails=${encodedData}`);
      } else {
        Alert.alert("Error", "No cost data received.");
      }
    } catch (error) {
      console.error("Cost fetch error:", error.message);
      Alert.alert("Error", "Failed to calculate cost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient colors={["#082f49", "transparent"]} style={{ height: "40%" }}>
        <View className="mt-2">
          <TouchableOpacity className="absolute top-6 z-10 left-5" onPress={() => router.push("/MapScreen")}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white mb-4 py-4 text-center">Your Area Details</Text>
        </View>
      </LinearGradient>

      <View
        className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -height * 0.25,
          width: postContentWidth,
          marginHorizontal: (width - postContentWidth) / 2,
          overflow: "hidden",
        }}
      >
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00ADEF" />
          </View>
        )}

        <View className="flex-1">
          <View className="items-center">
            <Image source={placeholderImage} className="rounded-t-3xl" style={{ width: "100%", height: height * 0.52 }} />
          </View>

          <View
            className="bg-white justify-center items-center rounded-xl"
            style={{
              position: "absolute",
              top: height * 0.5,
              width: width * 0.5,
              alignSelf: "center",
              zIndex: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text className="text-lg text-sky-950 text-center font-medium">Your area is</Text>
          </View>

          <View className="justify-center items-center" style={{ marginVertical: height * 0.04 }}>
            <Text className="tracking-widest font-bold" style={{ fontSize: height * 0.055 }}>
              {area} sq ft.
            </Text>
          </View>

          <View className="flex-1 items-center">
            <TouchableOpacity
              onPress={handleCostCalculation}
              className="bg-sky-950 px-10 py-3 rounded-full"
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold tracking-widest">Calculate Cost</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});
