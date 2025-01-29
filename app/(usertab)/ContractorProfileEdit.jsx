import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, KeyboardAvoidingView, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import PortfolioModal from "../../components/PortfolioModal"
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';




export default function ContractorProfileEdit() {
    const token = useSelector((state) => state.auth.token);

    const [modalVisible, setModalVisible] = useState(false);

    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [organizationImage, setOrganizationImage] = useState(null);

    const [portfolioData, setPortfolioData] = useState({
        projectName: '',
        cityName: '',
        address: '',
        description: '',
        imageUri: null
    });

    const pickImage = async (setImage) => {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
            copyToCacheDirectory: true
        });

        if (result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };



    const handleSubmit = async () => {
        const apiUrl = "https://g32.iamdeveloper.in/api/setup-profile"; // Replace with your actual API URL
    
        // Prepare the form data
        const formData = new FormData();
    
        // Required fields
        formData.append("name", fullName);
        formData.append("email", "test@example.com");  // Replace with actual email
        formData.append("number", "1234567890"); // Replace with actual number
        formData.append("address", "Some Address"); // Add user's address
    
        // Company details
        formData.append("company_name", companyName);
        formData.append("company_registered_number", registrationNo);
        formData.append("company_address", companyAddress);
    
        // Portfolio (assuming single project)
        formData.append("project_name", portfolioData.projectName);
        formData.append("description", portfolioData.description);
    
        // Upload Images (Profile, Organization, Portfolio)
        if (profileImage) {
            formData.append("profile_image", {
                uri: profileImage,
                type: "image/jpeg",
                name: "profile.jpg",
            });
        }
    
        if (organizationImage) {
            formData.append("upload_organisation", {
                uri: organizationImage,
                type: "image/jpeg",
                name: "organisation.jpg",
            });
        }
    
        if (portfolioData.imageUri) {
            formData.append("portfolio[]", {
                uri: portfolioData.imageUri,
                type: "image/jpeg",
                name: "portfolio.jpg",
            });
        }
    
        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // If authentication is needed
                },
            });
    
            console.log("Profile submitted successfully:", response.data);
        } catch (error) {
            console.error("Error submitting profile:", error.response?.data || error.message);
        }
    };
    
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
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>
                    <View className="mt-6">
                        <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Name</Text>
                        <TextInput className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
                            placeholder='Enter Your Company Name'
                            placeholderTextColor={'gray'}
                            value={companyName}
                            onChangeText={setCompanyName}
                        />
                    </View>
                    <View className="mt-6 flex-row justify-between items-center">
                        {/* Profile Image Upload */}
                        <View className="justify-center items-center">
                            <Text className="text-gray-600 text-sm">Upload your Profile</Text>
                            <TouchableOpacity onPress={() => pickImage(setProfileImage)} className="size-32 mt-4 bg-gray-200 rounded-3xl justify-center items-center">
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} className="w-full h-full rounded-3xl" />
                                ) : (
                                    <Image source={require('../../assets/images/UploadLogo.png')} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Organization Image Upload */}
                        <View className="w-[40%]">
                            <Text className="text-gray-600 text-sm">Upload Organization Photo</Text>
                            <TouchableOpacity onPress={() => pickImage(setOrganizationImage)} className="size-32 my-2 bg-gray-200 rounded-3xl justify-center items-center">
                                {organizationImage ? (
                                    <Image source={{ uri: organizationImage }} className="w-full h-full rounded-3xl" />
                                ) : (
                                    <Image source={require('../../assets/images/uploadOrganization.png')} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="mt-6">
                        <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Registration No.</Text>
                        <TextInput className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
                            placeholder='Enter Your Company Registration No'
                            placeholderTextColor={'gray'}
                            value={registrationNo}
                            onChangeText={setRegistrationNo}

                        />
                    </View>
                    <View className="mt-6">
                        <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Address</Text>
                        <TextInput className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
                            placeholder='Enter Company Address'
                            placeholderTextColor={'gray'}
                            value={companyAddress}
                            onChangeText={setCompanyAddress}
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
                        <TouchableOpacity className=" bg-sky-950 w-[45%] rounded-2xl" onPress={handleSubmit}>
                            <Text className="p-3 text-white text-center">Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <PortfolioModal visible={modalVisible} onClose={() => setModalVisible(false)} setPortfolioData={setPortfolioData} />

            </ScrollView>


        </KeyboardAvoidingView>

    )
}