import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
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
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../config/apiConfig";
import Constants from "expo-constants";

const ITUNES_SHARED_SECRET = Constants.expoConfig?.extra?.itunesSharedSecret;
const isIos = Platform.OS === "ios";
const subscriptionSkus = isIos ? ["AC5DRealtorSubscriptionPlan"] : [];

const PlanCard = ({
  title,
  price,
  features,
  buttonText,
  isCurrent,
  loading,
  onSubscribe,
  owned,
}) => (
  <View className="bg-white rounded-2xl px-6 py-4 mb-8 shadow-md shadow-black/20 mx-6">
    <Text className="text-center text-lg font-semibold text-gray-800 mb-2">
      {title}
    </Text>
    <Text className="text-center text-3xl font-bold text-black">
      ${price}
      <Text className="text-base font-medium text-gray-500">
        {price === "0" ? "/Week" : "/month"}
      </Text>
    </Text>

    {price !== "0" && (
      <View className="mt-2 mb-4">
        <Text className="text-sm text-center text-gray-600">
          Auto-renewable subscription
        </Text>
        <Text className="text-xs text-center text-gray-500 mt-1">
          Billed monthly. Auto-renews unless canceled at least 24 hours before
          the end of the current period.
        </Text>
      </View>
    )}

    {/* Button Logic */}
    {isCurrent && owned ? (
      <TouchableOpacity
        className="mt-2 mb-6 px-4 py-3 rounded-md bg-gray-200"
        disabled
      >
        <Text className="text-center font-semibold text-base text-gray-900">
          Subscribed
        </Text>
      </TouchableOpacity>
    ) : !isCurrent && !owned ? (
      <TouchableOpacity
        activeOpacity={0.85}
        className="mt-2 mb-6 px-4 py-3 rounded-md bg-gray-900"
        disabled={loading}
        onPress={onSubscribe}
      >
        <Text className="text-center font-semibold text-base text-white">
          {loading ? "Processing..." : buttonText}
        </Text>
      </TouchableOpacity>
    ) : null}

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

const RealContractorPlans = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);
  const [loadingSku, setLoadingSku] = useState("");
  const [owned, setOwned] = useState(false);
  const { connected, getSubscriptions } = useIAP();

  const premiumSku = subscriptionSkus[0];

  useEffect(() => {
    if (!token) return;

    API.get("premium/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.data.premium === true) {
          setOwned(true);
        }
        console.log("🔐 Premium status:", res.data.premium);
      })
      .catch((err) => {
        console.log("❌ Premium check failed:", err.message);
      });
  }, [token]);

  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus: subscriptionSkus })
        .then((subs) => console.log("✅ Subscriptions:", subs))
        .catch((err) => console.log("❌ Subscription fetch error:", err.message));
    }
  }, [connected]);

  useEffect(() => {
    if (!token) return;

    const purchaseUpdateSub = purchaseUpdatedListener(async (purchase) => {
      console.log("🛒 Purchase Updated:", purchase);
      setLoadingSku(purchase.productId);

      const receipt = purchase.transactionReceipt;
      if (!receipt) {
        setLoadingSku("");
        return;
      }

      const appleValidationPromise = axios.post(
        "https://buy.itunes.apple.com/verifyReceipt",
        {
          "receipt-data": receipt,
          password: ITUNES_SHARED_SECRET,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      API.post(
        "premium/subscribe",
        {
          price: "19.99",
          receipt,
          productId: purchase.productId,
          platform: Platform.OS,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          console.log("📡 Backend response:", res.data);
          setOwned(true);
        })
        .catch((err) => {
          console.log("❌ Backend error:", err.message);
        });

      try {
        const response = await appleValidationPromise;
        console.log("🧾 Apple Response:", response.data);

        if (response.data.status === 0) {
          await finishTransaction(purchase);
          console.log("✅ Apple transaction finished.");
        } else {
          console.log("❌ Apple status invalid:", response.data.status);
        }
      } catch (err) {
        console.log("❌ Apple validation error:", err.message);
      } finally {
        setLoadingSku("");
      }
    });

    const errorSub = purchaseErrorListener((error) => {
      console.log("❌ Purchase Error:", error.message);
      setLoadingSku("");
    });

    return () => {
      purchaseUpdateSub.remove();
      errorSub.remove();
    };
  }, [token]);

  const handleSubscribe = async (sku) => {
    try {
      if (!connected) {
        console.log("⚠️ IAP not connected");
        return;
      }
      setLoadingSku(sku);
      await requestSubscription({ sku });
    } catch (error) {
      setLoadingSku("");
      console.log("❌ Subscription Error:", error.message);
    }
  };

  const plans = [
    {
      id: "1",
      title: "Contractor Basic",
      price: "0",
      features: [
        "Create profile",
        "List 3 properties",
        "Basic visibility to users",
        "Basic support",
      ],
      buttonText: "",
      sku: "",
      isCurrent: !owned,
    },
    {
      id: "2",
      title: "Contractor Pro",
      price: "19.99",
      features: [
        "List Unlimited properties",
        "Boosted visibility",
        "Direct messaging & calls",
        "Verified contractor badge",
        "Featured to top contractors",
        "Priority support",
      ],
      buttonText: owned ? "Subscribed" : "Get Started",
      sku: premiumSku,
      isCurrent: owned,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-sky-950 px-6 py-14">
      <View className="flex-row justify-center gap-5 items-center mt-10 mb-6">
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
        renderItem={({ item }) => (
          <PlanCard
            {...item}
            loading={loadingSku === item.sku}
            onSubscribe={() => handleSubscribe(item.sku)}
            owned={owned}
          />
        )}
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

export default RealContractorPlans;
