import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';
import { FlashList } from '@shopify/flash-list';
import { Circle } from 'react-native-progress';

export default function BreakdownCost() {
    const { breakdownCost } = useLocalSearchParams();
    const parsedData = JSON.parse(breakdownCost);
    const { estimated_time, project_type, square_fit, data } = parsedData;

 
    const totalDays = Object.values(data).reduce((acc, day) => acc + day, 0);
    const categories = Object.entries(data);

  
    const categoryColors = categories.map(() => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-1 bg-sky-100 p-5">
                <Text className="text-2xl font-bold text-gray-600">Category Report</Text>
                <Text className="text-lg text-gray-500">{project_type}</Text>
            </View>

            {/* Pie Chart */}
            <View className="items-center my-4">
                <PieChart
                    data={categories.map(([key, value], index) => ({
                        name: key.replace(/_/g, ' '),
                        population: value,
                        color: categoryColors[index],
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 12,
                    }))}
                    width={Dimensions.get('window').width - 40}
                    height={230}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="80"
                    hasLegend={false}
                />
                <Text className="mt-2 text-gray-600">Total Days: {totalDays}</Text>
            </View>

            {/* FlashList */}
            <FlashList
                data={categories}
                renderItem={({ item, index }) => (
                    <View
                        key={item[0]}
                        className="flex-row justify-between items-center bg-white p-4 mx-5 rounded-lg mb-3 shadow-sm"
                        style={{ borderColor: categoryColors[index], borderWidth: 0.5 }}
                    >
                        
                        <Circle
                            size={50} 
                            progress={item[1] / totalDays} // Progress value (0-1)
                            color={categoryColors[index]} // Progress bar color
                            thickness={2} // Width of the progress line
                            showsText={true} // Show percentage inside
                            formatText={() => `${Math.round((item[1] / totalDays) * 100)}%`} // Display percentage
                        />
                        {/* Category Details */}
                        <View className="flex-1 flex-row justify-around items-center">

                            <Text className="text-xl font-medium text-gray-800">
                                {item[0].replace(/_/g, ' ')}
                            </Text>
                            <Text className="text-xs" style={{ color: categoryColors[index] }}>
                                {item[1]} days
                            </Text>
                        </View>


                    </View>
                )}
                estimatedItemSize={80}
                keyExtractor={(item) => item[0]}
            />
        </View>
    );
}
