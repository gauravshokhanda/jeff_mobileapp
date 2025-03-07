import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProtectedRoute from "../../components/ProtectedRoute";
<<<<<<< HEAD
import { useState, useEffect,useCallback } from "react";
import { Keyboard,BackHandler } from "react-native";
=======
import { useState, useEffect, useCallback } from "react";
import { Keyboard, BackHandler } from "react-native";
>>>>>>> bd42ca8 (Initial commit on abhijeet branch)
import { useFocusEffect } from "@react-navigation/native";

export default function TabRoot() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });
=======
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
>>>>>>> bd42ca8 (Initial commit on abhijeet branch)

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

<<<<<<< HEAD
    // Handle back button behavior (prevent exiting the app)
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => true; // Disable back button default behavior
  
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
    );
=======
  // Handle back button behavior (prevent exiting the app)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // Disable back button default behavior

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
>>>>>>> bd42ca8 (Initial commit on abhijeet branch)

  return (
    <ProtectedRoute>
      <Tabs
<<<<<<< HEAD
       backBehavior="history"
=======
        backBehavior="history"
>>>>>>> bd42ca8 (Initial commit on abhijeet branch)
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#082f49",
            height: isKeyboardVisible ? 0 : 58,
            paddingTop: isKeyboardVisible ? 0 : 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
<<<<<<< HEAD
              <Ionicons name={focused ? "home" : "home-outline"} color={"white"} size={25} />
=======
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={"white"}
                size={25}
              />
>>>>>>> bd42ca8 (Initial commit on abhijeet branch)
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="RealStateChatList"
          options={{
            title: "RealStateChatList",
            tabBarIcon: ({ color, focused }) => (
<<<<<<< HEAD
              <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={25} color={"white"} />
=======
              <Ionicons
                name={focused ? "chatbubble" : "chatbubble-outline"}
                size={25}
                color={"white"}
              />
>>>>>>> bd42ca8 (Initial commit on abhijeet branch)
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="PropertyPost"
          options={{
            title: "Property Post",
            tabBarIcon: ({ color, focused }) => (
<<<<<<< HEAD
              <Ionicons name={focused ? "add-circle" : "add-circle-outline"} color="white" size={30} />
=======
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                color="white"
                size={30}
              />
>>>>>>> bd42ca8 (Initial commit on abhijeet branch)
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="Listings"
          options={{
            title: "Listings",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "newspaper" : "newspaper-outline"} size={25} color={"white"} />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} color="white" size={25} />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="ChatScreen"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="KnowMore"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="SingleListing"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="MyListing"
          options={{
            href: null,
          }}
        />
         <Tabs.Screen
          name="EstateContractorProfile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
