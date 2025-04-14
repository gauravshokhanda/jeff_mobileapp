import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import { API } from "../config/apiConfig";
import { useSelector, useDispatch } from "react-redux";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import {
  setFcmToken,
  markFcmSentAfterLogin,
  markFcmSentBeforeLogin,
  setOnboardingCompleted,
} from "../redux/slice/authSlice";

export default function Index() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    token: Authtoken,
    user,
    fcmToken,
    fcmSentBeforeLogin,
    fcmSentAfterLogin,
    onboardingCompleted,
  } = useSelector((state) => state.auth);

  const [beforeLoginResponse, setBeforeLoginResponse] = useState(null);
  const [afterLoginResponse, setAfterLoginResponse] = useState(null);
  const [screenNumber, setScreenNumber] = useState(0); // Always start with 0 (Get Started screen)

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        if (
          authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
          authStatus !== messaging.AuthorizationStatus.PROVISIONAL
        ) {
          Alert.alert(
            "Notification Permission Denied",
            "Enable notifications to receive updates."
          );
          return;
        }

        const token = await messaging().getToken();
        if (token) {
          console.log("🔥 FCM Token:", token);
          dispatch(setFcmToken(token));
        }
      } catch (error) {
        console.error("Error fetching FCM Token:", error);
      }
    };

    initializeFCM();
  }, [dispatch]);

  useEffect(() => {
    const sendFcmTokenBeforeLogin = async () => {
      if (fcmToken && !fcmSentBeforeLogin) {
        console.log("📌 Sending FCM Token Before Login:", { token: fcmToken });
        try {
          const response = await API.post(
            "https://g32.iamdeveloper.in/api/save-fcm-token",
            { token: fcmToken },
            {
              headers: {
                Authorization: Authtoken ? `Bearer ${Authtoken}` : undefined,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("✅ FCM Token sent before login:", response.data);
          setBeforeLoginResponse(response.data);
          dispatch(markFcmSentBeforeLogin());
        } catch (error) {
          console.error("❌ Error sending FCM token before login:", error);
          setBeforeLoginResponse({ error: error.message });
        }
      }
    };

    sendFcmTokenBeforeLogin();
  }, [fcmToken, fcmSentBeforeLogin, dispatch, Authtoken]);

  useEffect(() => {
    const sendFcmTokenAfterLogin = async () => {
      if (user?.id && fcmToken && !fcmSentAfterLogin) {
        console.log("📌 Sending FCM Token After Login:", {
          token: fcmToken,
          user_id: user.id,
        });
        try {
          const response = await API.post(
            "https://g32.iamdeveloper.in/api/save-fcm-token",
            { token: fcmToken, user_id: user.id },
            {
              headers: {
                Authorization: `Bearer ${Authtoken}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("✅ FCM Token sent after login:", response.data);
          setAfterLoginResponse(response.data);
          dispatch(markFcmSentAfterLogin());
        } catch (error) {
          console.error("❌ Error sending FCM token after login:", error);
          setAfterLoginResponse({ error: error.message });
        }
      }
    };

    sendFcmTokenAfterLogin();
  }, [user?.id, fcmToken, fcmSentAfterLogin, dispatch, Authtoken]);

  const handleNextOrComplete = () => {
    if (screenNumber === 3) {
      dispatch(setOnboardingCompleted(true));
      navigation.navigate("SignIn");
    } else {
      setScreenNumber(screenNumber + 1);
    }
  };

  const handleGetStarted = () => {
    if (!onboardingCompleted) {
      setScreenNumber(1); // Move to onboarding screen 1
    } else {
      navigation.navigate("SignIn"); // If onboarding is completed, go to SignIn
    }
  };

  // Onboarding screens
  if (screenNumber > 0) {
    const screenData = {
      1: {
        image: require("../assets/images/onboarding_01.png"),
        title: "Build Your Dream Property with the Right Experts",
        description:
          `Post your construction needs easily using map or photo uploads.
        Get contacted by trusted General Contractors.
        Explore verified contractor profiles and portfolios.
        Chat and hire directly through the app.`,
      },
      2: {
        image: require("../assets/images/onboarding_02.png"),
        title: "Find Projects and Grow Your Construction Business",
        description:
          `Create your profile and showcase your past work as a portfolio.
           Browse nearby property posts from customers.
          Contact customers directly to offer your services.
          Build your reputation and grow your client base.`,
      },
      3: {
        image: require("../assets/images/onboarding_03.png"),
        title: "List & Sell Properties with Smart Tools",
        description:
          `Add listings for residential and commercial properties.
        Include location, pricing, and complete details.
        Connect with interested buyers instantly via chat.
        Boost your visibility and close more deals.`,
      },
    };

    const { image, title, description } = screenData[screenNumber];

    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Image source={image} className="w-3/4 h-1/2" resizeMode="contain" />

        <View className="mt-8 px-4">
          <Text className="text-center text-2xl font-bold text-gray-800">
            {title}
          </Text>
          <Text className="text-center text-base text-gray-600 mt-4">
            {description}
          </Text>
        </View>

        <View className="flex-row mt-8">
          <View
            className={`w-3 h-3 rounded-full mx-1 ${screenNumber === 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
          />
          <View
            className={`w-3 h-3 rounded-full mx-1 ${screenNumber === 2 ? "bg-blue-500" : "bg-gray-300"
              }`}
          />
          <View
            className={`w-3 h-3 rounded-full mx-1 ${screenNumber === 3 ? "bg-blue-500" : "bg-gray-300"
              }`}
          />
        </View>

        <View className="flex-row justify-between w-full px-8 mt-12">
          {screenNumber > 1 && (
            <TouchableOpacity
              onPress={() => setScreenNumber(screenNumber - 1)}
              className="px-4 py-2"
            >
              <Text className="text-blue-500 text-base">Back</Text>
            </TouchableOpacity>
          )}
          {/* Removed the Skip button */}
          <TouchableOpacity
            onPress={handleNextOrComplete}
            className="px-4 py-2"
          >
            <Text className="text-white bg-blue-500 rounded-full px-6 py-2">
              {screenNumber === 3 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default "Get Started" screen
  return (
    <View className="flex-1 items-center justify-between bg-white pt-5 pb-1">
      <Image
        source={require("../assets/images/homescreen/homeImage.png")}
        style={{ width: "100%" }}
        resizeMode="cover"
      />

      <Image
        className="h-40 w-[80%] rounded-lg"
        source={require("../assets/images/homescreen/MainLogo.jpg")}
        resizeMode="cover"
      />

      <TouchableOpacity
        onPress={handleGetStarted}
        className="bg-sky-950 px-10 mt-5 py-3 rounded-3xl mb-4"
        style={{ marginBottom: height * 0.04 }}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}
