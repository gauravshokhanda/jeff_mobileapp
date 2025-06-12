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
  Platform,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FlashList } from '@shopify/flash-list';
import debounce from 'lodash.debounce';
import API from '../config/apiConfig';
import { useSelector } from "react-redux";
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ContractorPortfolioModal({ visible, onClose, setPortfolioData, addPortfolioItem }) {
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const images = result.assets.map((image) => ({
        uri: image.uri,
        id: `${Date.now()}-${Math.random()}`,
      }));

      setSelectedImages((prev) => [...prev, ...images]);
    }
  };

  const handleUpload = () => {
    const newData = {
      projectName,
      cityName,
      address,
      description,
      selectedImages: selectedImages.map(img => img.uri),
    };
    addPortfolioItem(newData);
    onClose();
  };

  const handleRemoveImage = (id) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 16,
            width: screenWidth * 0.9,
            maxHeight: screenHeight * 0.9,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12, marginTop: 10 }}>
              Upload Portfolio
            </Text>

            <Text style={{ marginBottom: 6 }}>Project Name</Text>
            <TextInput
              placeholder="Enter Project Name"
              placeholderTextColor="gray"
              value={projectName}
              onChangeText={setProjectName}
              style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text style={{ marginBottom: 6 }}>City Name</Text>
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

            <Text style={{ marginTop: 16, marginBottom: 6 }}>Address</Text>
            <TextInput
              placeholder="Enter Address"
              placeholderTextColor="gray"
              value={address}
              onChangeText={setAddress}
              style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text style={{ marginBottom: 6 }}>Description</Text>
            <TextInput
              placeholder="Enter Description"
              placeholderTextColor="gray"
              value={description}
              onChangeText={setDescription}
              style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text style={{ marginBottom: 6 }}>Add Images</Text>
            <TouchableOpacity
              onPress={pickImages}
              style={{ backgroundColor: '#eee', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12 }}
            >
              <Text>Select Images</Text>
            </TouchableOpacity>

            <ScrollView horizontal>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {selectedImages.map((img, index) => (
                  <View key={img.id || index} style={{ position: 'relative', marginRight: 8 }}>
                    <Image source={{ uri: img.uri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(img.id)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: 'red',
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 12 }}>X</Text>
                    </TouchableOpacity>
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
