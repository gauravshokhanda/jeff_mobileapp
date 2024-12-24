import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AuthInput from "../../components/AuthInput";
import { Link, useRouter } from "expo-router";
import { API } from "../../config/apiConfig";
import Logo from "../../assets/images/AC5D_Logo.jpg";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const data = { name, email, password, password_confirmation: passwordConfirmation };

    try {
      const response = await API.post("auth/register", data);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(usertab)/Dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-sky-10 p-12 border items-center justify-center">
          {/* Logo */}
          <View className="mb-8 items-center justify-center">
            <View className="w-44 h-44 rounded-full border-4 border-sky-950 overflow-hidden items-center justify-center">
              <Image
                source={Logo}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </View>
          </View>

          <View className="w-full max-w-md">
            {/* Input Fields */}
            <View className="w-full space-y-4">
              <AuthInput
                placeholder="Name"
                secureTextEntry={false}
                onChangeText={setName}
                style={{
                  backgroundColor: "white",
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
              <AuthInput
                placeholder="Email Address"
                secureTextEntry={false}
                onChangeText={setEmail}
                style={{
                  backgroundColor: "white",
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
              <AuthInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPassword}
                style={{
                  backgroundColor: "white",
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
              <AuthInput
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={setPasswordConfirmation}
                style={{
                  backgroundColor: "white",
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
            </View>

            {/* Sign Up Button */}
            <View className="items-center justify-center mt-6">
              <TouchableOpacity
                onPress={handleSignUp}
                className="text-center rounded-3xl bg-sky-950 px-5 py-3 w-full max-w-xs"
              >
                <Text className="text-center text-white text-lg">SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Links */}
          <View className="w-full max-w-md mt-10 items-center">
            <View className="flex-row items-center justify-center">
              <Text className="text-gray-700 text-lg">Already Have an Account?</Text>
              <Link className="text-blue-600 text-lg pl-1" href="/SignIn">
                Sign In
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
