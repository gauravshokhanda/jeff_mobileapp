import { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function PropertyDetails() {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [selectedPropertyType, setSelectedPropertyType] = useState('detail');

  const propertyTypes = [
    { id: 'detail', label: 'Detail' },
    { id: 'gallery', label: 'Gallery' },
  ];

  const renderPropertyTypeItem = ({ item }) => {
    const isSelected = selectedPropertyType === item.id;
    return (
      <TouchableOpacity
        className={`px-8 py-2 flex-row items-center justify-center border-b-2 ${isSelected ? "border-sky-900" : "border-gray-300"}`}
        onPress={() => setSelectedPropertyType(item.id)}
      >
        <Text className={`text-lg font-medium ${isSelected ? "text-sky-900" : "text-gray-400"}`}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const propertyDetails = [
    { label: "City", value: "Adjuntas" },
    { label: "Address", value: "Kharak Sachiveaalya F block" },
    { label: "Available from", value: "25/02/06" },
    { label: "Property Type", value: "Single Family" },
    { label: "Building Type", value: "Apartment" },
    { label: "Area", value: "477sqft" },
    { label: "Locality", value: "bijnor" },
  ];

  const renderDetailsItems = ({ item }) => (
    <View className="flex-row mb-2">
      <Text className="font-semibold w-32">{item.label}:</Text>
      <Text className="text-gray-700">{item.value || "-"}</Text>
    </View>
  );

  const [mainImage, setMainImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCf5FTK5UEZ2gfGA5Yyn30lpa6RdfwIjKoxQ&s");
  const designImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZ5jI-Fa5ojebuQo08sYifb8QH1zP0MPoIc70VmE8Mh8e-4zqKnhNePwiZAVXMUo32Ms&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBoiOlNizLXLvvt_yRoF8NJCxyhDBQaHab9yI3iVJeQ530uYYy0HwVFpeNd6_ILZ85ztw&usqp=CAU",
    "https://ssl.cdn-redfin.com/photo/1/mbphotov2/044/genMid.2308044_0.jpg",
    "https://photos.zillowstatic.com/fp/e47534bc683f185c9f002f2e19dbcc7d-p_c.jpg"
  ];

  const property = {
    total_cost: 500000,
    number_of_days: 120,
    area: 2000,
    city: "New Delhi",
    project_type: "Residential",
    description: "A beautiful 3BHK apartment in the heart of the city with modern amenities.",
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <View className="relative">
          <Image source={{ uri: mainImage }} className="w-full h-60 rounded-lg" />
        </View>

        <ScrollView horizontal className="mt-4 p-2 bg-white rounded-lg mx-2"
          style={{
            elevation: 15,
            shadowColor: "#374151",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}
        >
          {designImages.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => setMainImage(img)}>
              <Image source={{ uri: img }} className="mr-2 rounded-lg"
                style={{ height: screenHeight * 0.1, width: screenWidth * 0.25 }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="mt-4 p-4 bg-white rounded-lg mx-2">
        <FlatList
          data={propertyTypes}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderPropertyTypeItem}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </View>

      <View className="flex-1 p-4">
        {selectedPropertyType === 'detail' ? (
          <View>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold mb-2">Property Details:</Text>
              <TouchableOpacity className="bg-blue-900 px-2 py-1 rounded-md flex-row items-center">
                <Text className="text-white text-lg font-semibold">⏳ Fully Furnished</Text>
              </TouchableOpacity>
            </View>

            {/* Property Details List */}
            <FlatList
              data={propertyDetails}
              keyExtractor={(item) => item.label}
              renderItem={renderDetailsItems}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          </View>
        ) : (
          <View>
            <Text className="text-xl font-bold mb-3">Gallery ({designImages.length})</Text>
            <FlatList
              data={designImages}
              keyExtractor={(item, index) => index.toString()}
              numColumns={selectedPropertyType === 'gallery' ? 2 : 1}
              key={selectedPropertyType}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }}
                  className="w-[48%] rounded-lg"
                  style={{ height: 150, marginBottom: 10 }} />
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
