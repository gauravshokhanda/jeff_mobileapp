import React from "react";
import { View, Text, Image, Platform, TouchableOpacity, Alert, Dimensions, SafeAreaView } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router"; // ✅ Use router for navigation
import Icon from "react-native-vector-icons/FontAwesome5";
import Box from "../../assets/images/MD.png";
import { setLogout } from "../../redux/slice/authSlice";
import { LinearGradient } from 'expo-linear-gradient';


// Object Array for menu items
const imageData = [
  { id: 1, label: "Contractor Lists", icon: "list", screen: "/ContractorLists", source: Box },
  { id: 2, label: "My Posts", icon: "arrow-up", screen: "/MyPosts", source: Box },
  // { id: 3, label: "Feeds", icon: "rss", screen: "/Feeds", source: Box },
  // { id: 4, label: "Favorites", icon: "heart", screen: "/Favorites", source: Box },
  { id: 5, label: "Profile", icon: "user", screen: "/UserProfile", source: Box },
  { id: 6, label: "Chats", icon: "comments", screen: "/ChatScreen", source: Box },
  { id: 7, label: "Calculator", icon: "calculator", screen: "/PropertyCalculator", source: Box },
  { id: 8, label: "Log Out", icon: "sign-out-alt", screen: "logout", source: Box },
];


const MenuHeader = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const postContentWidth = screenWidth * 0.92;
  const userName = useSelector((state) => state.auth.user);
  const router = useRouter(); // ✅ Use router for navigation
  const dispatch = useDispatch();

  // const handlePress = (screen) => {
  //   if (screen) {
  //     console.log(`Navigating to ${screen}`);
  //     router.push(screen); // ✅ Navigate using router.push
  //   }
  // };
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




  return (
    <SafeAreaView className="flex-1 bg-gray-200">

      <LinearGradient
        colors={['#082f49', 'transparent']}
        className="h-[40%]"
      >
        <View className="mt-10 px-4 gap-2 flex-row items-center">
          <Image
            source={{ uri: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg" }}
            className="w-14 h-14 border-2 border-white rounded-full"
          />
          <View className="gap-1">
            <Text className="text-2xl font-semibold text-white">
              Welcome! {userName?.name || "User"}
            </Text>
            <Text className="text-gray-400">📍 Florida, USA</Text>
          </View>
        </View>


      </LinearGradient>
      <View
       className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -screenHeight * 0.20,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
          overflow: 'hidden'
        }}
      >
        <View className="flex flex-wrap flex-row mt-10 justify-center gap-4 p-4">
          {imageData.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              className="relative  h-28 flex items-center justify-center"
              onPress={() => handlePress(item.screen)}
              style={{ width: screenWidth * 0.40 }}
            >
              <Image source={item.source} className="w-full h-full absolute" />
              <View className="absolute flex items-center">
                <Icon name={item.icon} size={24} color="white" />
                <Text className="text-white text-lg font-semibold mt-1">{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>







      </View>
    </SafeAreaView>
  );
};

export default MenuHeader;
