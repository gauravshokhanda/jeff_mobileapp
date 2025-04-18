import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import Box from "../../assets/images/MD.png";
import { setLogout } from "../../redux/slice/authSlice";
import { LinearGradient } from "expo-linear-gradient";
import { API, baseUrl } from "../../config/apiConfig";

const imageData = [
  {
    id: 1,
    label: "Contractor Lists",
    icon: "list",
    screen: "/ContractorLists",
    source: Box,
  },
  {
    id: 2,
    label: "My Posts",
    icon: "arrow-up",
    screen: "/MyPosts",
    source: Box,
  },
  {
    id: 5,
    label: "Profile",
    icon: "user",
    screen: "/UserProfile",
    source: Box,
  },
  { id: 6, label: "Chats", icon: "comments", screen: "/ChatList", source: Box },
  {
    id: 7,
    label: "Calculator",
    icon: "calculator",
    screen: "/PropertyCalculator",
    source: Box,
  },
  {
    id: 8,
    label: "Log Out",
    icon: "sign-out-alt",
    screen: "logout",
    source: Box,
  },
];

const MenuHeader = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const userName = useSelector((state) => state.auth.user);
  const userId = useSelector((state) => state.auth.user.id);
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const handlePress = (screen) => {
    if (screen === "logout") {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: () => {
            dispatch(setLogout());
            router.replace("SignIn");
          },
        },
      ]);
    } else {
      router.push(screen);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get(`user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.data);
      } catch (error) {
        Alert.alert("API Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  return (
    <SafeAreaView className="bg-gray-200">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.4 }}
      >
        <View className="mt-10 px-4 gap-2 flex-row items-center">
          <TouchableOpacity onPress={() => router.push("UserProfile")}>
            {userData?.image ? (
              <Image
                source={{ uri: `${baseUrl}/${userData.image}` }}
                className="w-16 h-16 border-2 border-white rounded-full"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-white border-2 border-white justify-center items-center">
                <Text className="text-2xl font-bold text-sky-800">
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="gap-1">
            <Text className="text-2xl font-semibold text-white">
              Welcome! {userName?.name || "User"}
            </Text>
            {/* <Text className="text-gray-400">📍 Florida, USA</Text> */}
          </View>
        </View>
      </LinearGradient>
      <View
        className="bg-white"
        style={{
          position: "absolute",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: screenHeight * 0.2,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
          overflow: "hidden",
        }}
      >
        <View className="flex flex-wrap flex-row mt-10 justify-center gap-4 p-4">
          {imageData.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              className="relative  h-28 flex items-center justify-center"
              onPress={() => handlePress(item.screen)}
              style={{ width: screenWidth * 0.4 }}
            >
              <Image source={item.source} className="w-full h-full absolute" />
              <View className="absolute flex items-center">
                <Icon name={item.icon} size={24} color="white" />
                <Text className="text-white text-lg font-semibold mt-1">
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default MenuHeader;
