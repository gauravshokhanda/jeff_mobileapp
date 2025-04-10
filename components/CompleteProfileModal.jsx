import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useSelector } from "react-redux";

export default function CompleteProfileModal({ visible, onClose, onSubmit }) {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="bg-white rounded-2xl p-6 w-full">
          <Text className="text-xl font-bold mb-4 text-center">
            Complete Your Profile
          </Text>

          <TextInput
            className="border border-gray-400 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="City"
            placeholderTextColor="gray"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            className="border border-gray-400 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Address"
            placeholderTextColor="gray"
            value={address}
            onChangeText={setAddress}
          />

          <TextInput
            className="border border-gray-400 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Mobile Number"
            placeholderTextColor="gray"
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
          />

          <View className="flex-row gap-2 justify-end space-x-6 mt-2">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSubmit({ city, address, number })}
            >
              <Text className="text-sky-700 font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}