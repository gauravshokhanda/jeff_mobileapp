import React from "react";
import { View, Text, Image, Platform, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router"; // ✅ Use router for navigation
import Icon from "react-native-vector-icons/FontAwesome5";
import Box from "../../assets/images/MD.png";

// Object Array for menu items
const imageData = [
  { id: 1, label: "Posts", icon: "arrow-up", screen: null, source: Box },
  { id: 2, label: "Feeds", icon: "rss", screen: null, source: Box },
  { id: 3, label: "Favorites", icon: "heart", screen: null, source: Box },
  { id: 4, label: "Profile", icon: "user", screen: "UserProfile", source: Box }, // ✅ Profile navigation
  { id: 5, label: "Notifications", icon: "bell", screen: null, source: Box },
  { id: 6, label: "Calculator", icon: "calculator", screen: null, source: Box },
  { id: 7, label: "Contractor Lists", icon: "list", screen: null, source: Box },
  { id: 8, label: "Log Out", icon: "sign-out-alt", screen: null, source: Box },
];

const MenuHeader = () => {
  const userName = useSelector((state) => state.auth.user);
  const router = useRouter(); // ✅ Use router for navigation

  const handlePress = (screen) => {
    if (screen) {
      console.log(`Navigating to ${screen}`);
      router.push(screen); // ✅ Navigate using router.push
    }
  };

  const menuItems = [
    { icon: "analytics", title: "My posts", subtitle: "See Your Posts", route: "/MyPosts" },
    { icon: "manage-search", title: "Search Post", subtitle: "Saved Searches", route: "/SearchPost" },
    { icon: "favorite-border", title: "Favorites", route: "/favorites" },
    { icon: "credit-card", title: "Financing", subtitle: "Interest & rates", route: "/financing" },
    { icon: "notifications", title: "Notifications", subtitle: "0 new", route: "/notifications" },
    { icon: "verified-user", title: "Profile", subtitle: "Applicant portfolios", route: "/profile" },
    { icon: "house", title: "ImmoKlub", subtitle: "Insure your home", route: "/immo-klub" },
    { icon: "lock", title: "Account", subtitle: "Contracts & data", route: "/account" },
    { icon: "settings", title: "Settings", subtitle: "Language, design...", route: "/settings" },
  ];

  return (
    <View className={`bg-white h-full relative ${Platform.OS === "ios" ? "mt-16" : ""}`}>
      {/* Header with User Info */}
      <View className="bg-sky-950 h-56">
        <View className="mt-10 px-4 gap-2 flex-row items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            className="w-14 h-14 border-2 border-white rounded-full"
          />
          <View className="gap-1">
            <Text className="text-3xl font-semibold text-white">
              Welcome! {userName?.name || "User"}
            </Text>
            <Text className="text-gray-400">📍 Florida, USA</Text>
          </View>
        </View>

        {/* Wave Effect */}
        <Svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1440 360">
          <Path
            fill="#ffffff"
            d="M0,200L80,190C160,180,320,160,480,170C640,180,800,220,960,220C1120,220,1280,180,1360,160L1440,140V320H0Z"
          />
        </Svg>
      </View>

      {/* Grid of Menu Items */}
      <View className="flex flex-wrap flex-row mt-10 justify-center gap-4 p-4">
        {imageData.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            className="relative w-52 h-28 flex items-center justify-center"
            onPress={() => handlePress(item.screen)}
          >
            <Image source={item.source} className="w-full h-full absolute" />
            <View className="absolute flex items-center">
              <Icon name={item.icon} size={24} color="white" />
              <Text className="text-white text-lg font-semibold mt-1">{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MenuHeader;
