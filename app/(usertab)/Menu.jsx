import React from "react";
import { View, Text, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from 'react-redux';

const Menu = () => {
  const userName = useSelector((state) => state.auth.user);
  return (
    <View className={`flex-1 bg-gray-900 px-5 ${Platform.OS === 'ios' ? 'mt-9' : ''}`}>
      <View className="mt-12 px-5">
        <Text className="text-3xl font-semibold text-white">Hi  {userName.name ? userName.name : "unknown"}</Text>
        <Text className="text-gray-400">Welcome to your personal space</Text>
      </View>

      <View className="flex-row flex-wrap mt-5 justify-between">
        {menuItems.map((item, index) => (
          <View
            key={index}
            className="w-[47%] h-24 my-2 bg-gray-800 rounded-lg p-3 justify-center"
          >
            <Icon name={item.icon} size={24} color="#FFFFFF" />
            <Text className="text-white font-medium mt-1">{item.title}</Text>
            {item.subtitle && <Text className="text-gray-400">{item.subtitle}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};

const menuItems = [
  { icon: 'analytics', title: 'Discover Plus+', subtitle: 'Boost your chances' },
  { icon: 'manage-search', title: 'Search Orders', subtitle: 'Saved Searches' },
  { icon: 'favorite-border', title: 'Favorites' },
  { icon: 'credit-card', title: 'Financing', subtitle: 'Interest & rates' },
  { icon: 'notifications', title: 'Notifications', subtitle: '0 new' },
  { icon: 'verified-user', title: 'Profile', subtitle: 'Applicant portfolios' },
  { icon: 'house', title: 'ImmoKlub', subtitle: 'Insure your home' },
  { icon: 'lock', title: 'Account', subtitle: 'Contracts & data' },
  { icon: 'settings', title: 'Settings', subtitle: 'Language, design...' },
];

export default Menu;