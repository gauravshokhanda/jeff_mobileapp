import React from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from 'react-redux';
import { setLogout } from "../../redux/slice/authSlice";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  const userData = useSelector((state) => state.auth.user);
  console.log("userData", userData)
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          dispatch(setLogout());
          navigation.replace('SignIn');
        }
      }
    ]);
  };

  return (
    <View className={`flex-1 bg-sky-950 px-5 py-10 ${Platform.OS === 'ios' ? 'mt-16' : ''}`}>
      <View className="items-center mb-10">
        <Icon name="account-circle" size={100} color="#FFFFFF" />
        <Text className="text-2xl font-semibold text-white mt-3">{userData.name ? userData.name : "unknown"}</Text>
        <Text className="text-gray-400">{userData.email ? userData.email : "unknown"}</Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4"
        onPress={() => navigation.navigate("Account")}
      >
        <Icon name="lock" size={24} color="#FFFFFF" />
        <Text className="text-white text-lg ml-3">Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4"
        onPress={() => navigation.navigate("MyPosts")}
      >
        <Icon name="post-add" size={24} color="#FFFFFF" />
        <Text className="text-white text-lg ml-3">My Posts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center bg-sky-500 p-4 rounded-lg"
        onPress={handleLogout}
      >
        <Icon name="logout" size={24} color="#FFFFFF" />
        <Text className="text-white text-lg ml-3">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
