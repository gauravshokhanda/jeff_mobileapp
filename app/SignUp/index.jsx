import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  TextInput,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AuthInput from "../../components/AuthInput";
import { Link, useRouter } from "expo-router";
import { API } from "../../config/apiConfig";
import Logo from "../../assets/images/AC5D_Logo.jpg";
import ModalSelector from "react-native-modal-selector";
import { useDispatch, useSelector } from "react-redux";
import { setSignUp } from "../../redux/slice/authSlice";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUp() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState({ key: "", label: "" });
  const dispatch = useDispatch();
  const router = useRouter();
  const isToken = useSelector((state) => state.auth.token);


  const { width, height } = Dimensions.get("window");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  // useEffect(() => {
  //     if (isAuthenticated || token) {
  //         router.replace("/(usertab)");
  //     }
  // }, [isAuthenticated, token, router]);

  const handleSignUp = async () => {
    if (!name || !email || !password || !passwordConfirmation || !role.key) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const data = {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      role: role.key,
    };

    try {
      const response = await API.post("auth/register", data);
      // console.log("username", response.data.data.user)
      const { access_token } = response.data;
      console.log("access token", access_token);
      const user = response.data.data.user;
      dispatch(setSignUp({ access_token, user }));

      Alert.alert("Success", "Account created successfully!");
      console.log("User Role After API Call:", role.key);
      if (role.key == 3) {
        router.replace("/ContractorProfileComplete");
      } else if (role.key == 4) {
        router.replace("/RealstateSelector");
      } else {
        router.replace("/(usertab)");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={["#082f49", "transparent"]} style={{ height: height * 0.4 }} />

          <View
            className="flex-1 rounded-3xl bg-white px-6 py-6"
            style={{ marginTop: -height * 0.2, marginHorizontal: width * 0.05 }}
          >
            <View className="items-center mb-6">
              <View
                style={{
                  width: width * 0.3,
                  height: width * 0.3,
                  borderRadius: width * 0.15,
                  borderWidth: 3,
                  borderColor: "#082f49",
                  overflow: "hidden",
                }}
              >
                <Image source={Logo} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
              </View>
            </View>

            <View className="space-y-4">
              <AuthInput placeholder="Name" value={name} onChangeText={setName} />
              <AuthInput placeholder="Email Address" value={email} onChangeText={setEmail} />
              <AuthInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <AuthInput placeholder="Confirm Password" value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry />

              <ModalSelector
                data={[{ key: 2, label: "Customer" }, { key: 3, label: "General Contractor" }, { key: 4, label: "Real Estate Contractor" }]}
                initValue="Select Role"
                onChange={(option) => setRole(option)}
              >
                <TouchableOpacity className="bg-gray-300 p-3 rounded-lg items-center">
                  <Text className={role?.label ? "text-gray-700" : "text-gray-500"}>{role?.label || "Select Role"}</Text>
                </TouchableOpacity>
              </ModalSelector>
            </View>

            <TouchableOpacity onPress={handleSignUp} className="bg-sky-950 rounded-xl items-center py-3 mt-5">
              <Text className="text-white font-bold text-lg">SIGN UP</Text>
            </TouchableOpacity>

            <View className="items-center mt-4">
              <Text className="text-gray-700">Already have an account?
                <Link href="/SignIn" className="text-blue-600"> Sign In</Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
