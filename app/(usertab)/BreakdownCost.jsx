import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';


export default function BreakdownCost() {
    const { breakdownCost } = useLocalSearchParams();
    console.log("breakdownCost", breakdownCost)
    return (
        <View>
            <View className="bg-sky-950">
                <Text className="p-5 text-white text-2xl font-bold">Breakdown Cost</Text>
                <Text className="text-slate-200"></Text>
            </View>
        </View>
    )
}