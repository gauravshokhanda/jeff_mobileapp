import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import AuthInput from "../../components/AuthInput";
import { Link, useRouter } from "expo-router";

export default function Index() {
    const router = useRouter();
    const handleSignIn = () => {
        console.log("handle sign in")
        router.push('/(usertab)')
    }
    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="flex-1 bg-sky-950 p-12 border">
                    <View className="flex-1">
                        <View className="flex-row items-center border-b border-b-white  pb-4 mt-8 mb-10">
                            <FontAwesome name="chevron-left" size={15} color="white" />
                            <Text className="text-white text-2xl font-medium pl-6 ">
                                Sign In
                            </Text>
                        </View>
                        <View className="my-10 pt-8 pb-10">
                            <Text
                                className="text-white text-5xl text-center elevation-lg font-semibold">G32CROP</Text>
                        </View>
                        {/* input text */}
                        <View>
                            <AuthInput placeholder="Email Address" secureTextEntry={false} />
                            <AuthInput placeholder="Password" secureTextEntry={true} />

                        </View>



                        {/* Sign up button */}
                        <View className="items-center justify-center mt-6">
                            <TouchableOpacity
                                onPress={handleSignIn}
                                className="text-center rounded-3xl bg-slate-200 px-5 ">
                                <Text className="text-center mx-10 my-3 text-lg">SIGN IN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <View className="mt-10 items-center justify-center pl-1 pb-2">
                            <Link href={""} className="text-slate-300">Forgot Your Password</Link>
                        </View>
                        <View className="ml-2 flex-row items-center justify-center ">
                            <Text className="text-white text-lg">Already Have a Account?</Text>
                            <Link className="text-white text-lg pl-1" href={"/"}>Sign up</Link>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
