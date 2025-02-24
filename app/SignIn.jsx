import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { View, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, Text, SafeAreaView, Dimensions } from 'react-native';
import { setLogin } from "../redux/slice/authSlice";
import { API } from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthInput from "../components/AuthInput";
import { LinearGradient } from 'expo-linear-gradient';
import fetchUserData from './utils/fetchUserData';

export default function SignIn() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userProfileComplete, setUserProfileComplete] = useState(null); // Initialize as null for clarity
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Unified loading state

  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  // Centralized auth and profile check
  useEffect(() => {
    const initializeAuth = async () => {
      setIsCheckingAuth(true);
      try {
        // Check for persisted token
        const storedData = await AsyncStorage.getItem('persist:root');
        if (!storedData || !token || !user?.id) {
          setIsCheckingAuth(false);
          return;
        }

        // Fetch user profile data if token and user ID exist
        const userData = await fetchUserData(token, user.id, setIsCheckingAuth);
        if (userData?.data?.is_profile_complete !== undefined) {
          setUserProfileComplete(userData.data);
        }

        // Navigate based on role and profile completion
        if (isAuthenticated && token && userData?.data) {
          const { role, id } = user;
          if (role === 3) {
            router.replace(userData.data.is_profile_complete ? "/(generalContractorTab)" : "/ContractorProfileComplete");
          } else if (role === 4) {
            router.replace(userData.data.is_profile_complete ? "/(RealstateContractorTab)" : "/RealstateSelector");
          } else {
            router.replace("/(usertab)");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initializeAuth();
  }, [isAuthenticated, token, user, router, dispatch]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and Password are required.");
      return;
    }

    setIsCheckingAuth(true);
    try {
      const response = await API.post("auth/login", { email, password });
      const { token, user } = response.data;

      // Save token and user in Redux
      dispatch(setLogin({ token, user }));

      // Fetch profile data after login
      const userData = await fetchUserData(token, user.id, setIsCheckingAuth);
      const profileComplete = userData?.data?.is_profile_complete;

      // Navigate based on role and profile completion
      if (user.role === 3) {
        router.replace(profileComplete ? "/(generalContractorTab)" : "/ContractorProfileComplete");
      } else if (user.role === 4) {
        router.replace(profileComplete ? "/(RealstateContractorTab)" : "/RealstateSelector");
      } else {
        router.replace("/(usertab)");
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (!err.response) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.response.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Show loading spinner while checking auth or signing in
  if (isCheckingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0c4a6e" />
      </View>
    );
  }

  // Render sign-in form only if auth check is complete and user is not authenticated
  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <LinearGradient colors={['#082f49', 'transparent']} style={{ height: screenHeight * 0.4 }} />
      <View
        className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -screenHeight * 0.20,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
        }}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex-1 rounded-3xl">
            <View className="items-center justify-center relative">
              <View
                style={{ height: screenHeight * 0.2, width: screenWidth * 0.4, position: "absolute" }}
                className="rounded-full border-4 border-sky-950 overflow-hidden items-center justify-center"
              >
                <Image source={require("../assets/images/AC5D_Logo.jpg")} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
              </View>
            </View>
            <View className="w-full max-w-md p-12" style={{ marginTop: screenHeight * 0.12 }}>
              <View className="w-full space-y-4">
                <AuthInput placeholder="Email Address" secureTextEntry={false} onChangeText={setEmail} value={email} />
                <AuthInput placeholder="Password" secureTextEntry={true} onChangeText={setPassword} value={password} />
              </View>
              <View className="items-center justify-center mt-6">
                <TouchableOpacity onPress={handleSignIn} className="text-center rounded-3xl bg-sky-950 px-5 py-3 w-full max-w-xs">
                  <Text className="text-center text-white text-lg">SIGN IN</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="w-full max-w-md mt-10 items-center">
              <View className="items-center pb-2">
                <Link href={""} className="text-slate-500">Forgot Your Password</Link>
              </View>
              <View className="flex-row items-center justify-center">
                <Text className="text-gray-700 text-lg">Already Have an Account?</Text>
                <Link className="text-blue-600 text-lg pl-1" href={"/SignUp"}>Sign up</Link>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}