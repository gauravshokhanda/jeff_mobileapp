import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

export default function CompleteProfileModal({
  visible,
  onClose,
  onSubmit,
  initialData = {},
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (visible) {
      setName(initialData.name || "");
      setCity(initialData.city || "");
      setAddress(initialData.address || "");
      setNumber(initialData.number || "");
      setEmail(initialData.email || "");
    }
  }, [visible, initialData]);

  const handleSubmit = () => {
    onSubmit({ name, city, address, number, email });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="bg-white rounded-2xl p-6 w-full">
          <Text className="text-xl font-bold mb-4 text-center text-sky-900">
            Update Your Profile
          </Text>

          {/* Name Field */}
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Full Name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />

          {/* City */}
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="City"
            placeholderTextColor="gray"
            value={city}
            onChangeText={setCity}
          />

          {/* Address */}
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Address"
            placeholderTextColor="gray"
            value={address}
            onChangeText={setAddress}
          />

          {/* Mobile Number */}
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white mb-3 text-gray-800"
            placeholder="Mobile Number"
            placeholderTextColor="gray"
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
          />

          {/* Hidden Email Display */}
          {/* <View className="mb-4">
            <Text className="text-xs text-gray-400 mb-1 ml-1">
              Email (non-editable)
            </Text>
            <View className="border border-gray-200 rounded-md bg-gray-100 px-3 py-2">
              <Text className="text-gray-600">{email}</Text>
            </View>
          </View> */}

          {/* Buttons */}
          <View className="flex-row justify-end gap-2 space-x-6 mt-3">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text className="text-sky-950 font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
