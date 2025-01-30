import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, KeyboardAvoidingView, Image, Modal, Alert,ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import PortfolioModal from "../../components/PortfolioModal"
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API } from '../../config/apiConfig';





export default function ContractorProfileEdit() {

    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    useEffect(() => {
        if (user?.email) {
            setUserEmail(user.email);
        }
    }, [user]); // Runs when `user` changes


    const [userEmail, setUserEmail] = useState('');

    const [modalVisible, setModalVisible] = useState(false);

    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [organizationImage, setOrganizationImage] = useState(null);
    const [loading, setLoading] = useState(false);


    const [portfolioData, setPortfolioData] = useState({
        projectName: '',
        cityName: '',
        address: '',
        description: '',
        images: [],
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
        formData.append("email", userEmail);
        // formData.append("number", "1234567890"); 
        formData.append("address", portfolioData.address); // Add user's address

        // Company details
        formData.append("company_name", companyName);
        formData.append("company_registered_number", registrationNo);
        formData.append("company_address", companyAddress);

        // Portfolio (assuming single project)
        formData.append("project_name", portfolioData.projectName);
        formData.append("description", portfolioData.description);
        formData.append("city", portfolioData.cityName);


        // Upload Images (Profile, Organization, Portfolio)
        if (profileImage) {
            formData.append("image", {
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

        if (portfolioData.images.length > 0) {
            portfolioData.images.forEach((imageUri, index) => {
                formData.append(`portfolio[${index}]`, {
                    uri: imageUri,
                    type: "image/jpeg",
                    name: `portfolio_${index}.jpg`,
                });
            });
        }

        // console.log("Submitting form data:", formData);
        setLoading(true);

        try {
            const response = await API.post('setup-profile', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Profile submitted successfully:", response.data);
            console.log("Profile submitted successfully:", response.data.message);
            Alert.alert('Success',response.data.message)

            setFullName('');
            setCompanyName('');
            setRegistrationNo('');
            setCompanyAddress('');
            setProfileImage(null);
            setOrganizationImage(null);
            setPortfolioData({
                projectName: '',
                cityName: '',
                address: '',
                description: '',
                images: [],
            });
        } catch (error) {
            console.error("Error submitting profile:", error.response?.data || error.message);
        }finally {
            setLoading(false); 
          }
    };

    if (loading) {
    
        return (
          <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="text-gray-700 mt-4 text-lg">Loading</Text>
          </View>
        );
      }

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
                    <View className="flex-1 m-9">
                        {/* Image Preview Section */}
                        {portfolioData.images.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {portfolioData.images.map((uri, index) => (
                                    <View key={index} className="relative mx-2">
                                        <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
                                        <TouchableOpacity className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                                            onPress={() => setPortfolioData(prevData => ({
                                                ...prevData,
                                                images: prevData.images.filter((_, i) => i !== index),
                                            }))}>
                                            <Ionicons name="close" size={16} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <TouchableOpacity className="border border-gray-400 w-[60%] rounded-2xl justify-around items-center flex-row bg-white" onPress={() => setModalVisible(true)}>
                                <Text className="p-3 text-xl font-semibold text-gray-600">Add portfolio</Text>
                                <Image source={require('../../assets/images/shortUploadIcon.png')} />
                            </TouchableOpacity>
                        )}
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