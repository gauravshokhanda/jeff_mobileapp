import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp } from "./firebaseConfig";
import { Stack } from "expo-router";
import '../global.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import React from "react";



export default function RootLayout() {
  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission for notifications was denied!");
      return;
    }
  
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  
    // Get FCM Token
    const messaging = getMessaging(firebaseApp);
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY",
    });
  
    console.log("FCM Token:", token);
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  return <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Get Started', headerShown: false }} />
          <Stack.Screen
            name="SignIn"
            options={{ headerShown: false }}
            
            />
          <Stack.Screen name="SignUp/index" options={{ title: 'Sign up', headerShown: false }} />
          <Stack.Screen name="ContractorProfileComplete/index" options={{ title: 'ContractorProfileComplete', headerShown: false }} />
          <Stack.Screen name="RealstateSelector/index" options={{ title: 'RealstateSelector', headerShown: false }} />
          <Stack.Screen name='(usertab)' options={{ headerShown: false }} />
          <Stack.Screen name='(generalContractorTab)' options={{ headerShown: false }} />
          <Stack.Screen name='(RealstateContractorTab)' options={{ headerShown: false }} />
        </Stack>
      </PersistGate>
    </Provider>
  </>;
}
