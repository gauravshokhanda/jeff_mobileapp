import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { API } from '../../config/apiConfig';



const AllPropertyPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
      const token = useSelector((state) => state.auth.token);
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log("fetch post functin")
    try {
      const response = await API.get("job-post/listing",{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      console.log("fetch post",response.data.data.data)
      if (response.data.success) {
        setPosts(response.data.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-lg">
      <Text className="text-lg font-bold text-gray-900">{item.project_type}</Text>
      <Text className="text-gray-700">City: {item.city}</Text>
      <Text className="text-gray-700">Zipcode: {item.zipcode}</Text>
      <Text className="text-gray-700">Area: {item.area}</Text>
      <Text className="text-gray-700">Total Cost: ${item.total_cost}</Text>
      <Text className="text-gray-500 text-sm mt-2">{new Date(item.created_at).toLocaleDateString()}</Text>
      {item.floor_maps_image && JSON.parse(item.floor_maps_image).length > 0 && (
        <Image
          source={{ uri: `https://g32.iamdeveloper.in/public/${JSON.parse(item.floor_maps_image)[0]}` }}
          className="w-full h-40 mt-2 rounded-lg"
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#000" className="mt-10" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default AllPropertyPost;
