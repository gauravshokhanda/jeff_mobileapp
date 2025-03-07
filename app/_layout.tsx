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
import '../global.css';



export default function _layout() {


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
