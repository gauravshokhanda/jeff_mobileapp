import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
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
import Constants from "expo-constants";

const subscriptionSkus = Platform.OS === "ios" ? ["userplan"] : [];
const ITUNES_SHARED_SECRET =
  Constants?.manifest2?.extra?.itunesSharedSecret ||
  Constants?.expoConfig?.extra?.itunesSharedSecret;

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

const GeneralUserPlans = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState(false);

  const {
    connected,
    currentPurchase,
    getSubscriptions,
    getPurchaseHistory,
    purchaseHistory,
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
      const time = parseInt(sub.transactionDateMs || "0", 10);
      const now = Date.now();
      const diff = now - time;
      if (diff < 5 * 60 * 1000) {
        setOwned(true);
      } else {
        setOwned(false);
      }
    } else {
      setOwned(false);
    }
  }, [purchaseHistory]);

  useEffect(() => {
    const validate = async () => {
      if (currentPurchase?.transactionReceipt) {
        try {
          const receipt = currentPurchase.transactionReceipt;
          const response = await validateReceiptIos(
            {
              "receipt-data": receipt,
              password: ITUNES_SHARED_SECRET,
            },
            true
          );

          if (response?.status === 0) {
            await finishTransaction(currentPurchase);
            setOwned(true);
            Alert.alert("Success", "Subscribed successfully!");
          } else {
            Alert.alert("Validation Failed", `Status: ${response.status}`);
          }
        } catch (err) {
          Alert.alert("Error", "Receipt validation failed");
        } finally {
          setLoading(false);
        }
      }
    };
    validate();
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
        Alert.alert("Error", error.message || "Subscription failed.");
      }
    }
  };

  const plans = [
    {
      id: "1",
      title: "Free Plan",
      price: "0",
      features: [
        "  Create profile",
        "  Mark property on map",
        "  Upload 1 post only",
        "  Receive limited proposals",
        "  Basic support",
      ],
      buttonText: "Current Plan",
      isCurrent: owned === false,
    },
    {
      id: "2",
      title: "Premium Plan",
      price: "4.99",
      features: [
        "  Unlimited posts",
        "  Unlimited contractor proposals",
        "  Boosted visibility",
        "  Direct messaging & calls",
        "  Priority support",
      ],
      buttonText: "Get started",
      onSubscribe: handleSubscribe,
      loading,
      owned,
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
    </SafeAreaView>
  );
};

export default GeneralUserPlans;
