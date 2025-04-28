import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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

  return (
    <ScrollView className="flex-1 bg-sky-950 px-6 pt-14 pb-20">
      {/* Header */}
      <View className="flex-row items-center space-x-4 mb-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-white">
          Choose the Right Plan
        </Text>
      </View>

      {/* Plan Cards */}
      <PlanCard
        title="Free Plan"
        price="0"
        features={[
          "  Create profile",
          "  View up to 5 posts/month",
          "  Submit 1 proposal/month",
          "  Basic visibility",
        ]}
        buttonText="Current Plan"
        isCurrent
      />

      <PlanCard
        title="Premium Plan"
        price="19.99"
        features={[
          "  Unlimited access to user posts",
          "  Submit unlimited proposals",
          "  Direct messaging & calls",
          "  Verified contractor badge",
          "  Featured in top contractor list",
          "  Priority support",
        ]}
        buttonText="Get started"
      />
    </ScrollView>
  );
};

export default GeneralContractorPlans;
