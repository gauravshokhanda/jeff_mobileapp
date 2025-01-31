import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { View, ActivityIndicator, Alert } from 'react-native';
import { setLogin } from "../redux/slice/authSlice";
import { API } from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Set to true initially
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

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
      router.replace("/(usertab)");
    }
  }, [isAuthenticated, token]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and Password are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("auth/login", { email, password });
      const { token, user } = response.data;

      // Save token in Redux
      dispatch(setLogin({ token, user }));

      router.replace("/(usertab)");
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-sky-10 p-12 border items-center justify-center">
          <View className="mb-8 items-center justify-center">
            <View className="w-44 h-44 rounded-full border-4 border-sky-950 overflow-hidden items-center justify-center">
              <Image source={Logo} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            </View>
          </View>
          <View className="w-full max-w-md">
            <View className="w-full space-y-4">
              <AuthInput placeholder="Email Address" secureTextEntry={false} onChangeText={setEmail} />
              <AuthInput placeholder="Password" secureTextEntry={true} onChangeText={setPassword} style={{ backgroundColor: "white", borderColor: "gray", borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 }} />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
