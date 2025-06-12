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

const subscriptionSkus = Platform.OS === "ios" ? ["AC5DUserSubscriptionPlan"] : [];
const ITUNES_SHARED_SECRET = Constants.expoConfig?.extra?.itunesSharedSecret;

const PlanCard = ({
  title,
  price,
  features,
  buttonText,
  isCurrent = false,
  onSubscribe,
  loading,
  showButton = true,
}) => (
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
          isCurrent ? "bg-gray-200" : "bg-gray-900"
        }`}
        disabled={isCurrent || loading}
        onPress={onSubscribe}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text
            className={`text-center font-semibold text-base ${
              isCurrent ? "text-gray-900" : "text-white"
            }`}
          >
            {buttonText}
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

const UserPlans = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState(false);
  const { connected, getSubscriptions } = useIAP();

  const premiumSku = subscriptionSkus[0];
  const planPrice = "4.99";

  useEffect(() => {
    if (token) {
      API.get("/premium/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.data.premium === true) setOwned(true);
        })
        .catch((err) => {
          console.log("Fetch premium status failed:", err.message);
        });
    }
  }, [token]);

  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus: subscriptionSkus });
    }
  }, [connected]);

  useEffect(() => {
    const purchaseUpdateSub = purchaseUpdatedListener(async (purchase) => {
      if (!purchase?.transactionReceipt || purchase.productId !== premiumSku) return;

      const receipt = purchase.transactionReceipt;

      // Fire Apple Production API (non-blocking)
      const appleValidationPromise = fetch("https://buy.itunes.apple.com/verifyReceipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "receipt-data": receipt,
          password: ITUNES_SHARED_SECRET,
        }),
      }).then((res) => res.json());

      // Fire backend
      API.post(
        "/premium/subscribe",
        {
          receipt,
          productId: purchase.productId,
          platform: Platform.OS,
          price: planPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          setOwned(true);
        })
        .catch((err) => {
          console.log("Backend subscription error:", err.message);
        });

      try {
        const response = await appleValidationPromise;
        if (response.status === 0) {
          await finishTransaction(purchase);
        }
      } catch (err) {
        console.log("Apple validation error:", err.message);
      } finally {
        setLoading(false);
      }
    });

    const errorSub = purchaseErrorListener((error) => {
      console.log("Purchase error:", error.message);
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
    }
  };

  const plans = [
    {
      id: "1",
      title: "Free Plan",
      price: "0",
      features: [
        "Create profile",
        "Mark property on map",
        "Upload 1 post only",
        "Receive limited proposals",
        "Basic support",
      ],
      buttonText: "Current Plan",
      isCurrent: !owned,
      showButton: !owned, // Hide button if subscribed
    },
    {
      id: "2",
      title: "Premium Plan",
      price: planPrice,
      features: [
        "Unlimited posts",
        "Unlimited contractor dproposals",
        "Boosted visibility",
        "Direct messaging & calls",
        "Priority support",
      ],
      buttonText: owned ? "Subscribed" : "Subscribe Now",
      isCurrent: owned,
      onSubscribe: handleSubscribe,
      loading,
      showButton: true,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-sky-950 px-6 pt-14 pb-4">
      <View className="flex-row items-center space-x-4 mt-10 mb-6 justify-evenly">
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

      <View className="px-6 mt-4 mb-2">
        <Text className="text-lg text-center text-white leading-5">
          By subscribing, you agree to our{" "}
          <Text
            className="underline"
            onPress={() => Linking.openURL("https://ac5d.com/terms-of-use")}
          >
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text
            className="underline"
            onPress={() => Linking.openURL("https://ac5d.com/privacy-policy")}
          >
            Privacy Policy
          </Text>
          , and Apple’s{" "}
          <Text
            className="underline"
            onPress={() =>
              Linking.openURL(
                "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
              )
            }
          >
            EULA
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserPlans;
