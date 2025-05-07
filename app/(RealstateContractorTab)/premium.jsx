import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";

const PlanCard = ({
  title,
  price,
  features,
  buttonText,
  isCurrent = false,
}) => (
  <View className="bg-white rounded-2xl px-6 py-8 mb-8 shadow-md shadow-black/20">
    <Text className="text-center text-lg font-semibold text-gray-800 mb-2">
      {title}
    </Text>
    <Text className="text-center text-3xl font-bold text-black">
      ${price}
      <Text className="text-base font-medium text-gray-500"> /month</Text>
    </Text>
    <TouchableOpacity
      activeOpacity={0.85}
      className={`mt-6 mb-6 px-4 py-3 rounded-md ${
        isCurrent ? "bg-gray-200" : "bg-gray-900"
      }`}
    >
      <Text
        className={`text-center font-semibold text-base ${
          isCurrent ? "text-gray-900" : "text-white"
        }`}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
    <View className="space-y-4">
      {features.map((feature, index) => (
        <View key={index} className="flex-row items-start space-x-3">
          <Feather name="check" size={18} color="#22c55e" />
          <Text className="text-gray-800 text-base">{feature}</Text>
        </View>
      ))}
    </View>
  </View>
);

const GeneralContractorPlans = () => {
  const navigation = useNavigation();

  const plans = [
    {
      id: "1",
      title: "Free Plan",
      price: "19.99",
      features: [
        "  Create profile",
        "  List up to 3 properties/month",
        "  Basic visibility to users",
        "  Basic support",
      ],
      buttonText: "Current Plan",
      isCurrent: true,
    },
    {
      id: "2",
      title: "Premium Plan",
      price: "39.99",
      features: [
        "  List unlimited properties",
        "  Boosted visibility",
        "  Direct messaging & calls",
        "  Verified contractor badge",
        "  Featured in top contractor list",
        "  Priority support",
      ],
      buttonText: "Get started",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-sky-950 px-6 pt-14 pb-4">
      {/* Header */}
      <View className="flex-row items-center space-x-4 mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-white">
          Choose the Right Plan
        </Text>
      </View>

      {/* Notice */}
      <View className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
        <Text className="text-yellow-800 font-semibold">
          ⚠️ These plans are not currently active. We’ll notify you once they
          become available.
        </Text>
      </View>

      {/* Plan List */}
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlanCard {...item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
};

export default GeneralContractorPlans;
