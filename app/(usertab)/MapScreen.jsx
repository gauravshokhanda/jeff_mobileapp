import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
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
    setPolygonPoints([...polygonPoints, newPoint]);
  };

  const handleFirstMarkerPress = () => {
    if (polygonPoints.length >= 3) {
      setPolygonClosed(true);
      setIsDrawing(false);
      setConfirmButtonVisible(true);
    } else {
      Alert.alert('Error', 'A polygon requires at least 3 points.');
    }
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

  const handleStopDrawing = () => {
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
    <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0E1A2E" />
          <Text>Fetching location...</Text>
        </View>
      ) : location ? (
        <View style={{ flex: 1 }}>
          {/* Map */}
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
                {polygonClosed && (
                  <Polygon
                    coordinates={polygonPoints}
                    strokeColor="#000"
                    fillColor="rgba(0, 200, 0, 0.5)"
                    strokeWidth={1}
                  />
                )}
                {isDrawing && polygonPoints.length >= 1 && (
                  <Marker
                    coordinate={polygonPoints[0]}
                    anchor={{ x: 0.5, y: 0.5 }}
                    onPress={handleFirstMarkerPress} // 🛠 Close only when first marker tapped
                  >
                    <View style={{
                      height: 14,
                      width: 14,
                      borderRadius: 7,
                      backgroundColor: 'blue',
                      borderWidth: 2,
                      borderColor: 'white',
                    }} />
                  </Marker>
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

          {/* Floating Confirm Button */}
          {confirmButtonVisible && (
            <TouchableOpacity
              onPress={handleConfirmArea}
              style={{ position: 'absolute', bottom: 80, alignSelf: 'center', backgroundColor: 'green', padding: 14, borderRadius: 100 }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>✅ Confirm</Text>
            </TouchableOpacity>
          )}

          {/* Controls */}
          <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <TouchableOpacity onPress={handleMyLocation} style={buttonStyle}>
              <Ionicons name="location-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomIn} style={buttonStyle}>
              <Ionicons name="add-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomOut} style={buttonStyle}>
              <Ionicons name="remove-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStartDrawing} style={buttonStyle}>
              <Ionicons name="create-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearPolygon} style={buttonStyle}>
              <Ionicons name="trash-outline" size={28} color="#0EA5E9" />
            </TouchableOpacity>
            {isDrawing && (
              <TouchableOpacity onPress={handleStopDrawing} style={buttonStyle}>
                <Ionicons name="close-outline" size={28} color="#EF4444" />
              </TouchableOpacity>
            )}
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

