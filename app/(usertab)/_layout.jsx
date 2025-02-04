import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
// import '../../global.css';
import ProtectedRoute from "../../components/ProtectedRoute";

import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

// const disableBackAction = () => {
//     useFocusEffect(() => {
//         const onBackPress = () => {
//             return true;
//         };

//         BackHandler.addEventListener('hardwareBackPress', onBackPress);

//         return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     });
// };

export default function TabRoot() {
  // disableBackAction()
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
          name="PropertyCalculator"
          options={{
            title: "PropertyCalculator",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "calculator" : "calculator-outline"}
                size={30}
                color={"white"}
              />
            ),
            tabBarLabelStyle: {
              display: "none", // Hides the label text
            },
          }}
        />

        <Tabs.Screen
          name="AllPropertyPost"
          options={{
            title: "AllPropertyPost",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "newspaper" : "newspaper-outline"}
                size={30}
                color={"white"}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />

        <Tabs.Screen
          name="User"
          options={{
            title: "User",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={30}
                color={"white"}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="Menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "menu" : "menu-outline"}
                size={30}
                color={"white"}
              />
            ),
            tabBarLabelStyle: {
              display: "none",
            },
          }}
        />

        <Tabs.Screen
          name="MapScreen"
          options={{
            href: null,
          }}
        />
      
        <Tabs.Screen
          name="FloorMapScreen"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="Contractor"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="AreaDetailsScreen"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="CostDetail"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="BreakdownCost"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="PropertyPost"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="SearchPost"
          options={{
            href: null,
          }}
        />
         <Tabs.Screen
                    name="MyPosts"
                    options={{
                        href: null,

                    }}
                />
         <Tabs.Screen
          name="UserProfile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
