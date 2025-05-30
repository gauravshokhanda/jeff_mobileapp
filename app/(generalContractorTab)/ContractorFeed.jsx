import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { API } from "../../config/apiConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function PropertyList() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const postContentWidth = screenWidth * 0.92;
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Custom debounce implementation
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Search handler with debouncing
  const searchHandler = useRef(
    debounce((query) => {
      fetchProperties(1, true, query);
    }, 500)
  ).current;

  useEffect(() => {
    fetchProperties(1, true);
  }, []);

  useEffect(() => {
    if (searchQuery !== "") {
      setSearchLoading(true);
      searchHandler(searchQuery);
    } else {
      fetchProperties(1, true, "");
    }
  }, [searchQuery]);

  const fetchProperties = async (
    pageNumber,
    isRefresh = false,
    query = searchQuery
  ) => {
    if (!isRefresh && (!hasMore || isFetching)) return;
    setIsFetching(true);

    try {
      const queryParam = query ? `&city=${query}` : "";
      const response = await API.get(
        `job-post/listing?page=${pageNumber}${queryParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        setProperties((prev) =>
          isRefresh
            ? response.data.data.data
            : [...prev, ...response.data.data.data]
        );
        setHasMore(!!response.data.data.next_page_url);
        if (!isRefresh) setPage(pageNumber);
      } else {
        console.log("Unexpected API response:", response.data);
        setProperties([]); // Reset properties if response is invalid
      }
    } catch (error) {
      console.log(
        "Error fetching properties:",
        error.response?.data || error.message
      );
      setProperties([]); // Reset properties on error
    } finally {
      setIsFetching(false);
      setRefreshing(false);
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);

    if (offsetY <= -160 && !refreshing) {
      setRefreshing(true);
      fetchProperties(1, true);
      setPage(1);
    }
  };

  const handleLoadMore = ({ nativeEvent }) => {
    if (
      nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
      nativeEvent.contentSize.height - 50
    ) {
      if (!isFetching) {
        fetchProperties(page + 1);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <LinearGradient
        colors={["#082f49", "transparent"]}
        style={{ height: screenHeight * 0.4 }}
      >
        <View className={`flex-row items-center px-4`}>
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View className="flex-row flex-1 items-center bg-white rounded-xl px-3 my-3">
            <Ionicons name="search" size={20} color="gray" className="mr-2" />
            <TextInput
              placeholder="Search properties"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              className={`flex-1 text-black text-base ${
                Platform.OS === "ios" ? "py-3" : "py-3"
              }`}
            />
          </View>
        </View>
      </LinearGradient>

      <View
        className="flex-1 rounded-3xl bg-white"
        style={{
          marginTop: -screenHeight * 0.27,
          width: postContentWidth,
          marginHorizontal: (screenWidth - postContentWidth) / 2,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#082f49" className="mt-10" />
        ) : (
          <>
            {searchLoading && (
              <ActivityIndicator
                size="small"
                color="#082f49"
                className="mt-4"
              />
            )}
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="px-4"
              onScroll={(event) => {
                handleScroll(event);
                handleLoadMore(event);
              }}
              scrollEventThrottle={16}
            >
              {refreshing ? (
                <ActivityIndicator
                  size="large"
                  color="#082f49"
                  className="mt-10"
                />
              ) : properties.length > 0 ? (
                properties.map((property) => {
                  let designImages = [];
                  try {
                    designImages = JSON.parse(property.design_image);
                  } catch (error) {
                    console.error("Error parsing design_image:", error);
                  }

                  const imageUrl =
                    designImages.length > 0
                      ? `https://g32.iamdeveloper.in/public/${designImages[0]}`
                      : null;

                  return (
                    <View
                      key={property.id}
                      className="bg-white mt-5 shadow-lg rounded-2xl mb-4"
                    >
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          className="w-full h-52 rounded-t-2xl"
                        />
                      ) : (
                        <Text className="text-center py-4 text-gray-500">
                          No image available
                        </Text>
                      )}

                      <View className="p-4 flex-row justify-between items-start space-x-4">
                        <View className="flex-1 flex-col gap-2">
                          <Text className="text-sky-950 text-2xl font-bold break-words">
                            ${property.total_cost.toLocaleString()}
                          </Text>
                          <Text className="text-gray-600 text-base">
                            #{property.zipcode}, {property.city}
                          </Text>
                          <Text className="text-gray-400 text-sm">
                            📅 {new Date(property.created_at).toLocaleString()}
                          </Text>
                        </View>

                        <View className="flex items-end justify-between min-w-[110px]">
                          <Text className="text-gray-900 font-semibold text-sm text-right">
                            {property.project_type} Apartment
                          </Text>
                          <TouchableOpacity
                            className="bg-sky-950 px-4 py-2 rounded-md mt-2"
                            onPress={() =>
                              router.push(`/PropertyDetails?id=${property.id}`)
                            }
                          >
                            <Text className="text-white text-sm font-semibold">
                              View
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text className="text-gray-500 text-center mt-4">
                  {searchQuery
                    ? `No properties found for "${searchQuery}"`
                    : "No properties available"}
                </Text>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
