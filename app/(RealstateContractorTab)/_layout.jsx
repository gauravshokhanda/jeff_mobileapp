import { Tabs, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Keyboard, BackHandler, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { API } from "../../config/apiConfig";
import { useSelector } from "react-redux";

export default function TabRoot() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const pathname = usePathname(); // 📍 current route

  // Listen to keyboard
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

  // Disable Android back button default behavior
  useFocusEffect(() => {
    const onBackPress = () => true;
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  // 🧠 Detect if user is on Chat tab
  const isOnChatTab = pathname === "/RealStateChatList";

  // Fetch unread messages from API (only if NOT on chat screen)
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (isOnChatTab) {
        // console.log("🚫 Skipping unread check (currently on chat screen)");
        setHasUnreadMessages(false);
        return;
      }

      // console.log("🔍 Checking unread messages...");
      try {
        const response = await API.get("recent-chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success && Array.isArray(response.data.users)) {
          const unreadCount = response.data.users.reduce(
            (sum, u) => sum + u.message_unread_count,
            0
          );
          // console.log("📬 Unread count:", unreadCount);
          setHasUnreadMessages(unreadCount > 0);
        } else {
          console.log("⚠️ Unexpected API format");
        }
      } catch (error) {
        console.error("❌ Unread fetch error:", error.message);
      }
    };

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 20000);
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
          name="PropertyPost"
          options={{
            title: "Property Post",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                color="white"
                size={30}
              />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="Listings"
          options={{
            title: "Listings",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "newspaper" : "newspaper-outline"}
                size={25}
                color={"white"}
              />
            ),
            tabBarLabelStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="RealStateChatList"
          options={{
            title: "RealStateChatList",
            tabBarIcon: ({ focused }) => (
              <View>
                <Ionicons
                  name={focused ? "chatbubble" : "chatbubble-outline"}
                  size={25}
                  color={"white"}
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

        {/* Hidden Tabs */}
        <Tabs.Screen name="ChatScreen" options={{ href: null }} />
        <Tabs.Screen name="KnowMore" options={{ href: null }} />
        <Tabs.Screen name="SingleListing" options={{ href: null }} />
        <Tabs.Screen name="MyListing" options={{ href: null }} />
        <Tabs.Screen name="EstateContractorProfile" options={{ href: null }} />
        <Tabs.Screen name="contractorProfile" options={{ href: null }} />
        <Tabs.Screen name="premium" options={{ href: null }} />
        <Tabs.Screen name="MySingleList" options={{ href: null }} />
      </Tabs>
    </ProtectedRoute>
  );
}
