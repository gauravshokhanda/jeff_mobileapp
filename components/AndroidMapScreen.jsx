import React, { useState, useEffect } from 'react';
import {
  View, Text, Alert, TextInput, ActivityIndicator, Platform, TouchableOpacity, Modal, SafeAreaView
} from 'react-native';
import MapView, { Marker, Polygon, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
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
  const [polygonClosed, setPolygonClosed] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [mapType, setMapType] = useState('satellite');
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [areaInSquareFeet, setAreaInSquareFeet] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [customCoverage, setCustomCoverage] = useState('');
  const [floorCount, setFloorCount] = useState('');
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
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015,
      });
    } catch (error) {
      Alert.alert('Error', `Unable to fetch location: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleUndo = () => {
    if (polygonPoints.length > 0) {
      let newPoints = [...polygonPoints];
      newPoints.pop();
 
      // If polygon was closed and we undo it, reopen it
      if (polygonClosed) {
        setPolygonClosed(false);
        setIsDrawing(true);
        setConfirmButtonVisible(false);
      }
 
      setPolygonPoints(newPoints);
 
      // If user undoes the last point, reset states
      if (newPoints.length === 0) {
        setIsDrawing(false);
        setPreviewPoint(null);
        setConfirmButtonVisible(false);
      }
    }
  };
 
 
  const handleMapPress = (event) => {
    if (!isDrawing) return;
    const newPoint = event.nativeEvent.coordinate;
    if (polygonPoints.length >= 3) {
      const firstPoint = polygonPoints[0];
      const isSamePoint = Platform.OS === 'ios'
        ? (Math.abs(newPoint.latitude - firstPoint.latitude) < 0.00001 &&
          Math.abs(newPoint.longitude - firstPoint.longitude) < 0.00001)
        : getDistance(newPoint, firstPoint) < 5;
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
      const areaInSqFt = parseFloat((area * 10.7639).toFixed(2));
      setAreaInSquareFeet(areaInSqFt);
      setShowBuildingModal(true);
    } catch (error) {
      Alert.alert('Error', `Unable to calculate area: ${error.message}`);
    }
  };
 
  const handleSubmitBuildingConfig = async () => {
    const isCustom = selectedOption === 'custom';
    const coverage = isCustom ? parseFloat(customCoverage) : parseFloat(selectedOption);
    const floors = parseInt(floorCount);
    if (isNaN(coverage) || coverage <= 0 || coverage > 95) {
      Alert.alert('Invalid %', 'Please enter a valid percentage (up to 95%)');
      return;
    }
    if (isNaN(floors) || floors < 1) {
      Alert.alert('Invalid Floor Count', 'Please enter a valid number of floors');
      return;
    }
    const buildableArea = parseFloat(((areaInSquareFeet * coverage) / 100).toFixed(2));
    const totalBuiltUp = parseFloat((buildableArea * floors).toFixed(2));
    try {
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
        buildableArea,
        floors,
        totalBuiltUp,
        city: details?.city || '',
        state: details?.region || '',
        postalCode: details?.postalCode?.toString().padStart(5, '0') || ''
      }));
      setPolygonPoints([]);
      setConfirmButtonVisible(false);
      setPolygonClosed(false);
      setShowBuildingModal(false);
      setAreaInSquareFeet(0);
      setSelectedOption('');
      setCustomCoverage('');
      setFloorCount('');
      setIsDrawing(false);
      setPreviewPoint(null);
      router.push('/AreaDetailsScreen');
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
      setLocation({ latitude, longitude, latitudeDelta: 0.0015, longitudeDelta: 0.0015 });
      setSearchText('');
    } else {
      try {
        const results = await Location.geocodeAsync(input);
        if (results.length > 0) {
          const { latitude, longitude } = results[0];
          setLocation({ latitude, longitude, latitudeDelta: 0.0015, longitudeDelta: 0.0015 });
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
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 30, left: 10, backgroundColor: 'white', padding: 8, borderRadius: 20, zIndex: 20 }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
 
      {!isDrawing && (
        <View style={{
          position: 'absolute', top: Platform.OS === 'ios' ? 20 : 20, left: '15%', width: '80%',
          backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 10, height: 45,
          justifyContent: 'center', zIndex: 15, elevation: 5
        }}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => searchLocation(searchText)}
            placeholder="Search location or coordinates"
            placeholderTextColor="gray"
            style={{ fontSize: 16, color: 'black' }}
          />
        </View>
      )}
 
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0E1A2E" />
          <Text>Fetching location...</Text>
        </View>
      ) : location ? (
        <MapView
          style={{ flex: 1 }}
          region={location}
          onPress={handleMapPress}
          onPanDrag={(e) => isDrawing && setPreviewPoint(e.nativeEvent.coordinate)}
          mapType={mapType}
          provider={PROVIDER_GOOGLE}
        >
          {/* Draw small dots for each polygon point */}
          {polygonPoints.map((point, index) => (
            <Circle
              key={`dot-${index}`}
              center={point}
              radius={0.5} // in meters
              fillColor="blue"
              strokeColor="blue"
            />
          ))}
 
          {/* Polyline preview while drawing */}
          {polygonPoints.length > 0 && (
            <Polyline
              coordinates={[...polygonPoints, previewPoint].filter(Boolean)}
              strokeColor="blue"
              strokeWidth={2}
            />
          )}
 
          {/* Final polygon after closure */}
          {polygonClosed && (
            <Polygon
              coordinates={polygonPoints}
              strokeColor="#000"
              fillColor="rgba(0, 200, 0, 0.5)"
              strokeWidth={2}
            />
          )}
 
          {/* Location indicator */}
          <Circle
            center={location}
            radius={50}
            fillColor="rgba(0, 100, 255, 0.2)"
            strokeColor="rgba(0, 100, 255, 0.8)"
          />
 
          {/* You are here marker */}
          <Marker coordinate={location} title="You are here" />
        </MapView>
 
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Click below to fetch your location</Text>
      )}
 
      {confirmButtonVisible && (
        <TouchableOpacity
          onPress={handleConfirmArea}
          style={{
            position: 'absolute', bottom: 80, alignSelf: 'center',
            backgroundColor: 'green', padding: 14, borderRadius: 100
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>✅ Confirm</Text>
        </TouchableOpacity>
      )}
 
      {isDrawing && (
        <TouchableOpacity onPress={handleCancelDrawing} style={{
          position: 'absolute', bottom: 140, alignSelf: 'center',
          backgroundColor: '#9CA3AF', padding: 10, borderRadius: 100
        }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
      )}
 
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        {['add-outline', 'remove-outline', 'layers-outline', 'location-outline', 'create-outline', 'arrow-undo-outline', 'trash-outline']
 
          .map((icon, i) => (
            <TouchableOpacity
              key={icon}
              onPress={[handleZoomIn, handleZoomOut, toggleMapType, handleMyLocation, handleStartDrawing, handleUndo, handleClearPolygon][i]}
              style={buttonStyle}
            >
              <Ionicons
                name={icon}
                size={28}
                color={
                  icon === 'trash-outline'
                    ? '#EF4444'
                    : icon === 'arrow-undo-outline'
                      ? '#f59e0b'
                      : '#0EA5E9'
                }
              />
            </TouchableOpacity>
          ))}
      </View>
 
      {/* Building Modal */}
      <Modal
        visible={showBuildingModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBuildingModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '85%', backgroundColor: 'white', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Building Configuration</Text>
            <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 12 }}>
              Enter the area coverage % and number of floors to calculate buildable area.
            </Text>
            <Text>Total Area: {areaInSquareFeet} sq.ft</Text>
 
            <Text style={{ marginTop: 15, fontWeight: '600' }}>Select Area Coverage (%)</Text>
            {['30', '50', '75', '90', 'custom'].map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedOption(option);
                  if (option !== 'custom') setCustomCoverage('');
                }}
                style={{
                  marginTop: 8,
                  backgroundColor: selectedOption === option ? '#0EA5E9' : '#F3F4F6',
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: selectedOption === option ? 'white' : '#111827', textAlign: 'center' }}>
                  {option === 'custom' ? 'Custom' : `${option}%`}
                </Text>
              </TouchableOpacity>
            ))}
 
            {selectedOption === 'custom' && (
              <TextInput
                placeholder="Enter custom % (max 95)"
                keyboardType="numeric"
                value={customCoverage}
                onChangeText={setCustomCoverage}
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 10, borderRadius: 8 }}
              />
            )}
 
            <Text style={{ marginTop: 15, fontWeight: '600' }}>Number of Floors</Text>
            <TextInput
              placeholder="Enter number of floors"
              keyboardType="numeric"
              value={floorCount}
              onChangeText={setFloorCount}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 8, borderRadius: 8 }}
            />
 
            <TouchableOpacity
              onPress={handleSubmitBuildingConfig}
              style={{ backgroundColor: '#0A6E6E', padding: 12, borderRadius: 8, marginTop: 20 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
 
const buttonStyle = {
  backgroundColor: 'white',
  padding: 10,
  marginVertical: 5,
  borderRadius: 50,
  alignItems: 'center',
};