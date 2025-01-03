import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker, Polygon, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { getAreaOfPolygon } from 'geolib';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLocationFetched, setIsLocationFetched] = useState(false);

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
          setIsLocationFetched(true);
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', `Unable to fetch location: ${error.message}`);
    }
  };

  const handleMapPress = (event) => {
    if (isDrawing) {
      const newPoint = event.nativeEvent.coordinate;
      setPolygonPoints((prevPoints) => [...prevPoints, newPoint]);
    }
  };

  const toggleDrawingModeOrCalculate = () => {
    if (isDrawing && polygonPoints.length >= 3) {
      // Calculate the area
      const area = getAreaOfPolygon(polygonPoints);
      const areaInSquareKm = (area / 1e6).toFixed(2);
      Alert.alert('Polygon Area', `The area of the selected polygon is ${areaInSquareKm} km²`);
      setIsDrawing(false); // End drawing mode after calculating area
    } else {
      // Toggle drawing mode
      setIsDrawing(!isDrawing);
      if (!isDrawing) {
        setPolygonPoints([]);
      }
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
        <MapView
          style={{ flex: 1 }}
          className="flex-1"
          region={location}
          onPress={handleMapPress}
        >
          {polygonPoints.length > 0 && (
            <Polygon
              coordinates={polygonPoints}
              strokeColor="#000"
              fillColor="rgba(0, 200, 0, 0.5)"
              strokeWidth={2}
            />
          )}
          <Circle
            center={location}
            radius={100}
            fillColor="rgba(0, 100, 255, 0.2)"
            strokeColor="rgba(0, 100, 255, 0.8)"
          />
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

      {isLocationFetched && (
        <TouchableOpacity
          onPress={toggleDrawingModeOrCalculate}
          className="bg-green-500 py-3 mx-5 my-2 rounded-lg"
        >
          <Text className="text-white text-center text-lg font-bold">
            {isDrawing && polygonPoints.length >= 3 ? 'Calculate' : 'Select Area'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
