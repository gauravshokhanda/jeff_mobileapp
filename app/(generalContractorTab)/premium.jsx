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

          if (Platform.OS === "ios") {
            const response = await validateReceiptIos(
              {
                "receipt-data": receipt,
                password: ITUNES_SHARED_SECRET,
              },
              __DEV__
            );

            const isValid = response?.status === 0;

            if (isValid) {
              await finishTransaction(currentPurchase);
              setOwned(true);
              setLoading(false);
              Alert.alert("Subscription", "Purchase successful!");
            } else {
              setLoading(false);
              Alert.alert("Subscription", "Receipt validation failed.");
            }
          }
        } catch (err) {
          setLoading(false);
          console.error("Receipt validation error", err);
          Alert.alert("Error", "Something went wrong validating your purchase.");
        }
      }
    };

    validatePurchase();
  }, [currentPurchase]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      console.log("🛒 Trying to request subscription:", premiumSku);
  
      if (!connected) {
        console.warn("❌ IAP not connected");
        Alert.alert("Connection Error", "In-App Purchase system not connected.");
        setLoading(false);
        return;
      }
  
      if (!premiumSku) {
        console.warn("❌ SKU is missing or invalid");
        Alert.alert("Configuration Error", "Subscription product ID is missing.");
        setLoading(false);
        return;
      }
  
      if (!isIos) {
        console.warn("❌ Cannot test on non-iOS platforms");
        Alert.alert("Platform Error", "This subscription only works on iOS.");
        setLoading(false);
        return;
      }
  
      // Main call: this triggers sandbox purchase sheet
      await requestSubscription({ sku: premiumSku });
      console.log("✅ requestSubscription() called successfully");
  
    } catch (error) {
      console.error("❌ Subscription Error:", error);
  
      setLoading(false);
  
      if (error instanceof PurchaseError) {
        const msg = `[${error.code}] ${error.message}`;
        Alert.alert("Purchase Error", msg);
      } else {
        // Possible causes: sandbox not logged in, App Store connect issue, product not approved, etc.
        if (error.message?.includes("E_IAP_NOT_AVAILABLE")) {
          Alert.alert("IAP Not Available", "Make sure you're using a real device and IAP is enabled in Xcode.");
        } else if (error.message?.includes("not found")) {
          Alert.alert("Invalid Product", "Product ID not found in App Store. Check if it's approved and matches exactly.");
        } else if (error.message?.includes("Could not find")) {
          Alert.alert("Apple ID Issue", "You might not be signed in with a sandbox Apple ID.");
        } else {
          Alert.alert("Unknown Error", error.message || "Something went wrong. Try again.");
        }
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
      isCurrent: !owned,
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
      buttonText: owned ? "Subscribed" : "Subscribe Now",
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
