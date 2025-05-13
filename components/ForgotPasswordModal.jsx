import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { API } from "../config/apiConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await API.post("forgot-password/send-otp", { email });
      showMessage(response.data?.message || "OTP sent", "success");
      setStep("otp");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await API.post("forgot-password/verify-otp", { email, otp });
      showMessage("OTP Verified. Please reset your password.", "success");
      setStep("reset");
    } catch (err) {
      showMessage(err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);

    const response = await API.post("forgot-password/reset", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    showMessage("Password successfully reset.", "success");
    setStep("done");

    // ✅ Close modal after 1 second
    setTimeout(() => {
      handleClose();
    }, 1000);
  } catch (err) {
    showMessage(err.response?.data?.message || "Reset failed", "error");
  } finally {
    setLoading(false);
  }
};


  const handleClose = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setMessageType("");
    setStep("email");
    onClose();
  };

  const renderMessageBox = () =>
    message ? (
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor:
              messageType === "success" ? "#d1fae5" : "#fee2e2",
            borderColor: messageType === "success" ? "#10b981" : "#ef4444",
          },
        ]}
      >
        <Text
          style={{
            textAlign: "center",
            color: messageType === "success" ? "#065f46" : "#991b1b",
          }}
        >
          {message}
        </Text>
      </View>
    ) : null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
    >
      <LinearGradient
        colors={["#082f49", "#dceff8", "#ffffff"]}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      >
        <View style={styles.card}>
          <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>Forgot Password</Text>
          {renderMessageBox()}

          {step === "email" && (
            <>
              <TextInput
                placeholder="Enter your email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={loading}
                style={[styles.button, loading && styles.disabled]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === "otp" && (
            <>
              <TextInput
                placeholder="Enter OTP"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={loading}
                style={[styles.button, loading && styles.disabled]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === "reset" && (
            <>
              <TextInput
                placeholder="New Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading}
                style={[styles.button, loading && styles.disabled]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === "done" && (
            <>
              <Text style={styles.successText}>{message}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={[styles.buttonText, { color: "#0c3c5e", marginTop: 16 }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step !== "done" && (
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.buttonText, { color: "#0c3c5e", marginTop: 16 }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0c3c5e",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0c3c5e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  messageBox: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  successText: {
    fontSize: 18,
    color: "#10b981",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
  },
});

export default ForgotPasswordModal;
