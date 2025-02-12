import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Keyboard } from "react-native";

export default function TabRoot() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#082f49",
            height: isKeyboardVisible ? 0 : 77,
            paddingTop: isKeyboardVisible ? 0 : 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={"white"} size={30} />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="ChatList"
          options={{
            title: "ChatList",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={30} color={"white"} />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="PropertyPost"
          options={{
            title: "Property Post",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "business" : "business-outline"} color="white" size={30} />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="Listenings"
          options={{
            title: "Listenings",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "newspaper" : "newspaper-outline"} size={30} color={"white"} />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} color="white" size={30} />
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
      </Tabs>
    </ProtectedRoute>
  );
}
