import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const featuredImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLbTGWnADS-iYHrvrCjM5BmmJ4RIDr_mx0Xg&s",
  "https://hips.hearstapps.com/hmg-prod/images/west-virginia-gray-cottage-64dd6bb056057.jpg?crop=0.943xw:0.817xh;0.0224xw,0.0932xh&resize=980:*",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3SIpT7hb926rQB-DdtdK7Bux2wdiP0E-3jQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK4JT2eQPj74PG1l7FkEQG45IZtZvAHytFqjgYqwhyW0nAQGDYWK07n9OtzFhucfn61xc&usqp=CAU",
];

const ProfileCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4-8i8ejrhTnFN_U8bXBp9ScKOCBC8RgXznw&s",
      name: "Luxury Apartment",
      description: "A high-end apartment project with modern architecture.",
      year: "2023",
    },
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROgXiFhkkB5TvwexXNLwtynFxkSk7H0sAD2A&s",
      name: "Skyline Towers",
      description: "A commercial skyscraper with innovative design.",
      year: "2022",
    },
  ]);



  return (
    <ScrollView className="bg-white p-4 shadow-lg rounded-lg">
      {/* Background Image with Overlay */}
      <View className="mt-5 relative w-full h-52">
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSswljNNKdxbQZIBtYopmLIsKPIs5NTUOksHQ&s",
          }}
          className="w-full h-full rounded-lg"
        />
        <Text className="absolute bottom-4 right-4 text-black font-bold text-lg">
          SkyTeam Constructions
        </Text>
        {/* Circular Profile Image */}
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoq0f1tSU2b8opZaApGh5tl2FreFb52dyo6Q&s",
          }}
          className="absolute -bottom-9 left-4 w-28 h-28 rounded-full border-2 border-white"
        />
      </View>

      {/* Info Section */}
      <View className="mt-16 p-4 w-full gap-3 bg-gray-100 rounded-lg">
        <Text className="text-xl font-semibold tracking-widest">
          Name - SkyTeam
        </Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">
          Company Name - SkyTeam Constructions
        </Text>
        <Text className="text-xl font-semibold mt-1 tracking-wider">
          City - Florida, USA
        </Text>
      </View>

      {/* Recent Featured Section */}
      <View className="mt-10 px-4 w-full">
        <Text className="font-bold text-xl text-sky-950 tracking-widest">
          Recent Featured
        </Text>
        <FlatList
          data={featuredImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              className="w-32 h-32 m-2 rounded-lg"
            />
          )}
        />
      </View>

      {/* Portfolio Section */}
      <View className="mt-10 px-2 w-full">
        <View className="flex-row gap-1 items-center">
          <Text className="font-bold text-xl text-sky-950 tracking-widest">
            Portfolio
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={portfolioItems}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="flex-row p-4 my-3 gap-3 items-center bg-gray-100">
              <Image source={{ uri: item.image }} className="w-40 h-36 rounded-lg" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                <Text className="text-gray-700 mt-1 w-full flex-wrap">{item.description}</Text>
                <Text className="text-black rounded-3xl p-1 mt-1 text-lg font-bold w-auto">
                  Year: {item.year}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal for Adding Portfolio */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 w-4/5 rounded-lg shadow-lg">
            <Text className="text-lg font-bold mb-2">Add New Portfolio</Text>

            <TextInput
              placeholder="Project Name"
              className="border p-2 mb-2 rounded"
            />

            <TextInput
              placeholder="Description"
              className="border p-2 mb-2 rounded"
              multiline
            />

            <TextInput
              placeholder="Year"
              className="border p-2 mb-2 rounded"
              keyboardType="numeric"
           
             
            />

            <TextInput
              placeholder="Image URL (optional)"
              className="border p-2 mb-2 rounded"
            />

            <View className="flex-row justify-between mt-2">
              <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
              <Button title="Add Portfolio"  />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileCard;
