import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


export default function CostDetail() {
    const { CostDetails } = useLocalSearchParams();

    const costDetails = CostDetails ? JSON.parse(CostDetails) : null;
    console.log("const details", costDetails.days)

    if (!costDetails) {
        return (
            <View className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-xl text-gray-700">No Cost Details Available</Text>
            </View>
        );
    }


    const detailItems = [
        { label: "Area", value: `${costDetails.area} sqft`, icon: "ruler-combined" },
        { label: "City", value: costDetails.city, icon: "city" },
        { label: "State", value: costDetails.state, icon: "map-marker-alt" },
        { label: "Zip Code", value: costDetails.zip_code, icon: "map-pin" },
        { label: "Per Square Price", value: `$${costDetails.per_square_price}`, icon: "dollar-sign" },
        { label: "Unit Price", value: `$${costDetails.unit_price}`, icon: "money-bill-wave" },
        { label: "Total Cost", value: `$${costDetails.total_cost}`, icon: "calculator" },
    ];

    const handleBreakdownCost = () => {
        const breakdownCost = JSON.stringify(costDetails.days);
        router.push(`/BreakdownCost?breakdownCost=${breakdownCost}`)
    }

    return (
        <View className="flex-1 bg-gray-100">

            <View className="bg-sky-950 p-5">
                <TouchableOpacity
                    className="absolute top-6 left-4"
                    onPress={() => router.back()}
                >
                    <Ionicons name='arrow-back' size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-center text-white">Costing Summary</Text>
            </View>


            <View className="flex-1 p-5 justify-center">
                <View className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">

                    <Text className="text-3xl font-bold text-sky-950 mb-6 text-center bg-slate-100 rounded-lg py-2">Cost Details</Text>
                    {detailItems.map((item, index) => (
                        <View key={index} className="flex-row items-center mb-4">
                            <View
                                className="justify-center items-center bg-sky-100"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    marginRight: 12,
                                }}
                            >
                                <FontAwesome5
                                    name={item.icon}
                                    size={20}
                                    color="#082f49"
                                />
                            </View>
                            <View>
                                <Text className="text-gray-700 font-semibold">{item.label}:</Text>
                                <Text
                                    className={`text-lg ${item.label.includes("Cost") ? "text-red-600" : "text-gray-700"}`}
                                    style={{ fontWeight: item.label.includes("Cost") ? 'bold' : 'normal' }}
                                >
                                    {item.value}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <View className="p-5">
                <TouchableOpacity
                    // onPress={() => router.push(`/BreakdownCost?breakdownCost=${costDetails.days}`)}
                    onPress={handleBreakdownCost}
                    className="bg-sky-500 rounded-lg py-3 px-6 flex-row justify-center items-center">

                    <Text className="text-white font-semibold">Cost Breakdown</Text>
                    <Ionicons name="arrow-forward" size={26} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
