// components/CompleteProfileModal.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

export default function CompleteProfileModal({ visible, onClose, onSubmit }) {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-[90%]">
          <Text className="text-xl font-bold mb-4 text-center">
            Complete Your Profile
          </Text>

          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            className="border border-gray-300 rounded-md p-2 mb-3"
          />
          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            className="border border-gray-300 rounded-md p-2 mb-3"
          />
          <TextInput
            placeholder="Mobile Number"
            value={mobile}
            keyboardType="phone-pad"
            onChangeText={setMobile}
            className="border border-gray-300 rounded-md p-2 mb-3"
          />

          <View className="flex-row justify-end space-x-4 mt-4">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSubmit({ city, address, mobile })}
            >
              <Text className="text-sky-700 font-medium">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
