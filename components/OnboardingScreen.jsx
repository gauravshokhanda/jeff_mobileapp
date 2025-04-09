import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const OnboardingScreen = ({ screenNumber, imageSource, title, description, onSkip }) => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* Illustration Image */}
      <Image
        source={imageSource}
        className="w-3/4 h-1/2"
        resizeMode="contain"
      />

      {/* Title and Description */}
      <View className="mt-8 px-4">
        <Text className="text-center text-2xl font-bold text-gray-800">
          {title}
        </Text>
        <Text className="text-center text-base text-gray-600 mt-4">
          {description}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View className="flex-row mt-8">
        <View className="w-3 h-3 bg-gray-300 rounded-full mx-1" />
        <View className="w-3 h-3 bg-gray-300 rounded-full mx-1" />
        <View
          className={`w-3 h-3 bg-blue-500 rounded-full mx-1 ${screenNumber === 3 ? 'bg-blue-500' : 'bg-gray-300'}`}
        />
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between w-full px-8 mt-12">
        {screenNumber > 1 && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="px-4 py-2"
          >
            <Text className="text-blue-500 text-base">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onSkip}
          className="px-4 py-2"
        >
          <Text className="text-blue-500 text-base">Skip</Text>
        </TouchableOpacity>
        {screenNumber < 3 ? (
          <TouchableOpacity
            onPress={() => router.push(`onboardingScreen-${screenNumber + 1}`)}
            className="px-4 py-2"
          >
            <Text className="text-white bg-blue-500 rounded-full px-6 py-2">Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.replace('/home')} // Replace '/home' with your target screen
            className="px-4 py-2"
          >
            <Text className="text-white bg-blue-500 rounded-full px-6 py-2">Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;