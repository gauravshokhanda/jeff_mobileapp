import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { setLogin } from "../redux/slice/authSlice";
import { API } from "../config/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthInput from "../components/AuthInput";
import { LinearGradient } from "expo-linear-gradient";
import fetchUserData from "./utils/fetchUserData";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

export default function SignIn() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const postContentWidth = screenWidth * 0.92;
  const [resendingOtp, setResendingOtp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userProfileComplete, setUserProfileComplete] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const Authtoken = useSelector((state) => state.auth.token);
  const { isAuthenticated, token, user,access_token } = useSelector((state) => state.auth);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    console.log("User opened the SignIn screen");
    console.log(access_token);
    const checkAndRedirect = async () => {
      if (token && user?.id) {
        try {
          const userData = await fetchUserData(
            token,
            user.id,
            setIsCheckingAuth
          );
          if (userData?.data?.is_profile_complete !== undefined) {
            setUserProfileComplete(userData.data);
          }

          const { role } = user;
          const isProfileComplete = userData.data.is_profile_complete;

          if (role === 3) {
            router.replace(
              isProfileComplete
                ? "/(generalContractorTab)"
                : "/ContractorProfileComplete"
            );
          } else if (role === 4) {
            router.replace(
              isProfileComplete
                ? "/(RealstateContractorTab)"
                : "/(RealstateContractorTab)/PropertyPost"
            );
          } else {
            router.replace("/(usertab)");
          }
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      }
    };

    checkAndRedirect();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Email and Password are required.");
      return;
    }

    setIsCheckingAuth(true);

    try {
      const response = await API.post("auth/login", { email, password });
      const { token, user } = response.data;

      dispatch(setLogin({ token, user }));

      const userData = await fetchUserData(token, user.id, setIsCheckingAuth);
      const profileComplete = userData?.data?.is_profile_complete;

      if (user.role === 3) {
        router.replace(
          profileComplete
            ? "/(generalContractorTab)"
            : "/ContractorProfileComplete"
        );
      } else if (user.role === 4) {
        router.replace(
          profileComplete ? "/(RealstateContractorTab)" : "/RealstateSelector"
        );
      } else {
        router.replace("/(usertab)");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Something went wrong. Please try again.";

      if (errorMessage === "Email not verified. Please verify your email.") {
        Alert.alert(
          "Email Not Verified",
          errorMessage,
          [
            {
              text: "Verify Email",
              onPress: async () => {
                setResendingOtp(true);
                try {
                  const resendResponse = await API.post("email/send-otp", {
                    email,
                  });
                  if (resendResponse.status === 200) {
                    router.replace(`/otpScreen?email=${encodeURIComponent(email)}`);
                  } else {
                    Alert.alert(
                      "Failed",
                      "Could not send verification email. Try again."
                    );
                  }
                } catch (e) {
                  console.log("Resend OTP error:", e.response?.data || e);
                  Alert.alert(
                    "Error",
                    "Something went wrong while sending verification email."
                  );
                } finally {
                  setResendingOtp(false);
                }
              }
              ,
              style: "default",
            },
            { text: "Cancel", style: "cancel" },
          ],
          { cancelable: true }
        );
      } else {
        Alert.alert("Login Failed", errorMessage);
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0c4a6e" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.4 }}
      />
      <View
        className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -screenHeight * 0.2,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView>
            <View className="items-center">
              <View
                style={{
                  width: screenWidth * 0.38,
                  height: screenWidth * 0.38,
                  borderRadius: screenWidth * 0.19,
                  borderWidth: 4,
                  borderColor: "#082f49",
                  overflow: "hidden",
                  marginTop: screenHeight * 0.01,
                }}
                className="items-center justify-center"
              >
                <Image
                  source={require("../assets/images/AC5D_Logo.jpg")}
                  style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                />
              </View>
            </View>
            <View
              className="flex-1 px-6"
              style={{ marginTop: screenHeight * 0.03 }}
            >
              <AuthInput
                placeholder="Email Address"
                secureTextEntry={false}
                onChangeText={setEmail}
                value={email}
              />
              <AuthInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity
                onPress={handleSignIn}
                className="rounded-2xl bg-sky-950 items-center"
                style={{
                  paddingVertical: screenHeight * 0.015,
                  fontSize: screenWidth * 0.04,
                  borderRadius: screenWidth * 0.03,
                  marginTop: screenHeight * 0.03,
                }}
              >
                <Text
                  className="text-white font-bold"
                  style={{ fontSize: screenHeight * 0.02 }}
                >
                  SIGN IN
                </Text>
              </TouchableOpacity>
              <View className="items-center mt-8">
                <TouchableOpacity onPress={() => setShowResetModal(true)}>
                  <Text
                    className="text-gray-500 font-medium"
                    style={{ fontSize: screenHeight * 0.02 }}
                  >
                    Forgot Your Password ?
                  </Text>
                </TouchableOpacity>
                <View className="flex-row mt-8">
                  <Text
                    style={{ fontSize: screenHeight * 0.018 }}
                    className="text-gray-700 text-lg"
                  >
                    Don’t have an account?
                  </Text>
                  <Link
                    style={{ fontSize: screenHeight * 0.018 }}
                    className="text-blue-600 text-lg pl-1"
                    href={"/SignUp"}
                  >
                    Sign up
                  </Link>
                </View>
                <View className="flex justify-center flex-row gap-2">
                <TouchableOpacity
                  onPress={() => router.replace("/(usertab)")}
                  className="mt-4 bg-gray-300 px-6 py-3 rounded-xl"
                >
                  <Text
                    className="text-gray-700 font-semibold"
                    style={{ fontSize: screenHeight * 0.018 }}
                  >
                    Login as Guest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.replace("/premiumPlan")}
                  className="mt-4 px-6 py-3 rounded-xl"
                >
                  <Text
                    className="text-sky-800 underline font-semibold"
                    style={{ fontSize: screenHeight * 0.018 }}
                  >
                    Premium Plans
                  </Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <ForgotPasswordModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
      />

      {resendingOtp && (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <ActivityIndicator size="large" color="#0c4a6e" />
    <Text style={{ color: "white", marginTop: 10 }}>Sending OTP...</Text>
  </View>
)}

    </SafeAreaView>
  );
}
