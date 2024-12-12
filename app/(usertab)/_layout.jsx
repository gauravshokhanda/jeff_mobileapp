import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
// import '../../global.css';

export default function TabRoot() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#082f49',
                height: 77,
                paddingTop: 10
            }
        }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: "Home", tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} color={'white'} size={30} />
                    ),
                    tabBarLabelStyle: {
                        display: 'none'
                    },
                }}
            />
            <Tabs.Screen
                name='Dashboard'
                options={{
                    title: "Dashboard", tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'grid' : 'grid-outline'} size={30} color={'white'} />

                    ),
                    tabBarLabelStyle: {
                        display: 'none', // Hides the label text
                    },
                }} />

            <Tabs.Screen
                name='User'
                options={{
                    title: "User", tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={30} color={'white'} />
                    ),
                    tabBarLabelStyle: {
                        display: 'none'
                    }
                }} />
            <Tabs.Screen
                name='Menu'
                options={{
                    title: "Menu", tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'menu' : 'menu-outline'} size={30} color={'white'} />
                    ), tabBarLabelStyle: {
                        display: 'none'
                    }
                }} />

        </Tabs>
    )
}