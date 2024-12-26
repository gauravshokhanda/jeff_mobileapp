import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';

export default function MapScreen() {
  const [location, setLocation] = useState(null);

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch location');
    }
  };

  return (
    <View className="flex-1">
      {location ? (
        <MapView
          style={{ flex: 1 }}
          className="flex-1"
          region={location}
        >
          <Marker coordinate={location} title="You are here" />
        </MapView>
      ) : (
        <Text className="text-center text-lg mt-20">Click below to fetch your location</Text>
      )}
      <TouchableOpacity
        onPress={fetchLocation}
        className="bg-blue-500 py-3 mx-5 mb-5 rounded-lg"
      >
        <Text className="text-white text-center text-lg font-bold">
          Fetch My Location
        </Text>
      </TouchableOpacity>
    </View>
  );
}
