import { View, TextInput } from 'react-native'
import React from 'react'

export default function AuthInput({ placeholder, secureTextEntry, onChangeText }) {
    return (
        <TextInput className=' text-gray-700 rounded-lg mb-8 px-5 py-5 bg-slate-200'
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            style={{
                elevation: 15,
                shadowColor: "#082f49",
                shadowOffset: { width: 0, height: 3 }, 
                shadowOpacity: 0.3, 
                shadowRadius: 2,
            }}
            placeholderTextColor="#A0AEC0"
        />
    )
}