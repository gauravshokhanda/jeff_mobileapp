import { 
  View, 
  Text, 
  TouchableOpacity, 
  Platform, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Image, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import PortfolioModal from "../../components/PortfolioModal";
import * as DocumentPicker from 'expo-document-picker';
import { useSelector } from 'react-redux';
import { API } from '../../config/apiConfig';
import { BlurView } from 'expo-blur';

export default function ContractorProfileComplete() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  const [userEmail, setUserEmail] = useState('');
  const [userName,setUserFullName]=useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [companyContactNumber, setCompanyContactNumber] = useState('');
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

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    }
    if (user?.name) {
      setUserFullName(user.name);
    }
  }, [user]);

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
    const formData = new FormData();

    formData.append("name", userName);
    formData.append("email", userEmail);
    formData.append("address", portfolioData.address);
    formData.append("company_name", companyName);
    formData.append("number", companyContactNumber);

    formData.append("company_registered_number", registrationNo);
    formData.append("company_address", companyAddress);
    formData.append("project_name", portfolioData.projectName);
    formData.append("description", portfolioData.description);
    formData.append("city", portfolioData.cityName);

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

    portfolioData.images.forEach((imageUri, index) => {
      formData.append(`portfolio[${index}]`, {
        uri: imageUri,
        type: "image/jpeg",
        name: `portfolio_${index}.jpg`,
      });
    });

    setLoading(true);

    try {
      const response = await API.post('setup-profile', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile submitted successfully:", response.data);
      router.replace("/(generalContractorTab)");
    } catch (error) {
      console.error("Error submitting profile:", error.response?.data || error.message);
    } finally {
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
      {/* Blur Overlay */}
      {modalVisible && (
        <BlurView
          style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
          intensity={50}
          tint="light"
        />
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="p-4 bg-sky-950">
          <TouchableOpacity
            className="absolute z-10 left-4 top-4"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-gray-100 text-xl font-bold text-center">
            Complete Your Profile
          </Text>
        </View>

        {/* Form Content */}
        <View className="flex-1 m-6">
          {/* <View>
            <Text className="text-gray-600 mb-1 ml-3 text-sm">Full Name</Text>
            <TextInput
              className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
              placeholder="Enter Your Full Name"
              placeholderTextColor="gray"
              value={fullName}
              onChangeText={setFullName}
            />
          </View> */}

          <View className="mt-6">
            <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Name</Text>
            <TextInput
              className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
              placeholder="Enter Your Company Name"
              placeholderTextColor="gray"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>
          
          <View className="mt-6">
            <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Contact Number</Text>
            <TextInput
              className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
              placeholder="Enter Your Company Name"
              placeholderTextColor="gray"
              value={companyContactNumber}
              onChangeText={setCompanyContactNumber}
            />
          </View>

          <View className="mt-6 flex-row justify-between items-center">
            <View className="justify-center items-center">
              <Text className="text-gray-600 text-sm">Upload your Profile</Text>
              <TouchableOpacity 
                onPress={() => pickImage(setProfileImage)} 
                className="size-32 mt-4 bg-gray-200 rounded-3xl justify-center items-center"
              >
                {profileImage ? (
                  <Image source={{ uri: profileImage }} className="w-full h-full rounded-3xl" />
                ) : (
                  <Image source={require('../../assets/images/UploadLogo.png')} />
                )}
              </TouchableOpacity>
            </View>

            <View className="w-[40%]">
              <Text className="text-gray-600 text-sm">Upload Organization Photo</Text>
              <TouchableOpacity 
                onPress={() => pickImage(setOrganizationImage)} 
                className="size-32 my-2 bg-gray-200 rounded-3xl justify-center items-center"
              >
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
            <TextInput
              className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
              placeholder="Enter Your Company Registration No"
              placeholderTextColor="gray"
              value={registrationNo}
              onChangeText={setRegistrationNo}
            />
          </View>

          <View className="mt-6">
            <Text className="text-gray-600 mb-1 ml-3 text-sm">Company Address</Text>
            <TextInput
              className="border border-gray-400 rounded-2xl pl-3 bg-white py-4"
              placeholder="Enter Company Address"
              placeholderTextColor="gray"
              value={companyAddress}
              onChangeText={setCompanyAddress}
            />
          </View>

          <View className="mt-6 items-start">
            {portfolioData.images.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {portfolioData.images.map((uri, index) => (
                  <View key={index} className="relative mx-2">
                    <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
                    <TouchableOpacity
                      className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                      onPress={() => setPortfolioData(prevData => ({
                        ...prevData,
                        images: prevData.images.filter((_, i) => i !== index),
                      }))}
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <TouchableOpacity 
                className="border border-gray-400 rounded-2xl p-3 flex-row items-center"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-gray-600 font-semibold mr-2">Add Portfolio</Text>
                <Image source={require('../../assets/images/shortUploadIcon.png')} />
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-9 items-center">
            <TouchableOpacity 
              className="bg-sky-950 w-[45%] rounded-2xl" 
              onPress={handleSubmit}
            >
              <Text className="p-3 text-white text-center">Save Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Portfolio Modal */}
      <PortfolioModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        setPortfolioData={setPortfolioData}
      />
    </KeyboardAvoidingView>
  );
}