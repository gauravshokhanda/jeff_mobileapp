import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  useIAP,
  requestSubscription,
  validateReceiptIos,
  PurchaseError,
} from "react-native-iap";
import Constants from "expo-constants";

const ITUNES_SHARED_SECRET = Constants.expoConfig?.extra?.itunesSharedSecret;

const isIos = Platform.OS === "ios";
const subscriptionSkus = isIos ? ["AC5Dsubscription"] : [];

const PlanCard = ({
  title,
  price,
  features,
  buttonText,
  isCurrent = false,
  onSubscribe,
  loading,
  owned,
}) => (
  <View className="bg-white rounded-2xl px-6 py-4 mb-8 shadow-md shadow-black/20 mx-6">
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
        isCurrent || owned ? "bg-gray-200" : "bg-gray-900"
      }`}
      disabled={isCurrent || owned || loading}
      onPress={onSubscribe}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={`text-center font-semibold text-base ${
            isCurrent || owned ? "text-gray-900" : "text-white"
          }`}
        >
          {owned ? "Subscribed" : buttonText}
        </Text>
      )}
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
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState(false);

  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
    purchaseHistory,
    getPurchaseHistory,
  } = useIAP();

  const premiumSku = subscriptionSkus[0];

  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus: subscriptionSkus });
      getPurchaseHistory();
    }
  }, [connected]);

  useEffect(() => {
    if (purchaseHistory.find((item) => item.productId === premiumSku)) {
      setOwned(true);
    }
  }, [purchaseHistory]);

  useEffect(() => {
    const validatePurchase = async () => {
      if (currentPurchase?.transactionReceipt) {
        try {
          const receipt = currentPurchase.transactionReceipt;
          const response = await validateReceiptIos(
            {
              "receipt-data": receipt,
              password: ITUNES_SHARED_SECRET,
            },
            __DEV__
          );
          if (response.status === 0) {
            setOwned(true);
            finishTransaction(currentPurchase);
            Alert.alert("Subscription", "Purchase successful!");
          } else {
            Alert.alert("Subscription", "Receipt invalid.");
          }
        } catch (err) {
          console.error("Validation error", err);
        }
      }
    };

    validatePurchase();
  }, [currentPurchase]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await requestSubscription({ sku: premiumSku });
    } catch (error) {
      setLoading(false);
      if (error instanceof PurchaseError) {
        Alert.alert("Purchase Error", error.message);
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
      }
    }
  };

  const plans = [
    {
      id: "1",
      title: "Free Plan",
      price: "0",
      features: [
        "Create profile",
        "View up to 5 posts/month",
        "Submit 1 proposal/month",
        "Basic visibility",
      ],
      buttonText: "Current Plan",
      isCurrent: true,
    },
    {
      id: "2",
      title: "Premium Plan",
      price: "19.99",
      features: [
        "Unlimited access to user posts",
        "Submit unlimited proposals",
        "Direct messaging & calls",
        "Verified contractor badge",
        "Featured in top contractor list",
        "Priority support",
      ],
      buttonText: "Subscribe Now",
      onSubscribe: handleSubscribe,
      loading,
      owned,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-sky-950 pt-14 pb-4">
      {/* Header */}
      <View className="flex-row items-center space-x-4 mb-6 justify-evenly px-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-white">
          Choose the Right Plan
        </Text>
      </View>

      {/* Notice */}
      <View className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg mb-6 mx-4">
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
