import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  useIAP,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
} from "react-native-iap";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { API } from "../../config/apiConfig"; 
import axios from "axios";

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
}) => {
  const showButton = price !== "0" || !owned;

  return (
    <View className="bg-white rounded-2xl px-6 py-4 mb-8 shadow-md shadow-black/20 mx-6">
      <Text className="text-center text-lg font-semibold text-gray-800 mb-2">{title}</Text>
      <Text className="text-center text-3xl font-bold text-black">
        ${price}
        <Text className="text-base font-medium text-gray-500">
          {price === "0" ? " First 5 days" : "/week"}
        </Text>
      </Text>

      {price !== "0" && (
        <View className="mt-2 mb-4">
          <Text className="text-sm text-center text-gray-600">
            Auto-renewable subscription
          </Text>
          <Text className="text-xs text-center text-gray-500 mt-1">
            Billed weekly. Auto-renews unless canceled at least 24 hours before
            the end of the current period.
          </Text>
        </View>
      )}

      {showButton && (
        <TouchableOpacity
          activeOpacity={0.85}
          className={`mt-6 mb-6 px-4 py-3 rounded-md ${
            isCurrent || owned ? "bg-gray-200" : "bg-gray-900"
          }`}
          disabled={isCurrent || owned || loading}
          onPress={onSubscribe}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
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
      )}

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
};


const GeneralContractorPlans = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState(false);
  const { connected, getSubscriptions } = useIAP();

  const premiumSku = subscriptionSkus[0];
  const planPrice = "9.99";

  // ✅ Check subscription status from backend on screen load
  useEffect(() => {
    if (!token) return;

    API.get("premium/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.data.premium) {
          setOwned(true);
        }
        console.log("Premium status:", res.data.premium);
      })
      .catch((err) => {
        console.log("Error checking premium:", err.message);
      });
  }, [token]);

  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus: subscriptionSkus });
    }
  }, [connected]);

  useEffect(() => {
    if (!token) return;

    const purchaseUpdateSub = purchaseUpdatedListener(async (purchase) => {
      console.log("🛒 Purchase Updated:", purchase);
      const receipt = purchase.transactionReceipt;

      if (!receipt || purchase.productId !== premiumSku) {
        return;
      }

      // 🔁 Start Apple production validation (non-blocking)
      const appleValidationPromise = axios.post(
        "https://buy.itunes.apple.com/verifyReceipt", // ✅ production endpoint
        {
          "receipt-data": receipt,
          password: ITUNES_SHARED_SECRET,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // 🔥 Notify backend immediately
      API.post(
        "premium/subscribe",
        {
          receipt,
          productId: purchase.productId,
          platform: Platform.OS,
          price: "9.99",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          console.log("✅ Backend subscription success:", res.data);
          setOwned(true);
        })
        .catch((err) => {
          console.log("Backend subscription error:", err.message);
        });

      try {
        const response = await appleValidationPromise;
        console.log("🍏 Apple Receipt Validation:", response.data);

        if (response?.data?.status === 0) {
          await finishTransaction(purchase);
        }
      } catch (err) {
        console.log("Apple Validation Error:", err.message);
      } finally {
        setLoading(false);
      }
    });

    const errorSub = purchaseErrorListener((error) => {
      console.log("❌ Purchase Error:", error.message);
      setLoading(false);
    });

    return () => {
      purchaseUpdateSub.remove();
      errorSub.remove();
    };
  }, [token]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await requestSubscription({ sku: premiumSku });
    } catch (error) {
      setLoading(false);
      console.log("Subscription Error:", error.message);
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
      isCurrent: !owned, // if not subscribed, mark free plan as current
      owned, // required for logic in PlanCard
    },
    {
      id: "2",
      title: "Premium Plan",
      price: planPrice,
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
      isCurrent: owned,
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
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View className="px-6 mt-4 mb-2">
        <Text className="text-lg text-center text-white leading-5">
          By subscribing, you agree to our{" "}
          <Text className="underline" onPress={() => Linking.openURL("https://ac5d.com/terms-of-use")}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text className="underline" onPress={() => Linking.openURL("https://ac5d.com/privacy-policy")}>
            Privacy Policy
          </Text>
          , and Apple’s{" "}
          <Text className="underline" onPress={() => Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")}>
            EULA
          </Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default GeneralContractorPlans;
