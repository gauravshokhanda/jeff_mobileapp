
import { View, Dimensions, Text, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import RadioGroup from "react-native-radio-buttons-group";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomTextInput from "../../components/CustomTextInput"
import CustomDatePicker from "../../components/CustomDatePicker"
import API from "../../config/apiConfig"
import { useSelector } from 'react-redux';



export default function Index() {
    const { width: screenWidth } = Dimensions.get('window');
    const postContentWidth = screenWidth * 0.90;
    const [selectedBHK, setSelectedBHK] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedPropertyType, setSelectedPropertyType] = useState(null);
    const [selectedHomeType, setSelectedHomeType] = useState(null);


    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [locality, setLocality] = useState('');
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');
    const [availableFrom, setAvailableFrom] = useState(null);

    const propertyTypes = [
        { id: 'residential', label: 'Residential' },
        { id: 'commercial', label: 'Commercial' },
    ];
    const renderPropertyTypeItem = ({ item }) => {
        const isSelected = selectedPropertyType === item.id;

        return (
            <TouchableOpacity
                className="rounded-lg overflow-hidden"
                onPress={() => setSelectedPropertyType(item.id)}
            >
                <LinearGradient
                    colors={isSelected ? ['#93C5FD', '#1E3A8A'] : ['#F3F4F6', '#D1D5DB']} // Blue when selected, Gray otherwise
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    className="px-8 py-4 flex items-center justify-center"
                >
                    <Text className={`text-lg font-medium ${isSelected ? "text-white" : "text-gray-900"}`}>
                        {item.label}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    // Home type
    const homeTypes = [
        {
            id: '1',
            name: 'Apartment',
            image: require('../../assets/images/realState/ApartmentHouse.png'),
        },
        {
            id: '2',
            name: 'Independent Floor',
            image: require('../../assets/images/realState/IndependentFloor.png'),
        },
        {
            id: '3',
            name: 'Independent House',
            image: require('../../assets/images/realState/IndependentHouse.png'),
        },
    ];
    const renderHomeTypeItem = ({ item }) => {
        const isSelected = selectedHomeType === item.name;

        return (
            <TouchableOpacity
                className={`border border-gray-400 rounded-full justify-center items-center mx-2 ${isSelected ? "bg-sky-200" : "bg-white"}`}
                style={{ width: 100, height: 100 }}
                onPress={() => setSelectedHomeType(item.name)}
            >
                <Image source={item.image} style={{ width: 50, height: 50 }} resizeMode="contain" />
                <Text className="text-sm font-medium mt-2 text-center">{item.name}</Text>
            </TouchableOpacity>
        );
    };

    // nhk render
    const bhkOptions = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK"];
    const renderBHKItem = ({ item }) => {
        const isSelected = selectedBHK === item;
        return (
            <TouchableOpacity
                onPress={() => setSelectedBHK(item)}
                className={`border border-gray-300 rounded-lg px-6 py-4 mx-2 ${isSelected ? "bg-gray-300" : "bg-white"}`}>
                <Text className="text-lg font-medium">{item}</Text>
            </TouchableOpacity>
        )
    }

    // furnish type
    const furnishOptions = [
        { id: "fully", label: "Fully Furnished", icon: require('../../assets/images/realState/Fullfurnish.png') },
        { id: "semi", label: "Semi Furnished" },
        { id: "unfurnished", label: "Unfurnished" }
    ];

    // Render each Furnish Type option
    const renderFurnishItem = ({ item }) => {
        const isSelected = selectedType === item.id;
        return (
            <TouchableOpacity
                className={`border border-gray-300 rounded-lg px-6 py-4 mx-2 flex-row items-center ${isSelected ? "bg-blue-200" : ""
                    }`}
                onPress={() => setSelectedType(item.id)}
            >
                <Image source={item.icon ? item.icon : ""} className="w-6 h-6 mr-3" />
                <Text className="text-lg">{item.label}</Text>
            </TouchableOpacity>
        );
    };


    // handle submit
    const token = useSelector((state) => state.auth.token);
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("property-type", selectedPropertyType);
        formData.append("City", city);
        formData.append("house-type", selectedHomeType);
        formData.append("address", address);
        formData.append("locale", locality);
        formData.append("bhk", selectedBHK);
        formData.append("area", area);
        formData.append("furnish_type", selectedType);
        formData.append("price", price);
        formData.append("available_from", availableFrom);
        console.log("form data", formData)
        const response = await API.post("/realstate-detail", {
            headers:
            {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    };

    return (
        <View className="flex-1 bg-gray-200">
            <View className="h-[40%] bg-sky-950" >
                <View className="bg-sky-950 p-10">
                    <TouchableOpacity
                        className="absolute top-10 left-4"
                    >
                        <Ionicons name='arrow-back' size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-center text-white">Basic details</Text>
                </View>

            </View>
            <View className="rounded-3xl border border-gray-400"
                style={{
                    position: 'absolute',
                    top: '10%',
                    width: postContentWidth,
                    height: '90%',
                    left: (screenWidth - postContentWidth) / 2,
                    backgroundColor: 'white',
                    marginBottom: 10,

                }}
            >

                <KeyboardAvoidingView
                    className="flex-1 mx-7 my-5"
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">


                        <View className=" flex-1">

                            <View className="mb-8">
                                <Text className="text-xl font-medium mb-3 tracking-widest">Property Type</Text>

                                <FlatList
                                    data={propertyTypes}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={renderPropertyTypeItem}
                                    contentContainerStyle={{ gap: 10 }}
                                />

                                <View className="flex-row items-center border-b border-gray-300 mt-5">

                                    <Ionicons name="search" size={18} color="black" />
                                    <TextInput
                                        value={city}
                                        onChangeText={(text) => setCity(text)}
                                        placeholder="Search City"
                                        placeholderTextColor="gray"
                                        className="flex-1 text-lg text-gray-800 ml-5"
                                    />
                                    <MaterialCommunityIcons name="crosshairs-gps" size={25} color="#0C4A6E" />
                                </View>

                                {/* House Type */}
                                <View className="mt-10">
                                    <Text className="text-xl font-medium mb-3 tracking-widest">House Type</Text>
                                    <FlatList
                                        data={homeTypes}
                                        keyExtractor={(item) => item.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 10 }}
                                        renderItem={renderHomeTypeItem}
                                    />
                                </View>


                                <View className="mt-5">
                                    <CustomTextInput
                                        placeholder="Building/Project/Society(Optional)"
                                        value={address}
                                        onChangeText={setAddress}
                                    />
                                    <CustomTextInput
                                        placeholder="Enter Locality"
                                        value={locality}
                                        onChangeText={setLocality}
                                    />
                                    <CustomTextInput
                                        value={price}
                                        onChangeText={setPrice}
                                        placeholder="Price" />
                                    <CustomTextInput
                                        placeholder="Built Up Area"
                                        value={area}
                                        onChangeText={setArea}
                                    />

                                </View>


                                {/* BHK */}
                                <View className="my-10">
                                    <Text className="text-lg font-medium mb-3 tracking-widest">BHK</Text>
                                    <FlatList
                                        data={bhkOptions}
                                        keyExtractor={(item) => item}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 5 }}
                                        renderItem={renderBHKItem}
                                    />
                                </View>


                                <View className="mb-10">
                                    <Text className="text-lg font-medium mb-4">Furnish Type</Text>

                                    {/* Horizontal Scrollable FlatList */}
                                    <FlatList
                                        data={furnishOptions}
                                        keyExtractor={(item) => item.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 10 }}
                                        renderItem={renderFurnishItem}
                                    />
                                </View>
                                <View>
                                    <CustomDatePicker
                                        label="Available From"
                                        value={availableFrom}
                                        onChangeDate={setAvailableFrom}
                                    />
                                </View>

                            </View>

                        </View>

                        <View className="mx-10">
                            <TouchableOpacity
                                onPress={handleSubmit}
                                className="bg-sky-950 justify-center items-center rounded-xl">
                                <Text className="text-white text-xl py-4">Add Property Details</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>


            </View>
        </View>
    );
}