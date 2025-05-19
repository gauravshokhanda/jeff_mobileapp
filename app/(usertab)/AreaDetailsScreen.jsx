import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
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
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { area, city, state, zipCode, floors, buildableArea } = useSelector((state) => state.polygon); // ✅ Use directly from redux
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const scheduleCost = async () => {
    const data = {
      city: city,
      state: state,
      zip_code: zipCode,
      area: area,
      project_type: "Basic",
      square_fit: "1000",
      floors: floors,
      buildable_area: buildableArea,

    };
    console.log('schedule data', data)

    setLoading(true);
    try {
      const response = await API.post(
        "regional_multipliers/details",
        JSON.stringify(data),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data) {
        const scheduleCost = encodeURIComponent(
          JSON.stringify(response.data.data)
        );
        router.replace(`/CostDetail?CostDetails=${scheduleCost}`);
      } else {
        Alert.alert("Error", "No response data available");
      }
    } catch (error) {
      console.error("error:", error.message);
      Alert.alert("Error", "An error occurred while fetching schedule cost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: "40%" }}
      >
        <View className="mt-2">
          <TouchableOpacity
            className="absolute top-6 z-10 left-5"
            onPress={() => router.push("/MapScreen")}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white mb-4 py-4 text-center">
            Your Area Details
          </Text>
        </View>
      </LinearGradient>

      <View
        className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -screenHeight * 0.25,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
          overflow: "hidden"
        }}
      >
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00ADEF" />
          </View>
        )}

        <View className="flex-1">
          <View className="items-center">
            <Image
              source={require("../../assets/images/userImages/propertyArea.jpg")}
              className="rounded-t-3xl"
              style={{ width: "100%", height: screenHeight * 0.52 }}
            />
          </View>

          <View
            className="bg-white justify-center items-center rounded-xl"
            style={{
              position: 'absolute',
              top: screenHeight * 0.5,
              width: screenWidth * 0.5,
              alignSelf: 'center',
              zIndex: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text className="text-lg text-sky-950 text-center font-medium">
              Your area is
            </Text>
          </View>

          <View
            className="justify-center items-center"
            style={{ marginVertical: screenHeight * 0.04 }}
          >
            <Text
              className="tracking-widest font-bold"
              style={{ fontSize: screenHeight * 0.055 }}
            >
              {area} sq ft.
            </Text>
          </View>

          <View className="flex-1 items-center">
            <TouchableOpacity
              onPress={scheduleCost}
              className="bg-sky-950 px-10 py-3 rounded-full"
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold tracking-widest">
                Calculate Cost
              </Text>
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
