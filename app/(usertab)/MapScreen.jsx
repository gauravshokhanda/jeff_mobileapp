import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getAreaOfPolygon } from 'geolib';
import { useDispatch } from 'react-redux';
import { setPolygonData } from '../../redux/slice/polygonSlice';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [polygonClosed, setPolygonClosed] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(false);
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
      const firstPoint = polygonPoints[0];
      const epsilon = 0.000009;
      const isSamePoint =
        Math.abs(newPoint.latitude - firstPoint.latitude) < epsilon &&
        Math.abs(newPoint.longitude - firstPoint.longitude) < epsilon;
      if (isSamePoint) {
        setPolygonClosed(true);
        setIsDrawing(false);
        setConfirmButtonVisible(true);
        return;
      }
    }
    setPolygonPoints([...polygonPoints, newPoint]);
  };

  const handleConfirmArea = async () => {
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
      setPolygonClosed(false);
      setConfirmButtonVisible(false);
    } catch (error) {
      Alert.alert('Error', `Unable to fetch details: ${error.message}`);
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setPolygonPoints([]);
    setPreviewPoint(null);
    setPolygonClosed(false);
    setConfirmButtonVisible(false);
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setPolygonPoints([]);
    setPreviewPoint(null);
    setPolygonClosed(false);
    setConfirmButtonVisible(false);
  };

  const handleClearPolygon = () => {
    setPolygonPoints([]);
    setPreviewPoint(null);
    setPolygonClosed(false);
    setConfirmButtonVisible(false);
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

  const handleMyLocation = () => {
    fetchLocation();
  };

  const toggleMapType = () => {
    setMapType((prev) => prev === 'satellite' ? 'standard' : prev === 'standard' ? 'hybrid' : 'satellite');
  };

  const searchLocation = async (input) => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter a valid location name or coordinates.');
      return;
    }
    const coordinatePattern = /^-?\d+(\.\d+)?,?-?\d+(\.\d+)?$/;
    if (coordinatePattern.test(input)) {
      const [latitude, longitude] = input.split(',').map(Number);
      setLocation({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      setSearchText('');
    } else {
      try {
        const results = await Location.geocodeAsync(input);
        if (results.length > 0) {
          const { latitude, longitude } = results[0];
          setLocation({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
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
    <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
      {isDrawing && (
        <View style={{ position: 'absolute', top: 0, width: '100%', backgroundColor: '#FEF3C7', padding: 8, zIndex: 10 }}>
          <Text style={{ textAlign: 'center', color: '#92400E', fontWeight: 'bold' }}>
            Drawing Mode: Tap points ➔ Tap first point to close
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0E1A2E" />
          <Text>Fetching location...</Text>
        </View>
      ) : location ? (
        <View style={{ flex: 1 }}>

          <TouchableOpacity style={{ position: 'absolute', top: 30, left: 10, backgroundColor: 'white', padding: 8, borderRadius: 20, zIndex: 20 }} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          {!isDrawing && (
            <View style={{ backgroundColor: 'white', width: '80%', height: 48, position: 'absolute', top: 30, left: '18%', borderRadius: 20, zIndex: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={() => searchLocation(searchText)}
                placeholder="Search location or coordinates"
                placeholderTextColor="gray"
                style={{ flex: 1, color: 'black' }}
              />
            </View>
          )}

          {isDrawing && (
            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 30, backgroundColor: '#DC2626', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, zIndex: 20 }} onPress={handleCancelDrawing}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel Drawing</Text>
            </TouchableOpacity>
          )}

          <MapView
            style={{ flex: 1 }}
            region={location}
            onPress={handleMapPress}
            onPanDrag={(e) => isDrawing && setPreviewPoint(e.nativeEvent.coordinate)}
            mapType={mapType}
            provider={PROVIDER_GOOGLE}
          >
            {polygonPoints.length > 0 && (
              <>
                <Polyline coordinates={[...polygonPoints, previewPoint].filter(Boolean)} strokeColor="blue" strokeWidth={2} />
                {polygonClosed && (
                  <Polygon coordinates={polygonPoints} strokeColor="#000" fillColor="rgba(0, 200, 0, 0.5)" strokeWidth={2} />
                )}
              </>
            )}
            <Circle center={location} radius={50} fillColor="rgba(0, 100, 255, 0.2)" strokeColor="rgba(0, 100, 255, 0.8)" />
            <Marker coordinate={location} title="You are here" />
          </MapView>

          {confirmButtonVisible && (
            <TouchableOpacity onPress={handleConfirmArea} style={{ position: 'absolute', bottom: 80, alignSelf: 'center', backgroundColor: 'green', padding: 14, borderRadius: 100 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>✅ Confirm</Text>
            </TouchableOpacity>
          )}

          <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <TouchableOpacity onPress={handleZoomIn} style={buttonStyle}>
              <Ionicons name="add-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomOut} style={buttonStyle}>
              <Ionicons name="remove-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMapType} style={buttonStyle}>
              <Ionicons name="layers-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMyLocation} style={buttonStyle}>
              <Ionicons name="location-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStartDrawing} style={buttonStyle}>
              <Ionicons name="create-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearPolygon} style={buttonStyle}>
              <Ionicons name="trash-outline" size={28} color="#EF4444" />
            </TouchableOpacity>
          </View>

        </View>
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Click below to fetch your location</Text>
      )}
    </View>
  );
}

const buttonStyle = {
  backgroundColor: 'white',
  padding: 10,
  marginVertical: 5,
  borderRadius: 50,
  alignItems: 'center',
};
