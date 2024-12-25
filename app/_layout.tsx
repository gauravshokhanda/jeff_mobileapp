import { Stack } from "expo-router";
import '../global.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import React from "react";



export default function RootLayout() {
  return <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack screenOptions={{headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Get Started', headerShown: false }} />
          <Stack.Screen name="SignIn" options={{  headerShown: false }} />
          <Stack.Screen name="SignUp/index" options={{ title: 'Sign up', headerShown: false }} />
            <Stack.Screen name='(usertab)' options={{ headerShown: false }} />
        </Stack>
      </PersistGate>
    </Provider>
  </>;
}
