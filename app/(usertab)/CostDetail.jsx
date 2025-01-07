import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';

const data = [
    {
        category: "General Conditions",
        tasks: [
            { name: "Plan Review/Permitting", days: 31, percentage: 21.8 },
        ],
    },
    {
        category: "Site Work",
        tasks: [
            { name: "Site Work", days: 3, percentage: 2.1 },
        ],
    },
    {
        category: "Foundation",
        tasks: [
            { name: "Foundation", days: 12, percentage: 8.5 },
        ],
    },
    {
        category: "Dry In",
        tasks: [
            { name: "Install Sheathing", days: 3, percentage: 2.1 },
            { name: "Install Roofing", days: 3, percentage: 2.1 },
        ],
    },
];

export default function ConstructionSchedule() {
    const renderTask = ({ item }) => (
        <View className="mb-4" key={item.name}>
            <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
            <View className="mt-2">
               
                <View className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
                    <LinearGradient
                        colors={['#22d3ee', '#075985']}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={{ width: `${item.percentage}%`, height: '100%' }}
                    />
                </View>
                <Text className="text-sm text-gray-600 mt-2">{`${item.days} Days (${item.percentage}%)`}</Text>
            </View>
        </View>
    );

    const renderCategory = ({ item }) => (
        <View className="mb-6 bg-white border-b border-b-sky-300 rounded-xl p-6 shadow-lg" key={item.category}>
            <Text className="text-2xl font-semibold mb-1 text-sky-800">{item.category}</Text>
            {item.tasks.map((task) => (
                renderTask({ item: task })
            ))}
        </View>
    );

    return (
        <View className="flex-1">
           
            <View className="bg-sky-950 p-6"
            >
                <Text className="text-3xl font-bold text-white">Construction Schedule</Text>
                <Text className="text-base text-gray-200 mt-2">
                    Total Duration: 142 Days (28.4 Weeks / 6.55 Months)
                </Text>
            </View>

            <FlashList
                data={data}
                renderItem={renderCategory}
                estimatedItemSize={200}
                contentContainerStyle={{ padding: 16, backgroundColor: "#f9fafb" }} 
                keyExtractor={(item) => item.category}
            />
        </View>
    );
}
