import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

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
        <View style={styles.task}>
            <Text style={styles.taskName}>{item.name}</Text>
            <View style={styles.progressContainer}>
                {/* Custom Progress Bar */}
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${item.percentage}%` }, // Dynamically adjust width based on percentage
                        ]}
                    />
                </View>
                <Text style={styles.taskDetails}>{`${item.days} Days (${item.percentage}%)`}</Text>
            </View>
        </View>
    );

    const renderCategory = ({ item }) => (
        <View style={styles.category}>
            <Text style={styles.categoryTitle}>{item.category}</Text>
            {item.tasks.map((task) => renderTask({ item: task }))}
        </View>
    );

    return (
        <FlashList
            data={data}
            renderItem={renderCategory}
            estimatedItemSize={200} // Estimated height for each item
            ListHeaderComponent={() => (
                <View>
                    <Text style={styles.header}>Construction Schedule</Text>
                    <Text style={styles.subHeader}>
                        Total Duration: 142 Days (28.4 Weeks / 6.55 Months)
                    </Text>
                </View>
            )}
            contentContainerStyle={styles.container}
            keyExtractor={(item) => item.category}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f4f4f4",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    category: {
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    task: {
        marginBottom: 8,
    },
    taskName: {
        fontSize: 16,
        color: "#333",
    },
    progressContainer: {
        marginTop: 4,
    },
    progressBarBackground: {
        height: 10,
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3498db',
    },
    taskDetails: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
});
