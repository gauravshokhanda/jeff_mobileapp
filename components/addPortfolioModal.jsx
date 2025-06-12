import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { FlashList } from '@shopify/flash-list';
import debounce from 'lodash.debounce';
import { useSelector } from "react-redux";
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function AddPortfolioModal({ visible, onClose, setPortfolioData, addPortfolioItem }) {
  const [projectName, setProjectName] = useState('');
  const [cityName, setCityName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!visible) {
      setProjectName('');
      setCityName('');
      setAddress('');
      setDescription('');
      setSelectedImages([]);
    }
  }, [visible]);

  const handleCitySearch = useCallback(
    debounce(async (query, currentPage = 1) => {
      if (!query) return;
      setSearchLoading(true);

      try {
        const response = await axios.post(
          `https://g32.iamdeveloper.in/api/citie-search?page=${currentPage}`,
          { city: query },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const cityData = response.data.data.map((city) => ({
          key: city.id.toString(),
          label: city.city,
          zip: city.pincode,
        }));

        if (currentPage === 1) {
          setCities(cityData);
        } else {
          setCities((prevCities) => [...prevCities, ...cityData]);
        }

        setHasMoreCities(currentPage < response.data.pagination.last_page);
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'An unknown error occurred.');
      } finally {
        setSearchLoading(false);
        setLoadingMore(false);
      }
    }, 500),
    [token]
  );

  const loadMoreCities = () => {
    if (!hasMoreCities || loadingMore) return;
    setLoadingMore(true);
    setPage((prevPage) => {
      handleCitySearch(cityName, prevPage + 1);
      return prevPage + 1;
    });
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      try {
        const compressedImages = await Promise.all(
          result.assets.map(async (asset) => {
            const compressed = await ImageManipulator.manipulateAsync(
              asset.uri,
              [{ resize: { width: 800 } }],
              { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            return compressed.uri;
          })
        );
        setSelectedImages((prev) => [...prev, ...compressedImages]);
      } catch (error) {
        Alert.alert('Error', 'Failed to process selected images.');
      }
    }
  };

  const handleUpload = () => {
    const newData = {
      projectName,
      cityName,
      address,
      description,
      selectedImages,
    };
    addPortfolioItem(newData);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: screenWidth * 0.9,
          maxHeight: screenHeight * 0.9,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          position: 'relative',
        }}>
          {/* Close Icon */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              padding: 4,
              backgroundColor: '#fff',
              borderRadius: 16,
              elevation: 2,
            }}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          {/* Scrollable Content */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 40 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 }}>Upload Portfolio</Text>

            <Text>Project Name</Text>
            <TextInput
              placeholder="Enter Project Name"
              placeholderTextColor="gray"
              value={projectName}
              onChangeText={setProjectName}
              style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text>City Name</Text>
            <TextInput
              placeholder="Enter City Name"
              placeholderTextColor="gray"
              value={cityName}
              onChangeText={(text) => {
                setCityName(text);
                setPage(1);
                handleCitySearch(text, 1);
              }}
              style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10 }}
            />

            {searchLoading && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 5 }} />}

            {cities.length > 0 && (
              <View style={{ height: 160, marginTop: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}>
                <FlashList
                  data={cities}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setCityName(item.label);
                        setCities([]);
                      }}
                      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  estimatedItemSize={50}
                  ListFooterComponent={
                    hasMoreCities && (
                      <TouchableOpacity onPress={loadMoreCities} style={{ padding: 10, backgroundColor: '#0A6E6E', borderRadius: 10, margin: 10 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Load More</Text>
                      </TouchableOpacity>
                    )
                  }
                />
              </View>
            )}

            <Text style={{ marginTop: 16 }}>Address</Text>
            <TextInput
              placeholder="Enter Address"
              placeholderTextColor="gray"
              value={address}
              onChangeText={setAddress}
              style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text>Description</Text>
            <TextInput
              placeholder="Enter Description"
              placeholderTextColor="gray"
              value={description}
              onChangeText={setDescription}
              style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text>Add Images</Text>
            <TouchableOpacity
              onPress={pickImages}
              style={{ backgroundColor: '#eee', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12 }}
            >
              <Text>Select Images</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row' }}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={{ alignItems: 'center', marginRight: 10 }}>
                    <Image
                      source={{ uri }}
                      style={{ width: 80, height: 80, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleUpload}
              style={{ backgroundColor: '#052f4a', padding: 14, borderRadius: 12, marginTop: 20 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Upload</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
