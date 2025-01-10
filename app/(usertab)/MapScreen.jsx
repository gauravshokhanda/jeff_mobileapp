import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polygon, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getAreaOfPolygon } from 'geolib';
import { useDispatch } from 'react-redux';
import { setPolygonData } from '../../redux/slice/polygonSlice';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  const fetchLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setIsLocationFetched(true);
    } catch (error) {
      Alert.alert('Error', `Unable to fetch location: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (location) {
      setLocation((prevLocation) => ({
        ...prevLocation,
        latitudeDelta: prevLocation.latitudeDelta / 2,
        longitudeDelta: prevLocation.longitudeDelta / 2,
      }));
    }
  };

  const handleZoomOut = () => {
    if (location) {
      setLocation((prevLocation) => ({
        ...prevLocation,
        latitudeDelta: prevLocation.latitudeDelta * 2,
        longitudeDelta: prevLocation.longitudeDelta * 2,
      }));
    }
  };

  const searchLocation = async (locationName) => {
    console.log('Searching for location:', locationName);
    if (!locationName.trim()) {
      Alert.alert('Error', 'Please enter a valid location name.');
      return;
    }
    try {
      const results = await Location.geocodeAsync(locationName);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        Alert.alert('Location Found', `Moved to: ${locationName}`);
        setSearchText(''); // Clear search input
      } else {
        Alert.alert('Not Found', 'No matching location found.');
      }
    } catch (error) {
      Alert.alert('Error', `Unable to fetch location: ${error.message}`);
    }
  };

  const handleMapPress = (event) => {
    if (isDrawing) {
      const newPoint = event.nativeEvent.coordinate;
      setPolygonPoints((prevPoints) => [...prevPoints, newPoint]);
    }
  };

  const handleClearPolygon = () => {
    setPolygonPoints([]);
  };

  const handleCalculateArea = async () => {
    if (polygonPoints.length >= 3) {
      try {
        const area = getAreaOfPolygon(polygonPoints);
        const areaInSquareFeet = (area * 10.7639).toFixed(2);
        console.log("Area in square feet:", areaInSquareFeet);

        const centroid = polygonPoints.reduce(
          (acc, point) => {
            acc.latitude += point.latitude;
            acc.longitude += point.longitude;
            return acc;
          },
          { latitude: 0, longitude: 0 }
        );
        centroid.latitude /= polygonPoints.length;
        centroid.longitude /= polygonPoints.length;

        console.log("Polygon Centroid:", centroid);

        const [locationDetails] = await Location.reverseGeocodeAsync({
          latitude: centroid.latitude,
          longitude: centroid.longitude,
        });

        if (locationDetails) {
          const { city, region, country } = locationDetails;
          console.log("City:", city);
          console.log("Region:", region);
          console.log("Country:", country);

          Alert.alert(
            "Area Details",
            `Area: ${areaInSquareFeet} sq. ft.\nCity: ${city}\nRegion: ${region}\nCountry: ${country}`
          );
        } else {
          console.log("Reverse geocoding returned no results.");
        }

        dispatch(
          setPolygonData({
            coordinates: polygonPoints,
            area: areaInSquareFeet,
            city: locationDetails?.city,
          })
        );

        router.push('/AreaDetailsScreen');
        setPolygonPoints([]);
      } catch (error) {
        console.error("Error calculating area or fetching location details:", error);
        Alert.alert("Error", `Unable to fetch details: ${error.message}`);
      }
    } else {
      Alert.alert("Error", "A polygon requires at least 3 points.");
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setPolygonPoints([]);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Fetching location...</Text>
        </View>
      ) : location ? (
        <View className="flex-1 relative">
          <TouchableOpacity
            className="absolute top-8 z-10 left-2"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="bg-white w-[80%] h-12 absolute top-6 z-10 flex-row left-14 items-center rounded-2xl">
            <TouchableOpacity className="px-3">
              <Ionicons name="search-outline" size={24} color="#172554" />
            </TouchableOpacity>
            <TextInput
              className="text-slate-600 text-xl"
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search for a city"
              onSubmitEditing={() => searchLocation(searchText)}
            />
          </View>

          <MapView
            style={{ flex: 1 }}
            region={location}
            onPress={handleMapPress}
            mapType="satellite"
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
              radius={50}
              fillColor="rgba(0, 100, 255, 0.2)"
              strokeColor="rgba(0, 100, 255, 0.8)"
            />
            <Marker coordinate={location} title="You are here" />
          </MapView>

          <View className="absolute bottom-36 right-4 z-10 flex">
            <TouchableOpacity onPress={handleZoomIn} className="p-3 bg-white mb-2 rounded-full">
              <Ionicons name="add-outline" size={30} color="#172554" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomOut} className="p-3 bg-white rounded-full">
              <Ionicons name="remove-outline" size={30} color="#172554" />
            </TouchableOpacity>
            <TouchableOpacity
    onPress={handleStartDrawing}
    className="p-3 bg-white rounded-full"
  >
    <Ionicons name="create-outline" size={28} color="#0EA5E9" />
  </TouchableOpacity>
  <TouchableOpacity
    onPress={handleClearPolygon}
    className="p-3 bg-white rounded-full"
  >
    <Ionicons name="trash-outline" size={28} color="#0EA5E9" />
  </TouchableOpacity>
  <TouchableOpacity
    onPress={handleCalculateArea}
    className="p-3 bg-white rounded-full"
  >
    <Ionicons name="calculator-outline" size={28} color="#0EA5E9" />
  </TouchableOpacity>
          </View>

        </View>
      ) : (
        <Text className="text-center text-lg mt-20">Click below to fetch your location</Text>
      )}
    </View>
  );
}
