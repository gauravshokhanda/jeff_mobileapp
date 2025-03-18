import { View, Image, Text, TouchableOpacity } from "react-native";
import React, { useEffect , useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

import { useNotification } from "@/context/NotificationContext";
import * as Updates from "expo-updates";


export default function Index() {


  const { notification, expoPushToken, error } = useNotification();
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();

  const [dummyState, setDummyState] = useState(0);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  useEffect(() => {
    if (isUpdatePending) {
  

      dummyFunction();
    }
  }, [isUpdatePending]);

  const dummyFunction = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error");
    }

   
  };

  // If true, we show the button to download and run the update
  const showDownloadButton = isUpdateAvailable;

  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    ? "This app is running from built-in code"
    : "This app is running an update";

  const navigation = useNavigation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  return (
    <View className="flex-1 items-center bg-white">
      <View className="items-center">
        <Image source={require("../assets/images/homescreen/homeImage.png")} />
      </View>

      <View className=" h-[20%] w-[100%] justify-between items-center">
        <Image
          className="h-[60%] w-[80%] rounded-lg"
          source={require("../assets/images/homescreen/MainLogo.jpg")}
        />
         <Text type="subtitle" style={{ color: "red" }}>
            Your push token:
          </Text>
          <Text>{expoPushToken}</Text>

          <Text>
          {JSON.stringify(notification?.request.content.data, null, 2)}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
          className="text-center rounded-3xl px-10 bg-sky-950"
        >
          <Text className="font-semibold text-center mx-10 my-3 text-lg text-white">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
