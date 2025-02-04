import React from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

const Menu = () => {
  const router = useRouter();
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
    <View className={`flex-1 bg-sky-950 px-5 ${Platform.OS === "ios" ? "mt-16" : ""}`}>
      <View className="mt-12 px-5">
        <Text className="text-3xl font-semibold text-white">
          Hi {userName.name ? userName.name : "unknown"}
        </Text>
        <Text className="text-gray-400">Welcome to your personal space</Text>
      </View>

      <View className="flex-row flex-wrap mt-5 justify-between">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="w-[47%] h-24 my-2 bg-sky-900 rounded-xl p-3 justify-center border border-gray-500"
            onPress={() => router.push(item.route)}
          >
            <Icon name={item.icon} size={24} color="#FFFFFF" />
            <Text className="text-white font-medium mt-1">{item.title}</Text>
            {item.subtitle && <Text className="text-gray-400">{item.subtitle}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Menu;
