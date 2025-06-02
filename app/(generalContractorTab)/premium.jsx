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
import { useSelector } from "react-redux";

const ITUNES_SHARED_SECRET = Constants.expoConfig?.extra?.itunesSharedSecret;
const isIos = Platform.OS === "ios";
const subscriptionSkus = isIos ? ["AC5DGeneralSubscriptionPlan"] : [];

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
    <Text className="text-center text-lg font-semibold text-gray-800 mb-2">{title}</Text>
    <Text className="text-center text-3xl font-bold text-black">
  ${price}
  <Text className="text-base font-medium text-gray-500">
    {price === "0" ? " First 5 days" : "/week"}
  </Text>
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

  const token = useSelector((state) => state.auth.token);

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
    const sub = purchaseHistory.find((item) => item.productId === premiumSku);

    if (sub?.transactionId?.includes("Sandbox")) {
      const purchaseTime = parseInt(sub.transactionDateMs || "0", 10);
      const now = Date.now();
      const elapsed = now - purchaseTime;

      console.log("⏱️ Time since purchase:", elapsed / 1000, "seconds");

      // Sandbox subscriptions last ~5 mins
      if (elapsed < 5 * 60 * 1000) {
        setOwned(true);
        console.log("✅ Owned set to true from recent sandbox purchase");
      } else {
        setOwned(false);
        console.log("⏳ Subscription expired — ready to purchase again");
      }
    } else {
      setOwned(false);
      console.log("ℹ️ No valid subscription found in purchaseHistory");
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

            console.log("🧾 Receipt validation response:", response);

            const isValid = response?.status === 0;

            if (isValid) {
              await finishTransaction(currentPurchase);
              setLoading(false);

              try {
                const res = await fetch("https://g32.iamdeveloper.in/api/user/set-premium-badge", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                });

                const result = await res.json();
                console.log("🚀 Backend API response:", result);

                if (res.ok) {
                  Alert.alert("Success", "Premium badge activated!");
                } else {
                  Alert.alert("Partial Success", result.message || "Purchase OK, but badge failed.");
                }
              } catch (e) {
                console.error("❌ Backend API error:", e);
                Alert.alert("Error", "Purchase succeeded but badge activation failed.");
              }
            } else {
              setLoading(false);
              console.warn("❌ Receipt invalid:", response);
              Alert.alert("Error", "Receipt validation failed.");
            }
          }
        } catch (err) {
          setLoading(false);
          console.error("❌ Receipt validation error:", err);
          Alert.alert("Error", "Something went wrong validating the receipt.");
        }
      }
    };

    validatePurchase();
  }, [currentPurchase]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      console.log("🛒 Requesting subscription:", premiumSku);

      if (!connected) {
        Alert.alert("IAP Error", "Not connected to IAP service.");
        setLoading(false);
        return;
      }

      if (!premiumSku) {
        Alert.alert("Error", "SKU is missing.");
        setLoading(false);
        return;
      }

      if (!isIos) {
        Alert.alert("Error", "This only works on iOS.");
        setLoading(false);
        return;
      }

      await requestSubscription({ sku: premiumSku });
      console.log("✅ requestSubscription() called");
    } catch (error) {
      console.error("❌ Subscription Error:", error);
      setLoading(false);

      if (error instanceof PurchaseError) {
        Alert.alert("IAP Error", `[${error.code}] ${error.message}`);
      } else {
        Alert.alert("Error", error.message || "Unknown error occurred.");
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
      price: "9.99",
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
      <View className="flex-row items-center space-x-4 mb-6 mt-10 justify-evenly px-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-white">
          Choose the Right Plan
        </Text>
      </View>

   
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
