import { View, Image, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function Index() {
    return (
        <View className="flex-1">
            <View className='flex-1 border items-center flex-row flex-wrap gap-2 h-[100%]'>
                {/* first */}
                <View className="rounded-lg h-[45%] w-[46%]  border-sky-500 ml-3">
                    <Image
                        source={require("../assets/images/homescreen/zac-gudakov-UPbYh3A5cdg-unsplash.jpg")}
                        resizeMode="cover"
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
                {/* second */}
                <View className="rounded-lg h-[45%] w-[46%] border border-sky-500">
                    <Image
                        source={require("../assets/images/homescreen/zac-gudakov-UPbYh3A5cdg-unsplash.jpg")}
                        resizeMode="cover"
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
                {/* third */}
                <View className="rounded-lg h-[45%] w-[46%] border border-sky-500 ml-3">
                    <Image
                        source={require("../assets/images/homescreen/zac-gudakov-UPbYh3A5cdg-unsplash.jpg")}
                        resizeMode="cover"
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
                {/* fourth */}
                <View className="rounded-lg h-[45%] w-[46%] border border-sky-500">
                    <Image
                        source={require("../assets/images/homescreen/zac-gudakov-UPbYh3A5cdg-unsplash.jpg")}
                        resizeMode="cover"
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>

            </View>
            <View className='flex-1'>
            <View className="items-center justify-center mt-6">
                <TouchableOpacity
                    className="text-center rounded-3xl  px-10 bg-sky-500 ">
                    <Text className="text-center mx-10 my-3 text-lg">Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    );
}
