import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, Polygon, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getAreaOfPolygon, getDistance } from 'geolib';
import { useDispatch } from 'react-redux';
import { setPolygonData } from '../../redux/slice/polygonSlice';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [mapType, setMapType] = useState('satellite');
  const dispatch = useDispatch();

  const fetchLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Error', `Unable to fetch location: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = (event) => {
    if (!isDrawing) return;
    const newPoint = event.nativeEvent.coordinate;

    if (polygonPoints.length >= 3) {
      const distance = getDistance(newPoint, polygonPoints[0]); // Check distance from first point
      if (distance <= 30) { // within 30 meters?
        handleClosePolygon();
        return;
      }
    }

    setPolygonPoints([...polygonPoints, newPoint]);
  };

  const handleClosePolygon = async () => {
    if (polygonPoints.length >= 3) {
      setIsDrawing(false);
      await handleCalculateArea();
    } else {
      Alert.alert('Error', 'A polygon requires at least 3 points.');
    }
  };

  const handleCalculateArea = async () => {
    try {
      const area = getAreaOfPolygon(polygonPoints);
      const areaInSquareFeet = (area * 10.7639).toFixed(2);

      const centroid = polygonPoints.reduce((acc, p) => {
        acc.latitude += p.latitude;
        acc.longitude += p.longitude;
        return acc;
      }, { latitude: 0, longitude: 0 });

      centroid.latitude /= polygonPoints.length;
      centroid.longitude /= polygonPoints.length;

      const [details] = await Location.reverseGeocodeAsync(centroid);

      dispatch(setPolygonData({
        coordinates: polygonPoints,
        area: areaInSquareFeet,
        city: details?.city || '',
        state: details?.region || '',
        postalCode: details?.postalCode?.toString().padStart(5, '0') || ''
      }));

      router.push('/AreaDetailsScreen');
      setPolygonPoints([]);
    } catch (error) {
      Alert.alert('Error', `Unable to fetch details: ${error.message}`);
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setPolygonPoints([]);
    setPreviewPoint(null);
  };

  const handleClearPolygon = () => {
    setPolygonPoints([]);
    setPreviewPoint(null);
  };

  const handleMyLocation = () => {
    fetchLocation();
  };

  const handleZoomIn = () => {
    if (location) {
      setLocation((prev) => ({
        ...prev,
        latitudeDelta: prev.latitudeDelta / 2,
        longitudeDelta: prev.longitudeDelta / 2,
      }));
    }
  };

  const handleZoomOut = () => {
    if (location) {
      setLocation((prev) => ({
        ...prev,
        latitudeDelta: prev.latitudeDelta * 2,
        longitudeDelta: prev.longitudeDelta * 2,
      }));
    }
  };

  const toggleMapType = () => {
    setMapType((prev) =>
      prev === 'satellite' ? 'standard' : prev === 'standard' ? 'hybrid' : 'satellite'
    );
  };

  const onPanDrag = (e) => {
    if (isDrawing) {
      setPreviewPoint(e.nativeEvent.coordinate);
    }
  };

  const searchLocation = async (input) => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter a valid location name or coordinates.');
      return;
    }

    const coordinatePattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (coordinatePattern.test(input)) {
      const [latitude, longitude] = input.split(',').map(Number);
      try {
        const results = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (results.length > 0) {
          setLocation({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setSearchText('');
        } else {
          Alert.alert('Not Found', 'No matching location found.');
        }
      } catch (error) {
        Alert.alert('Error', `Unable to fetch location: ${error.message}`);
      }
    } else {
      try {
        const results = await Location.geocodeAsync(input);
        if (results.length > 0) {
          const { latitude, longitude } = results[0];
          setLocation({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setSearchText('');
        } else {
          Alert.alert('Not Found', 'No matching location found.');
        }
      } catch (error) {
        Alert.alert('Error', `Unable to fetch location: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View className={`flex-1 ${Platform.OS === 'ios' ? 'mt-16' : ''}`}>
      {isDrawing && (
        <View className="absolute top-0 w-full bg-yellow-100 py-2 z-10 flex-row justify-center">
          <Text className="text-yellow-900 text-base font-medium">
            Drawing Mode: Tap points on map. Tap first point to close.
          </Text>
        </View>
      )}

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0E1A2E" />
          <Text>Fetching location...</Text>
        </View>
      ) : location ? (
        <View className="flex-1 relative">
          <TouchableOpacity
            className="absolute top-7 left-2 z-10"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" className="bg-white p-2 rounded-full" />
          </TouchableOpacity>

          {!isDrawing && (
            <View className="bg-white w-[80%] h-12 absolute top-6 z-10 flex-row-reverse left-14 rounded-2xl items-center px-3">
              <TextInput
                className="flex-1 text-slate-600 text-base px-2"
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search location name or coordinates"
                placeholderTextColor="gray"
                onSubmitEditing={() => searchLocation(searchText)}
              />
            </View>
          )}

          <MapView
            style={{ flex: 1 }}
            region={location}
            onPress={handleMapPress}
            onPanDrag={onPanDrag}
            mapType={mapType}
            provider={PROVIDER_GOOGLE}
          >
            {polygonPoints.length > 0 && (
              <>
                <Polyline
                  coordinates={[...polygonPoints, previewPoint].filter(Boolean)}
                  strokeColor="blue"
                  strokeWidth={2}
                />
                {polygonPoints.length >= 3 && (
                  <Polygon
                    coordinates={polygonPoints}
                    strokeColor="#000"
                    fillColor="rgba(0, 200, 0, 0.5)"
                    strokeWidth={2}
                  />
                )}
              </>
            )}
            <Circle
              center={location}
              radius={50}
              fillColor="rgba(0, 100, 255, 0.2)"
              strokeColor="rgba(0, 100, 255, 0.8)"
            />
            <Marker coordinate={location} title="You are here" />
          </MapView>

          <View className="absolute bottom-80 right-4 z-10 flex">
            <TouchableOpacity onPress={toggleMapType} className="p-3 bg-white mb-2 rounded-full">
              <Ionicons name="layers-outline" size={30} color="#172554" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomIn} className="p-3 bg-white mb-2 rounded-full">
              <Ionicons name="add-outline" size={30} color="#172554" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomOut} className="p-3 bg-white rounded-full">
              <Ionicons name="remove-outline" size={30} color="#172554" />
            </TouchableOpacity>
          </View>

          <View className="absolute right-4 bottom-5 z-10 flex">
            <TouchableOpacity onPress={handleMyLocation} className="p-3 bg-white rounded-full my-2">
              <Ionicons name="location-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStartDrawing} className="p-3 bg-white rounded-full my-2">
              <Ionicons name="create-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearPolygon} className="p-3 bg-white rounded-full my-2">
              <Ionicons name="trash-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text className="text-center text-lg mt-20">Click below to fetch your location</Text>
      )}
    </View>
  );
}
