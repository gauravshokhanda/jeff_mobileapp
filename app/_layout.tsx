import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Stack } from "expo-router";
import '../global.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import React from "react";
import '../global.css';
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export default function RootLayout() {
  return <>
   <NotificationProvider>
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
    </NotificationProvider>
  </>;
}