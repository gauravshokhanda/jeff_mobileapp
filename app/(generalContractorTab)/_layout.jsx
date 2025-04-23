import { Tabs, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { View, BackHandler, Keyboard } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { API } from "../../config/apiConfig";
import { useSelector } from "react-redux";

export default function TabRoot() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const pathname = usePathname();

  const isOnChatTab = pathname === "/ChatList";

  // Handle keyboard visibility
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Back button behavior
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true; // prevent exiting
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  // Unread message polling
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (isOnChatTab) {
        console.log("🚫 On ChatList, skipping fetch + clearing red dot");
        setHasUnreadMessages(false);
        return;
      }

      try {
        const response = await API.get("recent-chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success && Array.isArray(response.data.users)) {
          const unreadCount = response.data.users.reduce(
            (sum, user) => sum + user.message_unread_count,
            0
          );
          console.log("📬 Unread messages count:", unreadCount);
          setHasUnreadMessages(unreadCount > 0);
        }
      } catch (error) {
        console.error("❌ Failed to fetch unread messages:", error.message);
      }
    };

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 20000); // every 20s
    return () => clearInterval(interval);
  }, [isOnChatTab, token]);

  return (
    <ProtectedRoute>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#082f49",
            height: isKeyboardVisible ? 0 : 68,
            paddingTop: isKeyboardVisible ? 0 : 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={"white"}
                size={25}
              />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="ContractorFeed"
          options={{
            title: "ContractorFeed",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                color="white"
                size={25}
              />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="ContractorPortfolio"
          options={{
            title: "ContractorPortfolio",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "albums" : "albums-outline"}
                color="white"
                size={25}
              />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="ChatList"
          options={{
            title: "ChatList",
            tabBarIcon: ({ focused }) => (
              <View>
                <Ionicons
                  name={focused ? "chatbubble" : "chatbubble-outline"}
                  color="white"
                  size={25}
                />
                {hasUnreadMessages && (
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -4,
                      backgroundColor: "red",
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                    }}
                  />
                )}
              </View>
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color="white"
                size={25}
              />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        {/* Hidden tabs */}
        <Tabs.Screen name="PropertyDetails" options={{ href: null }} />
        <Tabs.Screen name="ChatScreen" options={{ href: null }} />
        <Tabs.Screen name="Portfolio" options={{ href: null }} />
        <Tabs.Screen name="PortfolioDetail" options={{ href: null }} />
      </Tabs>
    </ProtectedRoute>
  );
}
