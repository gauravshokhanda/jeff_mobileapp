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
} from "react-native";
import { useSelector } from "react-redux";
import { API } from "../config/apiConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const OtpScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputs = useRef([]);
  const token = useSelector((state) => state.auth.token);
  const navigation = useNavigation();

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

      // If all fields are empty, blur all inputs
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
        { otp: finalOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setVerified(true); // Show success message
      setTimeout(() => {
        router.replace("/SignIn");
      }, 1000);
    } catch (error) {
      console.error(error);
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
        {},
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
      console.error(error);
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
      {/* Back Button */}
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
          } shadow-md`}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={resending}
          className="mt-4"
        >
          <Text
            className={`text-center text-base ${
              resending ? "text-sky-950 opacity-50" : "text-sky-950 underline"
            }`}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => router.replace("/SignIn")}
        >
          <Text className={`text-center text-base`}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;
