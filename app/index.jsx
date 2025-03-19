import { View, Image, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import { API } from "../config/apiConfig";
import { useSelector } from "react-redux";
import Constants from "expo-constants";

export default function Index() {
  const [fcmToken, setFcmToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [apiResponse, setApiResponse] = useState(null); // New state for API response
  const navigation = useNavigation();
  const Authtoken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get Expo Installation ID
        const installationId = Constants.installationId;
        setDeviceId(installationId);
        console.log("📱 Device Installation ID:", installationId);

        // Request permission for notifications
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          Alert.alert("Notification Permission Denied", "Enable notifications to receive updates.");
          return;
        }

        // Get FCM Token
        const token = await messaging().getToken();
        if (token) {
          console.log("🔥 FCM Token:", token);
          setFcmToken(token);
        } else {
          console.log("Failed to get FCM Token.");
        }
      } catch (error) {
        console.error("Error fetching FCM Token or Device ID:", error);
      }
    };

    initializeApp();
  }, []);

  // Function to handle API call on button press
  const handleSaveFcmToken = async () => {
    if (!fcmToken) {
      Alert.alert("Error", "FCM Token not available yet.");
      return;
    }

    try {
      const response = await API.post(
        "https://g32.iamdeveloper.in/api/save-fcm-token",
        {
          token: fcmToken,
        },
        {
          headers: {
            Authorization: `Bearer ${Authtoken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ FCM Token stored successfully:", response.data);
      setApiResponse(response.data); // Store the API response in state
    } catch (apiError) {
      console.error("❌ Error sending FCM token to API:", apiError);
      setApiResponse({ error: apiError.message }); // Store error message in state
    }
  };

  return (
    <View className="flex-1 items-center bg-white">
      <View className="items-center">
        <Image source={require("../assets/images/homescreen/homeImage.png")} />
      </View>

      <View className="h-[20%] w-[100%] justify-between items-center">
        <Image
          className="h-[60%] w-[80%] rounded-lg"
          source={require("../assets/images/homescreen/MainLogo.jpg")}
        />

        {/* Show FCM Token */}
        {fcmToken && (
          <Text className="text-center text-sm text-gray-700 p-2">
            Your FCM Token: {fcmToken}
          </Text>
        )}
        {/* Show Device ID */}
        {deviceId && (
          <Text className="bg-red-400 text-black text-center text-sm p-2">
            Device Unique ID: {deviceId}
          </Text>
        )}
        {/* Show API Response */}
        {apiResponse && (
          <Text className="text-center text-sm text-gray-700 p-2">
            API Response: {JSON.stringify(apiResponse)}
          </Text>
        )}

        {/* Button to Save FCM Token */}
        <TouchableOpacity
          onPress={handleSaveFcmToken}
          className="text-center rounded-3xl px-10 bg-green-600 mt-2"
        >
          <Text className="font-semibold text-center mx-10 my-3 text-lg text-white">
            Save FCM Token
          </Text>
        </TouchableOpacity>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
          className="text-center rounded-3xl px-10 bg-sky-950 mt-2"
        >
          <Text className="font-semibold text-center mx-10 my-3 text-lg text-white">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}