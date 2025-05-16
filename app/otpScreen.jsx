import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useLocalSearchParams, router } from "expo-router";
import { API } from "../config/apiConfig";

const { width } = Dimensions.get("window");

const OtpScreen = () => {
  const { email } = useLocalSearchParams();
  console.log("Email from params:", email);

  const token = useSelector((state) => state.auth.token);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) inputs.current[index + 1]?.focus();
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] === "" && index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
      if (newOtp.every((val) => val === "")) {
        inputs.current.forEach((input) => input?.blur());
      }
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      Alert.alert("Error", "Please enter all 6 digits of the OTP.");
      return;
    }

    setLoading(true);
    try {
      await API.post(
        "email/verify-otp",
        { otp: finalOtp, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVerified(true);
      setTimeout(() => {
        router.replace("/SignIn");
      }, 1000);
    } catch (error) {
      console.error("OTP verification failed:", error.response?.data || error);
      Alert.alert("Verification Failed", "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await API.post(
        "email/send-otp",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Alert.alert("Success", "OTP resent to your email.");
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      console.error("Resend OTP failed:", error.response?.data || error);
      Alert.alert("Error", "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white justify-center"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-10"
      >
        <Ionicons name="arrow-back" size={28} color="#0c4a6e" />
      </Pressable>

      <View className="px-6 w-full max-w-md self-center items-center">
        <Text className="text-sky-950 text-3xl font-bold text-center mb-4">
          Email Verification
        </Text>
        <Text className="text-sky-950 text-base text-center mb-6">
          Enter the 6-digit OTP sent to your email
        </Text>

        <View className="flex-row justify-between w-full mb-4">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              className={`w-12 h-12 border-2 rounded-lg text-center text-2xl text-sky-950 bg-white shadow-sm ${
                digit ? "border-sky-700" : "border-sky-950"
              }`}
              selectionColor="#0c4a6e"
            />
          ))}
        </View>

        {verified && (
          <Text className="text-green-600 text-center text-base mb-4 font-semibold">
            Verified
          </Text>
        )}

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          className={`w-full py-3 rounded-xl ${
            loading ? "bg-gray-300" : "bg-sky-950"
          } shadow-md flex-row justify-center items-center`}
        >
          {loading && <ActivityIndicator color="#fff" className="mr-2" />}
          <Text className="text-white text-lg font-semibold">
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={resending}
          className="mt-4"
        >
          {resending ? (
            <ActivityIndicator color="#0c4a6e" />
          ) : (
            <Text className="text-center text-base text-sky-950 underline">
              Resend OTP
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => router.replace("/SignIn")}
        >
          <Text className="text-center text-base">Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;
