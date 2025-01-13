import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ConstructionSchedule() {
    const { CostDetails } = useLocalSearchParams();
    console.log("Cost details", CostDetails);

    // Parse CostDetails as an object
    const costDetails = JSON.parse(CostDetails || '{}');

    // Transform cost details into array format
    const costData = [
        { label: "Area", value: `${costDetails.area} sqft`, icon: "ruler-combined" },
        { label: "City", value: costDetails.city, icon: "city" },
        { label: "State", value: costDetails.state, icon: "map-marked-alt" },
        { label: "Zip Code", value: costDetails.zip_code, icon: "map-pin" },
        { label: "Per Square Price", value: `$${costDetails.per_square_price}`, icon: "dollar-sign" },
        { label: "Unit Price", value: `$${costDetails.unit_price}`, icon: "money-bill-wave" },
        { label: "Total Cost", value: `$${costDetails.total_cost}`, icon: "calculator" },
    ];

    const renderCostDetail = ({ item, index }) => (
        <Animatable.View
            animation="fadeInUp"
            delay={index * 100}
            className="mb-4 bg-white p-4 rounded-lg shadow-lg flex-row items-center"
        >
            <FontAwesome5
                name={item.icon}
                size={24}
                color="#0d9488"
                style={{ marginRight: 12 }}
            />
            <View>
                <Text className="text-lg font-bold text-gray-800">{item.label}</Text>
                <Text
                    className="text-base mt-1"
                    style={{
                        color: item.label.includes("Cost") ? "#ef4444" : "#047857", // Red for costs, green for other details
                        fontWeight: "600",
                    }}
                >
                    {item.value}
                </Text>
            </View>
        </Animatable.View>
    );

    return (
        <View className="flex-1">
            {/* Gradient Header */}
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={{ padding: 20, paddingTop: 50 }}
            >
                <Text className="text-3xl font-bold text-white">Cost Details</Text>
            </LinearGradient>

            {/* FlashList for Cost Details */}
            <FlashList
                data={costData}
                renderItem={renderCostDetail}
                estimatedItemSize={50}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    backgroundColor: "#f3f4f6",
                }}
                keyExtractor={(item, index) => `${item.label}-${index}`}
            />
        </View>
    );
}
