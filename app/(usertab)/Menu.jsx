import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import Box from "../../assets/images/MD.png";
import { setLogout } from "../../redux/slice/authSlice";
import { LinearGradient } from "expo-linear-gradient";
import { API, baseUrl } from "../../config/apiConfig";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import ResetPasswordModal from "../../components/ResetPasswordModal";

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
  {
    id: 6,
    label: "Chats",
    icon: "comments",
    screen: "/ChatList",
    source: Box,
  },
  {
    id: 7,
    label: "Calculator",
    icon: "calculator",
    screen: "/PropertyCalculator",
    source: Box,
  },
  {
    id: 10,
    label: "Explore Premium",
    icon: "crown",
    screen: "premium",
    source: Box,
  },
  {
    id: 99,
    label: "Reset Password",
    icon: "key",
    screen: "resetPassword",
    source: Box,
  },
  {
    id: 9,
    label: "Delete Account",
    icon: "trash-alt",
    screen: "deleteAccount",
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

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userId = user?.id;

  const [userData, setUserData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    } else if (screen === "deleteAccount") {
      setShowDeleteModal(true);
    } else if (screen === "resetPassword") {
      setResetModalVisible(true);
    } else {
      router.push(screen);
    }
  };

  const handleResetPassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    try {
      const response = await API.post(
        "change-password",
        {
          old_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", "Password reset successfully!");
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Reset failed");
    } finally {
      setResetModalVisible(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId || !token) return;

        const response = await API.get(`user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data.data);
      } catch (error) {
        console.log("Error fetching user data", error);
        Alert.alert("Error", "Could not fetch user data.");
      }
    };

    fetchUserData();
  }, [token, userId]);

  if (!userId) {
    return (
      <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
        <Text className="text-xl font-semibold text-gray-700 mb-2">
          Please Sign in
        </Text>
        <Text className="text-gray-500 text-center w-4/5">
          You must be signed in to access this page.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-sky-950 px-6 py-3 rounded-xl"
          onPress={() => router.replace("/SignIn")}
        >
          <Text className="text-white font-semibold">Go to Sign in</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View className="gap-1">
            <Text className="text-2xl font-semibold text-white">
              Welcome! {user?.name || "User"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View
        className="bg-white"
        style={{
          position: "absolute",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: screenHeight * 0.19,
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
              className="relative h-28 flex items-center justify-center"
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
      


      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

      <ResetPasswordModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onSubmit={handleResetPassword}
      />
    </SafeAreaView>
  );
};

export default MenuHeader;
