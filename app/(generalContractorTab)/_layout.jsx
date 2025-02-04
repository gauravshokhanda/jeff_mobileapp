import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { View, Text } from "react-native";

export default function TabRoot() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#082f49",
            height: 77,
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={"white"}
                size={30}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="ContractorFeed"
          options={{
            title: "ContractorFeed",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                color="white"
                size={30}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="ContractorPortfolio"
          options={{
            title: "ContractorPortfolio",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "albums" : "albums-outline"}
                color="white"
                size={30}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="AddPortfolio"
          options={{
            title: "AddPortfolio",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                color="white"
                size={30}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color="white"
                size={30}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="PropertyDetails"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
