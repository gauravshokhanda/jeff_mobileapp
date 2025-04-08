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
import {
  setFcmToken,
  markFcmSentAfterLogin,
  markFcmSentBeforeLogin,
} from "../redux/slice/authSlice";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const Authtoken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const fcmToken = useSelector((state) => state.auth.fcmToken);
  const fcmSentBeforeLogin = useSelector(
    (state) => state.auth.fcmSentBeforeLogin
  );
  const fcmSentAfterLogin = useSelector(
    (state) => state.auth.fcmSentAfterLogin
  );

  const [beforeLoginResponse, setBeforeLoginResponse] = useState(null);
  const [afterLoginResponse, setAfterLoginResponse] = useState(null);

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

  return (
    <View className="flex-1 items-center justify-between bg-white pt-5 pb-1">
      <Image
        source={require("../assets/images/homescreen/homeImage.png")}
        style={{ width: "100%" }}
        className="h-[250px]"
        resizeMode="cover"
      />

      <Image
        className="h-40 w-[80%] rounded-lg"
        source={require("../assets/images/homescreen/MainLogo.jpg")}
        resizeMode="cover"
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("SignIn")}
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
