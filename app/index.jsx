import { View, Image, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
    const navigation = useNavigation();
    return (
        <View className="flex-1 items-center bg-white">
            <View className='items-center'>
                <Image

                    source={require('../assets/images/homescreen/homeImage.png')}
                />
            </View>

            <View className=" h-[20%] justify-between items-center">
                <Image
                    className=''
                    source={require('../assets/images/homescreen/homeLogo.jpg')} />
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}
                    className="text-center rounded-3xl px-10 bg-customBlue"
                >
                    <Text className="font-semibold text-center mx-10 my-3 text-lg text-white">
                        Get Started
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}
