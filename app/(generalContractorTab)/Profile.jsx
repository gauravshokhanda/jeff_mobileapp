import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import Box from "../../assets/images/MD.png";
import { setLogout } from "../../redux/slice/authSlice";
import { LinearGradient } from "expo-linear-gradient";
import { API } from "../../config/apiConfig";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import ResetPasswordModal from "../../components/ResetPasswordModal";

const imageData = [
  {
    id: 1,
    label: "Portfolio",
    icon: "arrow-up",
    screen: "Portfolio",
    source: Box,
  },
  {
    id: 2,
    label: "Feeds",
    icon: "rss",
    screen: "ContractorFeed",
    source: Box,
  },
  {
    id: 4,
    label: "Profile",
    icon: "user",
    screen: "ContractorPortfolio",
    source: Box,
  },
  {
    id: 6,
    label: "Chat",
    icon: "comments",
    screen: "ChatList",
    source: Box,
  },
  {
    id: 3,
    label: "Reset Password",
    icon: "key",
    screen: "resetPassword", // Used to trigger modal
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
  const dispatch = useDispatch();
  const router = useRouter();
  const userName = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

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
    } else if (screen === "ContractorPortfolio") {
      router.push({ pathname: screen, params: { edit: "true" } });
    } else if (screen) {
      router.push(screen);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await API.delete(
        `delete-account?password=${password}&confirm_password=${confirmPassword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Account deleted successfully.");
        dispatch(setLogout());
        router.replace("SignIn");
      } else {
        Alert.alert("Error", "Failed to delete account.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting the account.");
    } finally {
      setShowDeleteModal(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <SafeAreaView>
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.4 }}
      >
        <View className="mt-10 px-4 gap-2 flex-row items-center">
          <View className="gap-1">
            <Text className="text-2xl font-semibold text-white">
              Welcome! {userName?.name || "User"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View
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
        <View className="flex flex-wrap flex-row justify-center gap-4 p-4">
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
        onSubmit={({ currentPassword, newPassword }) => {
          console.log("Resetting password", currentPassword, newPassword);
          setResetModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default MenuHeader;
