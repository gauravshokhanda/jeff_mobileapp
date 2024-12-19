import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import AuthInput from "../components/AuthInput";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { baseUrl, API } from "../config/apiConfig";
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/slice/authSlice";
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

export default function Index() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter();

  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Alert.alert("Error", "Email and Password are required.");
      return;
    }
    const data = { email, password }
    try {
      const response = await API.post("auth/login", data);
      const { access_token } = response.data
      dispatch(setLogin({ access_token }))
      router.replace('/(usertab)')
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
      console.log("err", err)
    }
  }
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-sky-950 p-12 border">
          <View className="flex-1">
            <View className="flex-row items-center border-b border-b-white  pb-4 mt-8 mb-10">
              <FontAwesome name="chevron-left" size={15} color="white" />
              <Text className="text-white text-2xl font-medium pl-6 ">
                Sign In
              </Text>
            </View>
            <View className="my-10 pt-8 pb-10">
              <Text
                className="text-white text-5xl text-center elevation-lg font-semibold">G32CROP</Text>
            </View>
            {/* input text */}
            <View>
              <AuthInput
                placeholder="Email Address"
                secureTextEntry={false}
                onChangeText={setEmail}
              />
              <AuthInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPassword}
              />

            </View>
            {/* Sign up button */}
            <View className="items-center justify-center mt-6">
              <TouchableOpacity
                onPress={handleSignIn}
                className="text-center rounded-3xl bg-slate-200 px-5 ">
                <Text className="text-center mx-10 my-3 text-lg">SIGN IN</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View className="mt-10 items-center justify-center pl-1 pb-2">
              <Link href={""} className="text-slate-300">Forgot Your Password</Link>
            </View>
            <View className="ml-2 flex-row items-center justify-center ">
              <Text className="text-white text-lg">Already Have a Account?</Text>
              <Link className="text-white text-lg pl-1" href={"/SignUp"}>Sign up</Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
