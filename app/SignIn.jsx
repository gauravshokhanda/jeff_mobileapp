import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import AuthInput from "../components/AuthInput";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { baseUrl, API } from "../config/apiConfig";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../redux/slice/authSlice";
import { Alert } from 'react-native';
import Logo from '../assets/images/AC5D_Logo.jpg';

export default function SignIn() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter();

  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (isAuthenticated || token) {
      router.replace("/(usertab)/Dashboard");
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Alert.alert("Error", "Email and Password are required.");
      return;
    }
    const data = { email, password }
    try {
      const response = await API.post("auth/login", data);
      const { token } = response.data
      dispatch(setLogin({ token }))
      router.replace('/(usertab)/Dashboard')
    }
    catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (!err.response) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.response.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      Alert.alert(
        "Error", errorMessage
      )
    }
  }
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-sky-10 p-12 border items-center justify-center">

          {/* Logo */}
          <View className="mb-8 items-center justify-center">
            {/* Circular Container */}
            <View className="w-44 h-44 rounded-full border-4 border-sky-950 overflow-hidden items-center justify-center">
              <Image
                source={Logo}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            </View>
          </View>

          <View className="w-full max-w-md">

            {/* Input Fields */}
            <View className="w-full space-y-4">
              <AuthInput
                placeholder="Email Address"
                secureTextEntry={false}
                onChangeText={setEmail}

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
              {/* <TextInput className=' text-gray-600 rounded-lg mb-8 px-5 py-5 bg-slate-200'/> */}
            </View>

            {/* Sign In Button */}
            <View className="items-center justify-center mt-6">
              <TouchableOpacity
                onPress={handleSignIn}
                className="text-center rounded-3xl bg-sky-950  px-5 py-3 w-full max-w-xs">
                <Text className="text-center text-white text-lg">SIGN IN</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Links */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
