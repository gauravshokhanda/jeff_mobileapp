import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const PlanCard = ({ title, price, features, onExplore }) => (
  <View className="bg-white rounded-2xl shadow-md shadow-black/20 mb-6 mx-4 p-5 w-[90%] self-center">
    <Text className="text-xl font-bold text-sky-950 mb-1">{title}</Text>
    <Text className="text-base text-sky-900 font-semibold mb-3">
      ${price}/month
    </Text>
    <View className="mb-4 space-y-1">
      {features.map((feature, index) => (
        <Text key={index} className="text-gray-700 text-sm">
          • {feature}
        </Text>
      ))}
    </View>
    <TouchableOpacity
      onPress={onExplore}
      className="bg-sky-950 py-2 px-4 rounded-lg self-start"
    >
      <Text className="text-white font-semibold text-sm">Explore</Text>
    </TouchableOpacity>
  </View>
);

const PremiumPlansScreen = () => {
  const token = useSelector((state) => state.auth.token);

  const requireLogin = () => {
    Alert.alert(
      "Sign In Required",
      "Please sign in to explore premium plans.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign In",
          onPress: () => router.push("/SignIn"),
        },
      ],
      { cancelable: true }
    );
  };

  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open the link.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-950">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
      <View className="flex-row items-center px-4 mb-4">
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="white" />
  </TouchableOpacity>
  <Text className="text-white text-xl font-bold ml-4">
    Premium Subscription Plans
  </Text>
</View>

        <PlanCard
          title="User Premium Plan"
          price="4.99"
          features={[
            "Unlimited posts",
            "Unlimited contractor proposals",
            "Boosted visibility",
            "Direct messaging & calls",
            "Priority support",
          ]}
          onExplore={requireLogin}
        />

        <PlanCard
          title="General Contractor Plan"
          price="9.99"
          features={[
            "Unlimited access to user posts",
            "Submit unlimited proposals",
            "Direct messaging & calls",
            "Verified contractor badge",
            "Featured in top contractor list",
            "Priority support",
          ]}
          onExplore={requireLogin}
        />

        <PlanCard
          title="Real Estate Contractor Plan"
          price="19.99"
          features={[
            "List unlimited properties",
            "Boosted visibility",
            "Direct messaging & calls",
            "Verified contractor badge",
            "Featured to top contractors",
            "Priority support",
          ]}
          onExplore={requireLogin}
        />

        {/* Legal Notice Block */}
        <View className="mt-6 px-6">
          <Text className="text-lg text-center text-white leading-6">
            By subscribing, you agree to our{' '}
            <Text
              className="underline"
              onPress={() => openURL("https://ac5d.com/terms-of-use")}
            >
              Terms of Use
            </Text>{' '}
            and{' '}
            <Text
              className="underline"
              onPress={() => openURL("https://ac5d.com/privacy-policy")}
            >
              Privacy Policy
            </Text>, and Apple’s{' '}
            <Text
              className="underline"
              onPress={() =>
                openURL(
                  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                )
              }
            >
              End User License Agreement
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PremiumPlansScreen;
