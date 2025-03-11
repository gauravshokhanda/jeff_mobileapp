import { View, TextInput, Dimensions } from 'react-native'
import React from 'react'

export default function AuthInput({ placeholder, secureTextEntry, onChangeText, value }) {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    return (
        <TextInput 
            className='text-gray-700 rounded-lg mb-8 bg-slate-200 border-b border-b-gray-400 '
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            value={value}
            style={{
                paddingVertical: screenHeight * 0.015, 
                fontSize: screenWidth * 0.045, 
                width: screenWidth * 0.72, 
                borderRadius: screenWidth * 0.03, 
                marginHorizontal:"auto"
            }}
            placeholderTextColor="#A0AEC0"
        />
    );
}
