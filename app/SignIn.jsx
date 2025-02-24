import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { View, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, Text, SafeAreaView, Dimensions } from 'react-native';
import { setLogin } from "../redux/slice/authSlice";
import { API } from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthInput from "../components/AuthInput";
import { LinearGradient } from 'expo-linear-gradient';


export default function SignIn() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const userData = useSelector((state) => state.auth.user);
  const hasPropertyDetails = useSelector((state) => state.realStateProperty.propertyDetails);


  // real state property details
  console.log("hasPropertyDetails:", hasPropertyDetails);



  useEffect(() => {
    // Check AsyncStorage for persisted token before proceeding
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('persist:root');
        if (storedToken) {
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking persisted token:", error);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      // console.log("Image userdata",userData)
      if (userData?.role == 3) {
        if (userData?.image === null) {
          // console.log("userData?.image",userData?.image)
          router.replace('/ContractorProfileComplete')
        }
        else {
          router.replace("/(generalContractorTab)");
        }
      }
      else if (userData?.role == 4) {
        if (hasPropertyDetails === null) {
          router.replace('/RealstateSelector')
        }
        else {
          router.replace('/(RealstateContractorTab)')
        }
      }
      else {
        router.replace("/(usertab)");
      }
    }
  }, [isAuthenticated, token]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and Password are required.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("auth/login", { email, password });
      const { token, user } = response.data;
      // console.log("user login data", response.data)

      // Save token in Redux
      dispatch(setLogin({ token, user }));

      if (user.role == 3) {
        router.replace("/(generalContractorTab)");
      }
      else if (user.role == 4) {
        router.replace("/(RealstateContractorTab)");
      }
      else {
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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0c4a6e" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200">

      <LinearGradient
        colors={['#082f49', 'transparent']}
        style={{ height: screenHeight * 0.4 }}
      />
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
          <View
            className="flex-1 rounded-3xl flex-1">
            <View className="items-center justify-center relative">
              <View
                style={{ height: screenHeight * 0.2, width: screenWidth * 0.4, position: "absolute" }}
                className="rounded-full border-4 border-sky-950 overflow-hidden items-center justify-center">
                <Image source={require("../assets/images/AC5D_Logo.jpg")} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
              </View>
            </View>
            <View className="w-full max-w-md p-12"
              style={{ marginTop: screenHeight * 0.12 }}
            >
              <View className="w-full space-y-4">
                <AuthInput placeholder="Email Address" secureTextEntry={false} onChangeText={setEmail} value={email} />
                <AuthInput placeholder="Password" secureTextEntry={true} onChangeText={setPassword} value={password}
                  style={{ backgroundColor: "white", borderColor: "gray", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 }} />
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
    </SafeAreaView >
  );
}
