import { View, Image, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import { API } from "../config/apiConfig";
import { useSelector, useDispatch } from "react-redux";
import Constants from "expo-constants";
import { setFcmToken, markFcmSentAfterLogin, markFcmSentBeforeLogin } from "../redux/slice/authSlice";
 
export default function Index() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
 
  const Authtoken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const fcmToken = useSelector((state) => state.auth.fcmToken);
  const fcmSentBeforeLogin = useSelector((state) => state.auth.fcmSentBeforeLogin);
  const fcmSentAfterLogin = useSelector((state) => state.auth.fcmSentAfterLogin);
 
  const [beforeLoginResponse, setBeforeLoginResponse] = useState(null);
  const [afterLoginResponse, setAfterLoginResponse] = useState(null);
 
  // Fetch FCM Token
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
        }
      } catch (error) {
        console.error("Error fetching FCM Token:", error);
      }
    };
 
    initializeFCM();
  }, [dispatch]);
 
  // Send FCM Token Before Login
  useEffect(() => {
    const sendFcmTokenBeforeLogin = async () => {
      if (fcmToken && !fcmSentBeforeLogin) {
        console.log("📌 Sending FCM Token Before Login:", { token: fcmToken });
        try {
          const response = await API.post(
            "https://g32.iamdeveloper.in/api/save-fcm-token",
            { token: fcmToken },
            {
              headers: {
                Authorization: Authtoken ? `Bearer ${Authtoken}` : undefined,
                "Content-Type": "application/json"
              }
            }
          );
          console.log("✅ FCM Token sent before login:", response.data);
          setBeforeLoginResponse(response.data);
          dispatch(markFcmSentBeforeLogin());
        } catch (error) {
          console.error("❌ Error sending FCM token before login:", error);
          setBeforeLoginResponse({ error: error.message });
        }
      }
    };
 
    sendFcmTokenBeforeLogin();
  }, [fcmToken, fcmSentBeforeLogin, dispatch, Authtoken]);
 
  // Send FCM Token After Login
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
          setAfterLoginResponse(response.data);
          dispatch(markFcmSentAfterLogin());
        } catch (error) {
          console.error("❌ Error sending FCM token after login:", error);
          setAfterLoginResponse({ error: error.message });
        }
      }
    };
 
    sendFcmTokenAfterLogin();
  }, [user?.id, fcmToken, fcmSentAfterLogin, dispatch, Authtoken]);
 
  return (
    <View className="flex-1 items-center bg-white">
      <ScrollView className="w-full">
        <View className="items-center mt-4">
          <Image source={require("../assets/images/homescreen/homeImage.png")} />
        </View>
 
        <View className="w-full items-center p-4">
          <Image
            className="h-40 w-[80%] rounded-lg mb-4"
            source={require("../assets/images/homescreen/MainLogo.jpg")}
          />
 
          {fcmToken && (
            <Text className="text-center text-sm text-gray-700 p-2">
              📌 FCM Token: {fcmToken.slice(0, 20)}...
            </Text>
          )}
 
          {user?.id && (
            <Text className="text-center text-sm text-gray-700 p-2">
              👤 User ID: {user.id}
            </Text>
          )}
 
          {beforeLoginResponse && (
            <Text className="text-center text-sm text-gray-700 p-2">
              Before Login Response: {JSON.stringify(beforeLoginResponse).slice(0, 50)}...
            </Text>
          )}
 
          {afterLoginResponse && (
            <Text className="text-center text-sm text-gray-700 p-2">
              After Login Response: {JSON.stringify(afterLoginResponse).slice(0, 50)}...
            </Text>
          )}
 
          <TouchableOpacity
            onPress={() => navigation.navigate("SignIn")}
            className="rounded-3xl px-10 bg-sky-950 mt-4 mb-4"
          >
            <Text className="font-semibold text-center mx-10 my-3 text-lg text-white">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}