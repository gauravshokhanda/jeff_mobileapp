// app/components/ForgotPasswordModal.jsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { API } from "../config/apiConfig";
import { Ionicons } from "@expo/vector-icons";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email"); // email | otp | reset
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await API.post("forgot-password/send-otp", { email });
      console.log("OTP API Response:", response.data);
      if (response.data?.message) {
        setMessage(response.data.message);
        setStep("otp");
      }
    } catch (err) {
      console.error("OTP API Error:", err.response?.data || err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await API.post("forgot-password/verify-otp", {
        email,
        otp,
      });
      console.log("OTP Verification Response:", response.data);
      if (response.data?.message) {
        setMessage("OTP Verified. Please reset your password.");
        setStep("reset");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err.response?.data || err.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", confirmPassword);

      const response = await API.post("forgot-password/reset", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Password Reset Response:", response.data);
      setMessage("Password successfully reset.");
      setStep("done");
    } catch (err) {
      console.error("Reset Password Error:", err.response?.data || err.message);
    }
  };

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setStep("email");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
        <View className="bg-white p-6 rounded-2xl w-11/12 max-w-md relative">

          {/* ❌ Close Icon */}
          <TouchableOpacity
            onPress={handleClose}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          {/* 📧 Email Step */}
          {step === "email" && (
            <>
              <Text className="text-xl font-bold mb-4 text-center">Send OTP</Text>
              <TextInput
                placeholder="Enter your email"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                onPress={handleSendOtp}
                className="bg-blue-600 py-3 rounded-lg mb-3"
              >
                <Text className="text-white text-center font-semibold">Send OTP</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 🔐 OTP Step */}
          {step === "otp" && (
            <>
              <Text className="text-lg font-semibold mb-2 text-center text-green-600">{message}</Text>
              <TextInput
                placeholder="Enter OTP"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-center text-xl tracking-widest"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity
                onPress={handleVerifyOtp}
                className="bg-green-600 py-3 rounded-lg mb-3"
              >
                <Text className="text-white text-center font-semibold">Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 🔑 Reset Password Step */}
          {step === "reset" && (
            <>
              <Text className="text-lg font-semibold mb-2 text-center text-green-600">{message}</Text>
              <TextInput
                placeholder="New Password"
                secureTextEntry
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={handleResetPassword}
                className="bg-purple-600 py-3 rounded-lg mb-3"
              >
                <Text className="text-white text-center font-semibold">Reset Password</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ✅ Final Done Message */}
          {step === "done" && (
            <>
              <Text className="text-lg font-bold text-center text-green-700 mb-4">
                {message}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-blue-600 text-center font-medium">Close</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ❎ Cancel Button */}
          {step !== "done" && (
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-blue-600 text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;
