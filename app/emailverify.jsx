import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EmailVerify() {
  const router = useRouter();
  const { email, role, otp: originalOtp } = useLocalSearchParams();
  const [otp, setOtp] = useState("");

  const verifyOtp = () => {
    if (otp === originalOtp) {
      Alert.alert("Success", "Email verified successfully!");
      InteractionManager.runAfterInteractions(() => {
        if (role == 3) {
          router.replace("/ContractorProfileComplete");
        } else if (role == 4) {
          router.replace("/(RealstateContractorTab)");
        } else {
          router.replace("/(usertab)");
        }
      });
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-xl font-bold text-center mb-6">Email Verification</Text>
      <Text className="text-gray-600 text-center mb-2">
        Enter the OTP sent to {email}
        
      </Text>
      <TextInput
        className="border rounded p-3 mb-4"
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={(text) => setOtp(text)}
      />
      <TouchableOpacity
        className="bg-sky-950 rounded-xl items-center py-3"
        onPress={verifyOtp}
      >
        <Text className="text-white font-bold">VERIFY</Text>
      </TouchableOpacity>
    </View>
  );
}
