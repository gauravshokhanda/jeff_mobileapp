import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import firebaseApp from "./firebaseConfig"; // Import Firebase
import { getApps, getApp, initializeApp } from "firebase/app";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import React from "react";

// Ensure Firebase app is initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseApp);
} else {
  app = getApp();
}

// ✅ Function to Get and Console the FCM Token
async function registerForPushNotificationsAsync() {
  // Request notification permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission for notifications was denied!");
    return;
  }

  // Set Android Notification Channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  try {
    // ✅ Get the FCM Token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("🔥 FCM Token:", token);  // ✅ Console log the token

    return token;
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
  }
}

export default function _layout() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    // ✅ Listen for Incoming Notifications in Foreground
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("🔔 Received foreground notification:", notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Get Started", headerShown: false }} />
          <Stack.Screen name="SignIn" options={{ headerShown: false }} />
          <Stack.Screen name="SignUp/index" options={{ title: "Sign up" }} />
          <Stack.Screen name="ContractorProfileComplete/index" options={{ title: "ContractorProfileComplete" }} />
          <Stack.Screen name="RealstateSelector/index" options={{ title: "RealstateSelector" }} />
          <Stack.Screen name="(usertab)" />
          <Stack.Screen name="(generalContractorTab)" />
          <Stack.Screen name="(RealstateContractorTab)" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
