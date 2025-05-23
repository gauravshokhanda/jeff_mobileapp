import { Tabs, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Keyboard, View } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { API } from "../../config/apiConfig";

export default function TabRoot() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const pathname = usePathname();
  const token = useSelector((state) => state.auth.token);

  const isOnChatTab = pathname?.toLowerCase() === "/chatlist";

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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useEffect(() => {
    const fetchUnread = async () => {
      if (!token) return;
      if (isOnChatTab) {
        setHasUnreadMessages(false);
        return;
      }
      try {
        const res = await API.get("recent-chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const count =
          res.data.users?.reduce((sum, u) => sum + u.message_unread_count, 0) ||
          0;
        setHasUnreadMessages(count > 0);
      } catch (e) {
        console.warn("Unread fetch error", e);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    return () => clearInterval(interval);
  }, [token, isOnChatTab]);

  return (
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
              color="white"
              size={25}
            />
          ),
          tabBarLabelStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="PropertyCalculator"
        options={{
          title: "PropertyCalculator",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "calculator" : "calculator-outline"}
              size={25}
              color="white"
            />
          ),
          tabBarLabelStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="ContractorLists"
        options={{
          title: "ContractorLists",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "newspaper" : "newspaper-outline"}
              size={25}
              color="white"
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
                size={25}
                color="white"
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
        name="Menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "menu" : "menu-outline"}
              size={25}
              color="white"
            />
          ),
          tabBarLabelStyle: { display: "none" },
        }}
      />
      {[
        "MapScreen",
        "FloorMapScreen",
        "RealContractorProfile",
        "Contractor",
        "AreaDetailsScreen",
        "CostDetail",
        "BreakdownCost",
        "PropertyPost",
        "SearchPost",
        "MyPosts",
        "UserProfile",
        "EditPost",
        "premium",
        "AllPropertyPost",
        "ChatScreen",
        "ContractorProfile",
        "RealEstateDetails",
        "RealContractorListing",
        "Explanation"
      ].map((screen) => (
        <Tabs.Screen key={screen} name={screen} options={{ href: null }} />
      ))}
    </Tabs>
  );
}
