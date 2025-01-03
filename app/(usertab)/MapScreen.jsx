import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);

  const fetchLocation = async () => {
    try {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }


      if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }


      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', `Unable to fetch location: ${error.message}`);
    }
  };


  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  return (
    <View className="flex-1">
      <TouchableOpacity
        className="absolute top-6 z-10 left-5"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {location ? (
        <MapView style={{ flex: 1 }} className="flex-1" region={location}>
          <Marker coordinate={location} title="You are here" />
        </MapView>
      ) : (
        <Text className="text-center text-lg mt-20">Click below to fetch your location</Text>
      )}
      <TouchableOpacity
        onPress={fetchLocation}
        className="bg-blue-500 py-3 mx-5 my-5 rounded-lg"
      >
        <Text className="text-white text-center text-lg font-bold">
          Fetch My Location
        </Text>
      </TouchableOpacity>
    </View>
  );
}
