import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <View className="flex-1 bg-white px-5 py-5">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Ionicons name="arrow-back" size={24} color="black" />
        <Ionicons name="settings-outline" size={24} color="black" />
      </View>

      {/* Profile Section */}
      <View className="items-center my-5">
        <View className="relative">
          <Image
            source={{ uri: 'https://example.com/profile.png' }} // Replace with your image URL
            className="w-20 h-20 rounded-full"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-customBlue p-1 rounded-full">
            <MaterialIcons name="edit" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-500">Basic Design</Text>
      </View>

      {/* Form Section */}
      <View className="space-y-4">
        {/* Email Field */}
        <View>
          <Text className="text-sm font-semibold text-gray-500">Your Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mt-1">
            <Ionicons name="mail-outline" size={20} color="gray" />
            <TextInput
              className="ml-2 flex-1 text-black"
              placeholder="xx@gmail.com"
              editable={false}
            />
          </View>
        </View>

        {/* Phone Number Field */}
        <View>
          <Text className="text-sm font-semibold text-gray-500">Phone Number</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mt-1">
            <Ionicons name="call-outline" size={20} color="gray" />
            <TextInput
              className="ml-2 flex-1 text-black"
              placeholder="+60123456789"
              editable={false}
            />
          </View>
        </View>

        {/* Website Field */}
        <View>
          <Text className="text-sm font-semibold text-gray-500">Website</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mt-1">
            <Ionicons name="globe-outline" size={20} color="gray" />
            <TextInput
              className="ml-2 flex-1 text-black"
              placeholder="www.gfx.com"
              editable={false}
            />
          </View>
        </View>

        {/* Password Field */}
        <View>
          <Text className="text-sm font-semibold text-gray-500">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mt-1">
            <Ionicons name="lock-closed-outline" size={20} color="gray" />
            <TextInput
              className="ml-2 flex-1 text-black"
              placeholder="********"
              secureTextEntry
              editable={false}
            />
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity className="bg-customBlue mt-10 py-3 rounded-lg">
        <Text className="text-center text-white font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
