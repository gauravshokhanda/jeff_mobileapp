import React, { useState, useEffect } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Alert,
    TextInput,
    SafeAreaView,
    Dimensions
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AuthInput from "../../components/AuthInput";
import { Link, useRouter } from "expo-router";
import { API } from "../../config/apiConfig";
import Logo from "../../assets/images/AC5D_Logo.jpg";
import ModalSelector from 'react-native-modal-selector';
import { useDispatch, useSelector } from "react-redux";
import { setSignUp } from "../../redux/slice/authSlice";
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUp() {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const postContentWidth = screenWidth * 0.92;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [role, setRole] = useState({ key: '', label: '' });
    const dispatch = useDispatch();
    const router = useRouter();
    const isToken = useSelector((state) => state.auth.token);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);

    // useEffect(() => {
    //     if (isAuthenticated || token) {
    //         router.replace("/(usertab)");
    //     }
    // }, [isAuthenticated, token, router]);

    const handleSignUp = async () => {
        if (!name || !email || !password || !passwordConfirmation || !role.key) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
        if (password !== passwordConfirmation) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        const data = { name, email, password, password_confirmation: passwordConfirmation, role: role.key };

        try {

            const response = await API.post("auth/register", data);
            // console.log("username", response.data.data.user)
            const { access_token } = response.data;
            console.log("access token", access_token)
            const user = response.data.data.user;
            dispatch(setSignUp({ access_token, user }))

            Alert.alert("Success", "Account created successfully!");
            console.log("User Role After API Call:", role.key);
            if (role.key == 3) {
                router.replace("/ContractorProfileComplete");
            }
            else if (role.key == 4) {
                router.replace("/RealstateSelector")
            }
            else {
                router.replace("/(usertab)");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            Alert.alert("Error", errorMessage);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-200">

            <LinearGradient
                colors={['#082f49', 'transparent']}
                style={{ height: screenHeight * 0.4 }}
            />

            <View className="rounded-3xl "
                style={{
                    position: 'absolute',
                    top: screenHeight * 0.20,
                    width: postContentWidth,
                    height: screenHeight * 0.81,
                    left: (screenWidth - postContentWidth) / 2,
                    backgroundColor: 'white',


                }}
            >
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >

                    <View className="flex-1 rounded-3xl  bg-white p-12 ">
                        {/* Logo */}
                        <View className="items-center justify-center relative"

                        >
                            <View
                                style={{ height: screenHeight * 0.2, width: screenWidth * 0.4, position: "absolute", bottom: -32 }}
                                className="rounded-full border-4 border-sky-950 overflow-hidden items-center justify-center">
                                <Image
                                    source={Logo}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        resizeMode: "cover",
                                    }}
                                />
                            </View>
                        </View>

                        <View
                            style={{ marginTop: screenHeight * 0.09 }}
                            className="w-full max-w-md">
                            {/* Input Fields */}
                            <View className="w-full space-y-4">
                                <AuthInput
                                    placeholder="Name"
                                    secureTextEntry={false}
                                    onChangeText={setName}

                                />
                                <AuthInput
                                    placeholder="Email Address"
                                    secureTextEntry={false}
                                    onChangeText={setEmail}
                                    value={email}

                                />
                                <AuthInput
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    onChangeText={setPassword}
                                    value={password}

                                />
                                <AuthInput
                                    placeholder="Confirm Password"
                                    secureTextEntry={true}
                                    onChangeText={setPasswordConfirmation}
                                    value={passwordConfirmation}
                                />
                                {/* <TextInput className=' text-gray-600 rounded-lg mb-8 px-5 py-5 bg-slate-200'/> */}
                                <View>
                                    <ModalSelector
                                        style={{
                                            marginBlock: 2,
                                        }}
                                        data={[
                                            { key: 2, label: 'Customer' },
                                            { key: 3, label: 'General Contractor' },
                                            { key: 4, label: 'Real Estate Contractor' },
                                        ]}
                                        initValue="Select Role"
                                        onChange={(option) => setRole({ key: option.key, label: option.label })}
                                    >
                                        <TouchableOpacity style={{
                                            backgroundColor: "#e2e8f0",
                                            padding: 15,
                                            borderRadius: 8,
                                            elevation: 15,
                                            shadowColor: "gray",
                                            shadowOffset: { width: 0, height: 3 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 2,
                                        }}>
                                            {role.label
                                                ? <Text className="text-gray-700">{role.label}</Text>
                                                : <Text className="text-gray-400">Select Role</Text>}
                                        </TouchableOpacity>
                                    </ModalSelector>
                                </View>

                            </View>

                            {/* Sign Up Button */}
                            <View className="items-center justify-center mt-6">
                                <TouchableOpacity
                                    onPress={handleSignUp}
                                    className="text-center rounded-3xl bg-sky-950 px-5 py-3 w-full max-w-xs"
                                >
                                    <Text className="text-center text-white text-lg">SIGN UP</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Additional Links */}
                        <View className="w-full max-w-md mt-10 items-center">
                            <View className="flex-row items-center justify-center">
                                <Text className="text-gray-700 text-lg">Already Have an Account?</Text>
                                <Link className="text-blue-600 text-lg pl-1" href="/SignIn">
                                    Sign In
                                </Link>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}