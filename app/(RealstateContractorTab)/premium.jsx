import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  useIAP,
  requestSubscription,
  validateReceiptIos,
  finishTransaction,
  PurchaseError,
} from "react-native-iap";
import { useSelector } from "react-redux";
import Constants from "expo-constants";

const sharedSecret = Constants.expoConfig?.extra?.itunesSharedSecret;
const isIos = Platform.OS === "ios";

const subscriptionSkus = isIos ? ["realestatecontractorplan"] : [];

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
  const [loadingSku, setLoadingSku] = useState("");
  const {
    connected,
    currentPurchase,
    getSubscriptions,
    getPurchaseHistory,
  } = useIAP();

  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus: subscriptionSkus })
        .then((subscriptions) =>
          console.log("Available Subscriptions:", subscriptions)
        )
        .catch((err) => console.error("Error fetching subscriptions:", err));

      getPurchaseHistory()
        .then((history) => console.log("Purchase History:", history))
        .catch((err) => console.error("Error fetching purchase history:", err));
    }
  }, [connected]);

  useEffect(() => {
    const validateAndActivate = async () => {
      if (!currentPurchase) return;

      let receipt = currentPurchase.transactionReceipt;

      if (!receipt && currentPurchase.originalJson) {
        try {
          const parsed = JSON.parse(currentPurchase.originalJson);
          receipt = parsed?.receipt;
        } catch (e) {
          console.error("❌ Failed to parse originalJson:", e);
        }
      }

      if (!receipt || receipt.length < 100) {
        Alert.alert("Error", "No valid receipt found.");
        return;
      }

      try {
        let response = await validateReceiptIos({
          "receipt-data": receipt,
          password: sharedSecret,
        });

        if (response?.status === 21007) {
          response = await validateReceiptIos(
            {
              "receipt-data": receipt,
              password: sharedSecret,
            },
            true
          );
        }

        if (response?.status === 0) {
          await finishTransaction(currentPurchase);

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
          Alert.alert("Receipt Validation Failed", `Status: ${response?.status}`);
        }
      } catch (err) {
        console.error("Receipt validation failed:", err);
        Alert.alert("Error", "Validation or activation failed.");
      } finally {
        setLoadingSku("");
      }
    };

    validateAndActivate();
  }, [currentPurchase]);

  const handleSubscribe = async (sku) => {
    if (sku !== "realestatecontractorplan") return;

    try {
      if (!connected) {
        Alert.alert("IAP Error", "In-App Purchases are not connected.");
        return;
      }

      setLoadingSku(sku);
      await requestSubscription({ sku });
    } catch (error) {
      setLoadingSku("");
      console.error("Subscription error:", error);
      if (error instanceof PurchaseError) {
        Alert.alert("Purchase Error", `${error.code}: ${error.message}`);
      } else {
        Alert.alert("Unknown Error", error.message || "Something went wrong");
      }
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
      buttonText: "", // no button text needed
      sku: "", // no SKU needed
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
      sku: "realestatecontractorplan", // ✅ new active SKU here
      isCurrent: false,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-sky-950 px-6 py-14">
      <View className="flex-row justify-center gap-5 items-center space-x-4 mt-10 mb-6">
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
