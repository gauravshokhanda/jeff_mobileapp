import { View, TextInput, Dimensions } from 'react-native'
import React from 'react'

export default function AuthInput({ placeholder, secureTextEntry, onChangeText, value }) {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    return (
        <TextInput 
            className='text-gray-700 rounded-lg mb-8 bg-slate-200'
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            value={value}
            style={{
                elevation: 5,
                shadowColor: "#082f49",
                shadowOffset: { width: 0, height: 3 }, 
                shadowOpacity: 0.3, 
                shadowRadius: 2,
                paddingHorizontal: screenWidth * 0.05, 
                paddingVertical: screenHeight * 0.015, 
                fontSize: screenWidth * 0.045, 
                width: screenWidth * 0.72, 
                borderRadius: screenWidth * 0.03, 
            }}
            placeholderTextColor="#A0AEC0"
        />
    );
}
