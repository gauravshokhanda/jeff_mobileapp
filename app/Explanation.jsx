import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const steps = [
  {
    id: '1',
    title: 'Step 1: Open the Map',
    description: 'Tap "Search Using Map" to access the interactive map interface.',
    image: 'https://t3.ftcdn.net/jpg/02/78/13/10/360_F_278131005_A6Lkawbd9VypXl0vfV5gvibRy3Cjowio.jpg',
  },
  {
    id: '2',
    title: 'Step 2: Mark Your Property',
    description:
      'Locate your property, select the draw tool, and outline your land by connecting the starting and ending points.',
    image: 'https://housing.com/news/wp-content/uploads/2023/04/Flight-of-stairs-Types-and-calculation-of-the-number-of-steps-f.jpg',
  },
  {
    id: '3',
    title: 'Step 3: Confirm Shape',
    description: 'Review your marked area and press "Confirm" to finalize the shape.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK5mv2uk8HjiuZgrKTwBS1Qilzu7EcBo40Lw&s',
  },
  {
    id: '4',
    title: 'Step 4: Calculate Costs',
    description:
      'View the calculated area in sq.ft. and tap "Calculate Cost" for cost and time estimates.',
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/004/243/767/small/blue-block-stack-as-stair-step-on-blue-background-success-climbing-to-the-top-progression-business-growth-concept-3d-render-illustration-free-photo.jpg',
  },
];

export default function Explanation() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderStep = ({ item, index }) => {
    const isEven = index % 2 === 0;
    return (
      <Animated.View
        style={{ opacity: fadeAnim }}
        className={`flex-col md:flex-row ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        } items-center mb-8 mx-2 rounded-3xl bg-white shadow-md overflow-hidden`}
      >
        <Image
          source={{ uri: item.image }}
          className="w-full md:w-[40%] h-52 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl"
          resizeMode="cover"
        />
        <View
          className="p-6 w-full md:w-[60%] bg-gradient-to-r from-sky-900 to-sky-700"
        >
          <Text className="text-2xl font-bold text-black mb-3">
            {item.title}
          </Text>
          <Text className="text-base text-gray-700 leading-relaxed">
            {item.description}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="bg-gray-50 flex-1 px-4 pt-8">
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text className="text-4xl font-extrabold text-sky-950 mb-8 text-center">
          How to Map Your Land
        </Text>
      </Animated.View>

      <FlatList
        data={steps}
        keyExtractor={(item) => item.id}
        renderItem={renderStep}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

    <View className="w-full items-end px-6 pt-4 pb-8 bg-gray-50">
  <TouchableOpacity
    onPress={() => router.replace('/(usertab)')}
    className="bg-sky-950 px-8 py-4 rounded-full shadow-lg"
    activeOpacity={0.7}
  >
    <Text className="text-white text-lg font-semibold">Get Started</Text>
  </TouchableOpacity>
</View>
    </SafeAreaView>
  );
}