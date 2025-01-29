import { View, Text, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function UploadOrganizationModal({ visible, onClose, setPortfolioData }) {
    const [projectName, setProjectName] = useState('');
    const [cityName, setCityName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const pickImage = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
            copyToCacheDirectory: true,
        });

        console.log(result); // Debugging: Check the result structure

        if (result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };


    const handleUpload = () => {
        setPortfolioData(prevData => ({
            ...prevData,
            projectName,
            cityName,
            address,
            description,
            imageUri, // Ensure imageUri is included
        }));
        onClose();
    };
    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-6 rounded-2xl w-[80%]">
                        <TouchableOpacity className="absolute top-3 right-3" onPress={onClose}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-gray-700 text-lg font-bold mb-4">Upload Portfolio</Text>

                        <Text className="text-gray-600 mb-2">Project Name</Text>
                        <TextInput className="border border-gray-400 rounded-lg p-3 bg-white" placeholder='Enter Project Name' placeholderTextColor={'gray'} value={projectName} onChangeText={setProjectName} />

                        <Text className="text-gray-600 mt-4 mb-2">City Name</Text>
                        <TextInput className="border border-gray-400 rounded-lg p-3 bg-white" placeholder='Enter City Name' placeholderTextColor={'gray'} value={cityName} onChangeText={setCityName} />

                        <Text className="text-gray-600 mt-4 mb-2">Address</Text>
                        <TextInput className="border border-gray-400 rounded-lg p-3 bg-white" placeholder='Enter Address' placeholderTextColor={'gray'} value={address} onChangeText={setAddress} />

                        <Text className="text-gray-600 mt-4 mb-2">Description</Text>
                        <TextInput className="border border-gray-400 rounded-lg p-3 bg-white" placeholder='Enter Description' placeholderTextColor={'gray'} value={description} onChangeText={setDescription} />

                        <Text className="text-gray-600 mt-4 mb-2">Add Images</Text>
                        <TouchableOpacity onPress={pickImage} className="bg-gray-200 rounded-xl p-6 items-center justify-center w-[60%]">
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} className="w-20 h-20 rounded-xl" />
                            ) : (
                                <Image source={require('../assets/images/uploadOrganization.png')} className="w-5 h-5" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-sky-950 mt-6 rounded-2xl p-3" onPress={handleUpload}>
                            <Text className="text-white text-center">Upload</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}