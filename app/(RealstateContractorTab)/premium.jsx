import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  useIAP,
  requestSubscription,
  validateReceiptIos,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
} from "react-native-iap";
import { useSelector } from "react-redux";
import Constants from "expo-constants";

const ITUNES_SHARED_SECRET = Constants.expoConfig?.extra?.itunesSharedSecret;
const isIos = Platform.OS === "ios";

// 🔑 This array MUST exactly match the product IDs you configured in App Store Connect.
const subscriptionSkus = isIos
  ? ["AC5DUserSubscriptionPlan", "AC5DGeneralSubscriptionPlan", "AC5DRealtorSubscriptionPlan"]
  : [];

const PlanCard = ({
  title,
  price,
  features,
  buttonText,
  isCurrent,
  loading,
  onSubscribe,
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

    <TouchableOpacity
      activeOpacity={0.85}
      className={`mt-6 mb-6 px-4 py-3 rounded-md ${
        isCurrent ? "bg-gray-200" : "bg-gray-900"
      }`}
      disabled={isCurrent || loading}
      onPress={isCurrent ? null : onSubscribe}
    >
      <Text
        className={`text-center font-semibold text-base ${
          isCurrent ? "text-gray-900" : "text-white"
        }`}
      >
        {isCurrent ? "Current Plan" : loading ? "Processing..." : buttonText}
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

const RealContractorPlans = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);

  // We’ll manually manage `currentPurchase` because we need to call finishTransaction(...) ourselves.
  const [loadingSku, setLoadingSku] = useState("");
  const [currentPurchase, setCurrentPurchase] = useState(null);

  // useIAP hook provides `connected`, plus methods to fetch SKUs and history.
  const { connected, getSubscriptions, getPurchaseHistory } = useIAP();

  // 1) Fetch available subscriptions & history once IAP is connected
  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus: subscriptionSkus })
        .then((subscriptions) => console.log("✅ Subscriptions fetched:", subscriptions))
        .catch((err) => console.error("❌ Subscription fetch error:", err));

      getPurchaseHistory()
        .then((history) => console.log("🧾 Purchase History:", history))
        .catch((err) => console.error("❌ History fetch error:", err));
    }
  }, [connected]);

  // 2) Listen for purchase updates and errors
  useEffect(() => {
    const purchaseUpdateSub = purchaseUpdatedListener(async (purchase) => {
      console.log("🛒 Purchase Updated:", purchase);
      setCurrentPurchase(purchase);
    });

    const purchaseErrorSub = purchaseErrorListener((error) => {
      console.error("❌ Purchase Error:", error);
      Alert.alert("Purchase Error", error.message);
      setLoadingSku("");
    });

    return () => {
      purchaseUpdateSub.remove();
      purchaseErrorSub.remove();
    };
  }, []);

  // 3) Whenever `currentPurchase` changes, validate its receipt and call backend
  useEffect(() => {
    const validateAndActivate = async () => {
      if (!currentPurchase) return;

      // iOS usually provides transactionReceipt in currentPurchase.transactionReceipt
      let receipt = currentPurchase.transactionReceipt;

      // Some SDK versions bundle the receipt inside originalJson → { receipt: “…” }
      if (!receipt && currentPurchase.originalJson) {
        try {
          const parsed = JSON.parse(currentPurchase.originalJson);
          receipt = parsed?.receipt;
        } catch (e) {
          console.error("❌ Failed to parse originalJson:", e);
        }
      }

      // If `receipt` is missing or too short, alert the user
      if (!receipt || receipt.length < 100) {
        Alert.alert("Error", "No valid receipt found.");
        setLoadingSku("");
        return;
      }

      try {
        // 3.a) Send the receipt to Apple for validation
        let response = await validateReceiptIos(
          { "receipt-data": receipt, password: ITUNES_SHARED_SECRET },
          false // `false` → production; if that returns 21007, we’ll retry in sandbox
        );

        // 3.b) If this is a sandbox test receipt, retry with sandbox flag = true
        if (response?.status === 21007) {
          response = await validateReceiptIos(
            { "receipt-data": receipt, password: ITUNES_SHARED_SECRET },
            true
          );
        }

        // 3.c) If Apple returns status = 0 → success!
        if (response?.status === 0) {
          await finishTransaction(currentPurchase);

          // OPTIONAL: You can check expiration date in `response.latest_receipt_info[0].expires_date_ms`
          // to verify if the subscription is still active. For a quick demo/sandbox, we often skip that.

          // 3.d) Call your backend to “set-premium-badge”
          const res = await axios.post(
            "https://g32.iamdeveloper.in/api/user/set-premium-badge",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (res.status === 200) {
            Alert.alert("Subscribed", "Premium badge activated successfully.");
          } else {
            Alert.alert("Error", res.data?.message || "Activation failed.");
          }
        } else {
          // Apple validation returned a non-zero status
          Alert.alert("Validation Failed", `Status: ${response?.status}`);
        }
      } catch (err) {
        console.error("❌ Validation error:", err);
        Alert.alert("Error", "Receipt validation or activation failed.");
      } finally {
        setLoadingSku("");
      }
    };

    validateAndActivate();
  }, [currentPurchase]);

  // 4) Called when user taps “Get Started” on the “Contractor Pro” card
  const handleSubscribe = async (sku) => {
    try {
      if (!connected) {
        Alert.alert("Error", "In-App Purchases not connected.");
        return;
      }

      if (!sku) {
        Alert.alert("Error", "SKU is missing.");
        return;
      }

      setLoadingSku(sku);
      await requestSubscription({ sku });
    } catch (error) {
      setLoadingSku("");
      console.error("❌ Subscription error:", error);
      if (error instanceof PurchaseError) {
        Alert.alert("Purchase Error", `${error.code}: ${error.message}`);
      } else {
        Alert.alert("Unknown Error", error.message || "Something went wrong");
      }
    }
  };

  // 5) Define your two plans
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
      sku: "", // no in-app purchase for the free plan
      isCurrent: true,
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
      buttonText: "Get Started",
      sku: "AC5DRealtorSubscriptionPlan", // ⟵ exact App Store Connect ID
      isCurrent: false,
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
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
};

export default RealContractorPlans;
