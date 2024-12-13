import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import AuthInput from "../components/AuthInput";
import { Link } from "expo-router";

export default function Index() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [confirm_Password, setConfirm_Password] = useState("")

  const handleSignIn = () => {
    console.log("name", name)
    console.log("email", email)
    console.log("Password", Password)
    console.log("confirm_Password", confirm_Password)
  }
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-sky-950 p-12 border ">
          <View className="flex-1">
            <View className="flex-row items-center border-b border-b-white  pb-4 mt-8 mb-5">
              <FontAwesome name="chevron-left" size={15} color="white" />
              <Text className="text-white text-2xl font-medium pl-6 ">
                Sign Up
              </Text>
            </View>
            <View className="my-10">
              <Text className="text-white text-2xl text-center">Create New Account</Text>
            </View>
            {/* input text */}
            <View>
              <AuthInput
                placeholder="Name"
                secureTextEntry={false}
                onChangeText={setName} />

              <AuthInput
                placeholder="Email Address"
                secureTextEntry={false}
                onChangeText={setEmail}
              />
              <AuthInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPassword}
              />
              <AuthInput
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={setConfirm_Password}
              />
              {/* <TextInput className=' text-gray-600 bg-slate-200 rounded-xl mb-8 px-5 py-4' /> */}
            </View>

            {/* Sign up button */}
            <View className="items-center justify-center mt-6">
              <TouchableOpacity
                onPress={handleSignIn}
                className="text-center rounded-3xl bg-slate-200 px-5 ">
                <Text className="text-center mx-10 my-3 text-lg">SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="ml-2 flex-row items-center justify-center mt-10">
            <Text className="text-white text-lg">Already Have a Account?</Text>
            <Link className="text-white text-lg pl-1" href={"/SignIn"}>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
