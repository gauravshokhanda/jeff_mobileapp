import React from "react";
import { View, Text, Image, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";

const MenuHeader = () => {
  const userName = useSelector((state) => state.auth.user);

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
    <View className={`bg-sky-950 h-72  relative ${Platform.OS === "ios" ? "mt-16" : ""}`}>
      {/* User Info */}
      <View className="mt-12 px-5 flex-row items-center">
        <Image source={{ uri: "https://via.placeholder.com/50" }} className="w-12 h-12 rounded-full" />
        <View className="ml-3">
          <Text className="text-lg font-semibold text-white">Welcome! {userName?.name || "User"}</Text>
          <Text className="text-gray-400">📍 Florida, USA</Text>
        </View>
      </View>

      {/* Wave Effect at Bottom */}
      <Svg className="absolute bottom-0 left-0 w-full h-20" viewBox="0 0 1440 320">
        <Path
          fill="#ffffff"
          d="M0,224L80,213.3C160,203,320,181,480,192C640,203,800,245,960,245.3C1120,245,1280,203,1360,181.3L1440,160V320H0Z"
        />
      </Svg>
    </View>
  );
};

export default MenuHeader;
