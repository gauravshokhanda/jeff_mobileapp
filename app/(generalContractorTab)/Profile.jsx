import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Using Feather icons from vector-icons

export default function Dashboard() {
  const menuItems = [
    { title: "Discover Plus+", subtitle: "Boost your chances", icon: "bar-chart" },
    { title: "Search Post", subtitle: "Saved Searches", icon: "search" },
    { title: "Favorites", subtitle: "", icon: "heart" },
    { title: "Financing", subtitle: "Interest & rates", icon: "home" },
    { title: "Notifications", subtitle: "0 new", icon: "bell" },
    { title: "Profile", subtitle: "Applicant portfolios", icon: "user" },
    { title: "ImmoKlub", subtitle: "Insure your home", icon: "home" },
    { title: "Account", subtitle: "Contracts & data", icon: "lock" },
    { title: "Settings", subtitle: "Language, design...", icon: "settings" },
  ];

  return (
    <View className="flex-1 bg-sky-950 p-5">
      <View className="mt-20">
      <Text className="text-white text-2xl font-bold">Hi Abhijeet Sodlan</Text>
      <Text className="text-gray-300 text-sm mb-4">Welcome to your personal space</Text>
      </View>

      <ScrollView>
        <View className="flex flex-wrap flex-row gap-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} className="bg-sky-900 p-4 h-24 rounded-lg gap-2 w-[48%] flex flex-row items-center space-x-3">
              <Icon name={item.icon} size={26} color="white" />
              <View>
                <Text className="text-white font-semibold">{item.title}</Text>
                {item.subtitle ? <Text className="text-gray-300 text-xs">{item.subtitle}</Text> : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
