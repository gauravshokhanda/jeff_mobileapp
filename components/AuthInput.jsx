import { View, TextInput } from 'react-native'
import React from 'react'

export default function AuthInput({ placeholder, secureTextEntry }) {
    return (
        <TextInput className=' text-gray-600 bg-slate-200 rounded-xl mb-8 px-5 py-4'
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
        />

    )
}