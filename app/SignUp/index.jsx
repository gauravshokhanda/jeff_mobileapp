import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import AuthInput from "../../components/AuthInput";
import { Link, useRouter } from "expo-router";
import { API, baseUrl } from "../../config/apiConfig";
import { Alert } from 'react-native';
import { setSignUp } from "../../redux/slice/authSlice"

// import { setLogin } from "../redux/slice/authSlice"
export default function Index() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [password_confirmation, setpassword_confirmation] = useState("")

    const router = useRouter()


    const handleSignIn = async () => {
        if (!name || !email || !password || !password_confirmation) {
            Alert.alert("Error", "All fields are required.");
            console.log("all fields are required")
            return;
        }
        const data = { name, email, password, password_confirmation }
        try {
            const response = await API.post("auth/register", data);
            const { access_token } = response.data
            dispatch(setSignUp({ access_token }))
            Alert.alert("Success", "Account created Successfully!")
            router.replace('/(usertab)')
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const messages = errorData.messages || {};
                const emailErrors = messages.email ? messages.email.join(", ") : null;
                const passwordErrors = messages.password ? messages.password.join(", ") : null;
                const combinedErrors = [emailErrors, passwordErrors].filter((msg) => msg).join(" ");
                Alert.alert("Error", combinedErrors)

            }
        }

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
                                placeholder="password"
                                secureTextEntry={true}
                                onChangeText={setpassword}
                            />
                            <AuthInput
                                placeholder="Confirm password"
                                secureTextEntry={true}
                                onChangeText={setpassword_confirmation}
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
                        <Link className="text-white text-lg pl-1" href={"/"}>Sign In</Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
