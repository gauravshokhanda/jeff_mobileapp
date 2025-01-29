import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, KeyboardAvoidingView, Image, Modal} from 'react-native'
import React,{useState} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import PortfolioModal from "../../components/PortfolioModal"


export default function ContractorProfileEdit() {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"

            >


                <View className="p-4 bg-sky-950">
                    <TouchableOpacity
                        className={`absolute z-10 left-4 ${Platform.OS === 'ios' ? 'top-4' : 'top-4'}`}
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-gray-100 text-xl font-bold text-center">Complete Your Profile</Text>
                </View>

                {/* fields */}
                <View className="flex-1 m-9">
                    <View>
                        <Text className="text-gray-600 mb-1 ml-3 text-sm">Full Name</Text>
                        <TextInput className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
                            placeholder='Enter Your Full Name'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View className="mt-6">
                        <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Name</Text>
                        <TextInput className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
                            placeholder='Enter Your Company Name'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View className="mt-6 flex-row justify-between items-center">
                        <View className="justify-center items-center">
                            <Text className="text-gray-600 text-sm">Upload your Profile</Text>
                            <View className="size-32 mt-4 bg-gray-200 rounded-3xl justify-center items-center">
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../assets/images/UploadLogo.png')}
                                    />

                                </TouchableOpacity>

                            </View>
                        </View>
                        <View className="w-[40%]">
                            <Text className="text-gray-600 text-sm">Upload Organization Photo</Text>
                            <View className="size-32 my-2 bg-gray-200 rounded-3xl justify-center items-center">
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../assets/images/uploadOrganization.png')}
                                    />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                    <View className="mt-6">
                        <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Registration No.</Text>
                        <TextInput className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
                            placeholder='Enter Your Company Registration No'
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View className="mt-6">
                        <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Address</Text>
                        <TextInput className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
                            placeholder='Enter Company Address'
                            placeholderTextColor={'gray'}
                        />
                    </View>

                    <View className="mt-6">
                        <TouchableOpacity className="border border-gray-400 w-[60%] rounded-2xl justify-around items-center flex-row bg-white">
                            <Text className="p-3 text-xl font-semibold text-gray-600">Add portfolio</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Image
                                    source={require('../../assets/images/shortUploadIcon.png')}
                                />
                            </TouchableOpacity>

                        </TouchableOpacity>
                    </View>

                    <View className="mt-9 ml-2 items-center">
                        <TouchableOpacity className=" bg-sky-950 w-[45%] rounded-2xl">
                            <Text className="p-3 text-white text-center">Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>


             <PortfolioModal visible={modalVisible} onClose={()=>setModalVisible(false)}/> 

            </ScrollView>


        </KeyboardAvoidingView>

    )
}