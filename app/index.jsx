import { View, Image, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import { API } from "../config/apiConfig";
import { useSelector, useDispatch } from "react-redux";
import Constants from "expo-constants";
import { setLogin } from "../redux/slice/AuthSlice";

export default function Index() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const Authtoken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const fcmToken = useSelector((state) => state.auth.fcmToken);
  const fcmSentBeforeLogin = useSelector((state) => state.auth.fcmSentBeforeLogin);
  const fcmSentAfterLogin = useSelector((state) => state.auth.fcmSentAfterLogin);

  // Fetch FCM Token Immediately When App Starts
  useEffect(() => {
    const initializeFCM = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
            authStatus !== messaging.AuthorizationStatus.PROVISIONAL) {
          Alert.alert("Notification Permission Denied", "Enable notifications to receive updates.");
          return;
        }

        const token = await messaging().getToken();
        if (token) {
          console.log("🔥 FCM Token:", token);
          dispatch(setFcmToken(token));
        } else {
          console.log("Failed to get FCM Token.");
        }
      } catch (error) {
        console.error("Error fetching FCM Token:", error);
      }
    };

    initializeFCM();
  }, [dispatch]);

  // Send FCM Token to API Immediately (Without User ID)
  useEffect(() => {
    const sendFcmTokenBeforeLogin = async () => {
      if (fcmToken && !fcmSentBeforeLogin) {
        console.log("📌 Sending FCM Token Before Login:", { token: fcmToken });
        try {
          const response = await API.post(
            "https://g32.iamdeveloper.in/api/save-fcm-token",
            { token: fcmToken },
            { headers: { Authorization: `Bearer ${Authtoken}`, "Content-Type": "application/json" } }
          );
          console.log("✅ FCM Token sent before login:", response.data);
          dispatch(markFcmSentBeforeLogin()); // Mark as sent
        } catch (error) {
          console.error("❌ Error sending FCM token before login:", error);
        }
      }
    };

    sendFcmTokenBeforeLogin();
  }, [fcmToken, fcmSentBeforeLogin, dispatch]);

  // Send FCM Token to API Again After Login (Only Once)
  useEffect(() => {
    const sendFcmTokenAfterLogin = async () => {
      if (user?.id && fcmToken && !fcmSentAfterLogin) {
        console.log("📌 Sending FCM Token After Login:", { token: fcmToken, user_id: user.id });
        try {
          const response = await API.post(
            "https://g32.iamdeveloper.in/api/save-fcm-token",
            { token: fcmToken, user_id: user.id },
            { headers: { Authorization: `Bearer ${Authtoken}`, "Content-Type": "application/json" } }
          );
          console.log("✅ FCM Token sent after login:", response.data);
          dispatch(markFcmSentAfterLogin()); // Mark as sent
        } catch (error) {
          console.error("❌ Error sending FCM token after login:", error);
        }
      }
    };

    sendFcmTokenAfterLogin();
  }, [user?.id, fcmToken, fcmSentAfterLogin, dispatch]);

  return (
    <View className="flex-1 items-center bg-white">
      <View className="items-center">
        <Image source={require("../assets/images/homescreen/homeImage.png")} />
      </View>

      <View className="h-[20%] w-[100%] justify-between items-center">
        <Image className="h-[60%] w-[80%] rounded-lg" source={require("../assets/images/homescreen/MainLogo.jpg")} />

        {fcmToken && (
          <Text className="text-center text-sm text-gray-700 p-2">📌 FCM Token: {fcmToken}</Text>
        )}

        {user?.id && (
          <Text className="text-center text-sm text-gray-700 p-2">👤 User ID: {user.id}</Text>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="text-center rounded-3xl px-10 bg-sky-950 mt-2">
          <Text className="font-semibold text-center mx-10 my-3 text-lg text-white">Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
