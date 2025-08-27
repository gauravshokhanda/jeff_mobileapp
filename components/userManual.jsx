import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  SafeAreaView,
  useWindowDimensions,
  Animated,
  Dimensions,
  TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import ModalSelector from "react-native-modal-selector";

const SECTIONS = [
  {
    id: "login",
    title: "Login Screen",
    tagline: "Fast, secure sign-in with flexible options",
    image: require("../assets/images/guide/login.jpg"),
    bullets: [
      "Sign in with your registered Email & Password",
      "Use “Forgot Password” to reset credentials",
      "Tap “Sign up” to create a new account",
      "“Login as Guest” to explore limited features",
      "“Premium Plans” for subscription options",
    ],
  },
  {
    id: "signup",
    title: "Sign-Up Screen",
    tagline: "Create your account in minutes",
    image: require("../assets/images/guide/signup.jpg"),
    bullets: [
      "Enter Name, Email, Password & Confirm Password",
      "Tap “Select Role” to choose how you’ll use the app",
      "Press “SIGN UP” to finish registration",
      "Already a user? Go to “Sign In”",
    ],
  },
  {
    id: "role",
    title: "Role Selection",
    tagline: "Personalize features based on your role",
    image: require("../assets/images/guide/role.jpg"),
    bullets: [
      "Customer: use services seamlessly",
      "General Contractor: manage and track projects",
      "Real Estate Contractor: real-estate workflows",
      "Use “Cancel” to close without selecting",
    ],
  },
  {
    id: "Users",
    title: "Customer Home Screen",
    tagline: "Browse and connect with top contractors",
    image: require("../assets/images/guide/userHome.jpg"),
    bullets: [
      "Visible after logging in as a Customer.",
      "Browse contractors by category: General / Real Estate.",
      "Search contractors using Map or Images for quick results.",
      "Post contractor requests by filling manual details or using Map location.",
      "View contractor details: name, email, address, and description.",
      "Connect instantly using the Profile or Call buttons on each contractor card.",
    ],
  },
  {
    id: "property-posting",
    title: "Post Your Property",
    tagline: "Easily share your property details with contractors",
    image: require("../assets/images/guide/map-post.jpg"),
    bullets: [
      "Search for your property location or enter coordinates.",
      "Zoom in/out and drop a pin to mark your exact location.",
      "Draw and adjust boundaries to highlight your property area.",
      "Alternatively, fill in property details manually if preferred.",
      "Press 'Confirm' to save — your property post becomes visible to contractors.",
      "Contractors in General or Real Estate categories can now view and respond to your property post.",
    ],
  },
  {
    id: "building-config",
    title: "Building Configuration",
    tagline: "Define your buildable area and floors",
    image: require("../assets/images/guide/building-config.jpg"),
    bullets: [
      "View the total calculated property area in sq.ft.",
      "Select the percentage of area coverage (30%, 50%, 75%, 90%, or enter a custom value).",
      "Enter the number of floors you plan to build.",
      "Press 'Submit' to finalize your building configuration.",
      "Your property post now includes exact buildable details visible to contractors.",
    ],
  },
  {
    id: "area-details",
    title: "Your Area Details",
    tagline: "Get instant calculations of your property area",
    image: require("../assets/images/guide/area-details.jpg"),
    bullets: [
      "View the **total property area** based on your map selection.",
      "See the **calculated buildable area** using your selected coverage % and floors.",
      "Press 'Calculate Cost' to estimate the project cost instantly.",
      "Contractors will now be able to see precise details of your post.",
    ],
  },
  {
    id: "cost-details",
    title: "Cost Details",
    tagline: "Understand the estimated cost of your project",
    image: require("../assets/images/guide/cost-details.jpg"),
    bullets: [
      "Review **Total Area** and **Buildable Area** clearly displayed.",
      "Check additional info like **City, State, and Zip Code**.",
      "See **Unit Price** (per sq.ft) applied to your property.",
      "View the **Total Cost estimate** for your construction.",
      "Tap **Cost Breakdown** for a detailed split of expenses.",
    ],
  },
  {
    id: "cost-breakdown",
    title: "Cost Breakdown",
    tagline: "Understand detailed project phases and timeline",
    image: require("../assets/images/guide/cost-breakdown.jpg"),
    bullets: [
      "Shows **Total Cost** and **Estimated Time** for the full project.",
      "Each card displays a construction phase (e.g., General Conditions, Site Work, Foundation, Framing).",
      "Progress rings indicate the % share of each phase in cost/time.",
      "Tap **Post** to publish this breakdown as a project/job for contractors to view.",
    ],
  },
  {
    id: "property-post",
    title: "Property Post",
    tagline: "Post your project for contractors to view",
    image: require("../assets/images/guide/property-post.jpg"),
    bullets: [
      "Fill in details such as **Number of Days, Total Cost, Zip Code, City, Project Type, and Description**.",
      "This form allows you to create a job post that contractors can see and respond to.",
      "After filling out, submit the form to publish your property/job.",
      "A success message will appear — *“Job posted successfully!”* confirming that your project is live.",
    ],
  },
  {
    id: "image-floor-map",
    title: "Property posting",
    tagline: "Upload a floor map and complete project details",
    image: require("../assets/images/guide/floor-map-post.jpg"),
    bullets: [
      "Opened after tapping **Search using Images** from the Customer Home screen.",
      "Tap **Upload Floormap** to attach a floor/plan image; a **Preview** appears with an option to remove it.",
      "Fill required fields: **Name, City, Zip Code, Total Area, Buildable Area, Number of Floors, Project Type**.",
      "Use accurate **Total/Buildable Area** so cost and timeline calculations stay correct.",
      "Press **Submit** to create a job post based on the uploaded image and entered details.",
      "After posting, the **Cost Breakdown screen** will open showing a detailed breakdown of the full project cost.",
    ],
  },
  {
    id: "cost-calculator",
    title: "Cost Calculator",
    tagline: "Estimate project cost and duration before posting",
    image: require("../assets/images/guide/cost-calculator.jpg"),
    bullets: [
      "Enter **City** and **Zip Code** to localize cost data.",
      "Provide **Total Area** and **Buildable Area** in square feet.",
      "Select the **Number of Floors** for the project.",
      "Choose a **Construction Type** (e.g., Basic, Mid-range, Premium).",
      "Tap **Calculate** to generate cost estimates.",
      "After calculation, the **Cost Breakdown screen** will open showing phase-wise cost and time details.",
    ],
  },
  {
    id: "properties-contractors",
    title: "Properties & Contractors",
    tagline: "Browse properties for sale and connect with contractors",
    image: require("../assets/images/guide/properties-contractors.jpg"),
    bullets: [
      "Use the top **Search** to quickly find properties or contractors.",
      "Two tabs: **Real Estate Property** (listings posted by real estate contractors) and **Contractors** (general contractor profiles).",
      "Property cards show **Location, Price, Availability Date, Area, Furnish Type** with actions: **View Contractor** and **Chat**.",
      "Contractor cards show **Name/Business, Email, Phone, City & Address** with actions: **Visit Profile**, **Call**, or **Message**.",
      "Switch tabs anytime to compare listings and services in one place.",
    ],
  },
  {
    id: "messages",
    title: "Messages",
    tagline: "View and manage conversations with contractors",
    image: require("../assets/images/guide/messages.jpg"),
    bullets: [
      "Search bar at the top to quickly find any conversation.",
      "List of recent chats displayed with profile picture and name.",
      "Tap a chat to open the full conversation with the contractor.",
      "Each contractor chat helps you coordinate deals, projects, or follow-ups.",
      "Simple, clean layout for easy navigation between multiple conversations.",
    ],
  },
  {
    id: "menu",
    title: "Main Menu",
    tagline: "Quick access to everything in one place",
    image: require("../assets/images/guide/menu.jpg"), 
    bullets: [
      "Shown after login — your central hub for navigation.",
      "**Contractor Lists**: browse service providers by category.",
      "**My Posts**: view and manage your posted properties/jobs.",
      "**Profile**: edit personal details and preferences.",
      "**Chats**: open conversations with contractors/customers.",
      "**Calculator**: estimate cost & time for new projects.",
      "**Explore Premium**: see and upgrade to premium plans.",
      "**Reset Password**: change your account password securely.",
      "**Delete Account**: permanently remove your account and data.",
      "**Log Out**: sign out of the app safely.",
    ],
  },
  {
    id: "contractor_profile_complete",
    title: "Complete Your Profile",
    tagline: "Set up your contractor profile to start receiving projects.",
    image: require("../assets/images/guide/contractor_profile.jpg"),
    bullets: [
      "Upload your profile photo.",
      "Enter Company Name, Contact Number, and License No.",
      "Provide your Company Address and City.",
      "Add a brief Description of your services.",
      "Upload your Organization certificate or document.",
      "Tap 'Save Profile' to complete your signup."
    ]
  },
  {
    id: "home_properties_feed",
    title: "Browse Properties",
    tagline: "View available real estate listings and projects posted by customers.",
    image: require("../assets/images/guide/home_properties.jpg"),
    bullets: [
      "Search for properties using the search bar at the top.",
      "View property details like price, type, location, and posting date.",
      "Tap 'View' to open full property details.",
      "Scroll to explore multiple property listings.",
      "Use the bottom navigation bar to switch between Home, Contractors, Calculator, Chats, and Menu."
    ]
  },
  {
    id: "General_contractor_profile",
    title: "Contractor Profile",
    tagline: "Manage your personal information and showcase your portfolio.",
    image: require("../assets/images/guide/General_contractor_profile.jpg"),
    bullets: [
      "View your personal details like name, email, phone, and company.",
      "Edit your profile by tapping the edit icon next to Personal Information.",
      "Showcase your work under the 'Portfolios' section.",
      "Tap the ➕ button to add a new portfolio project.",
      "Select any portfolio to view or edit its details.",
      "Use the bottom navigation bar to quickly switch to Home, Calculator, Chats, or Menu."
    ]
  },
  {
    id: "General_contractor_personal_portfolios",
    title: "My Portfolios",
    tagline: "Showcase and manage your construction projects easily.",
    image: require("../assets/images/guide/General_contractor_personal_portfolios.png"),
    bullets: [
      "View all your portfolio projects with name, description, year, and images.",
      "Quickly search portfolios using the search bar at the top.",
      "Tap the ➕ button to upload a new portfolio project.",
      "Fill in project details like name, city, address, and description.",
      "Add multiple images to make your portfolio more attractive.",
      "Tap any portfolio card to view or edit its details.",
      "Use the bottom navigation bar to access Home, Properties, Calculator, Chats, or Menu."
    ]
  },
  {
    id: "General_contractor_menu",
    title: "Contractor menu",
    tagline: "Quickly access all your essential tools and settings.",
    image: require("../assets/images/guide/General_contractor_menu.jpg"),
    bullets: [
      "View and manage your project portfolios.",
      "Stay updated with the latest feeds related to your work.",
      "Edit your personal and company profile details.",
      "Chat directly with clients or team members.",
      "Easily reset your account password for security.",
      "Explore premium features for enhanced tools and benefits.",
      "Delete your account permanently if no longer needed.",
      "Log out safely from your account anytime."
    ]
  },
  {
    id: "General_contractor_messages",
    title: "Messages",
    tagline: "Stay connected with customer, general contractor, and real_state_contractor.",
    image: require("../assets/images/guide/General_contractor_messages.jpg"),
    bullets: [
      "View all your recent conversations in one place.",
      "Search for specific people or chats using the search bar.",
      "Identify contacts quickly with profile icons or initials.",
      "Tap on any contact to open the conversation thread.",
      "Easily communicate with clients, admins, or team members.",
    ]
  },
  {
    id: "Real_estate_contractor_property_post",
    title: "Post Your First Property",
    tagline: "Easily list your property details and make them visible to clients.",
    image: require("../assets/images/guide/real_estate_property_post.png"),
    bullets: [
      "Choose the property type: Residential or Commercial.",
      "Search and select the city where the property is located.",
      "Pick the house type (Apartment, Independent Floor, or Independent House).",
      "Enter optional details like Building/Project/Society name.",
      "Fill in locality, price, and built-up area information.",
      "Select BHK type (1RK, 1BHK, 2BHK, etc.).",
      "Choose furnishing type: Fully Furnished, Semi Furnished, or Unfurnished.",
      "Set availability by selecting a date.",
      "Upload property images to showcase your listing.",
      "Tap on 'Add Property Details' to publish your property."
    ]
  },
  {
    "id": "Real_estate_homepage",
    "title": "Contractor Home Page",
    "tagline": "Manage your listed properties and explore new opportunities.",
    "image": require("../assets/images/guide/real_estate_homepage.jpg"),
    "bullets": [
      "View your posted properties under 'Checkout your properties'.",
      "See property details such as location, type, availability date, area, and price.",
      "Access buyer readiness with 'Get ready list of buyers'.",
      "Explore 'New Properties!' for house and land packages.",
      "Stay informed with important alerts and cautions about safety and fraud.",
      "Use the bottom navigation bar to switch between Home, Add Property, Listings, Chats, and Profile."
    ]
  },
  {
    id: "Real_estate_property_listing",
    title: "Property Listing",
    tagline: "Browse properties posted by real estate contractors",
    image: require("../assets/images/guide/real_estate_property_listing.png"),
    bullets: [
      "Use the top **Search by City** bar to find listings quickly.",
      "Switch between **Residential** and **Commercial** tabs to filter property type.",
      "Each card shows **Location, Title, Price (USD), Availability Date, Area (sq ft), and Furnish Type**.",
      "Tap a property to view full details, photos, and contact options.",
      "All listings here are **posted by Real Estate Contractors** in the app.",
      "Use the bottom navigation to jump to Home, Add Property, Listings, Chats, or Profile."
    ]
  },
  {
    id: "real_estate_profile_dashboard",
    title: "Profile Dashboard",
    tagline: "Manage your account and explore app features",
    image: require("../assets/images/guide/real_estate_profile_dashboard.jpg"),
    bullets: [
      "Access **My Listing** to view and manage your posted properties.",
      "Edit your personal details from the **Profile** section.",
      "Use **Chat** to connect with buyers, sellers, or contractors.",
      "Quickly **Reset Password** for account security.",
      "Unlock extra features through **Explore Premium**.",
      "Permanently **Delete Account** if you no longer wish to use the app.",
      "Use **Log Out** to safely exit your account on this device."
    ]
  }
];

export default function UserManual({ navigation, onDone }) {
  const { height } = useWindowDimensions();
  const scrollRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const tabLayouts = useRef({});

  const navigations = useNavigation();




  const enter = useRef(new Animated.Value(0)).current;
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const yMapRef = useRef({});

  useEffect(() => {
    if (!horizontalScrollRef.current) return;
    const layout = tabLayouts.current[activeId];
    if (layout) {
      const screenWidth = Dimensions.get("window").width;
      const scrollX = Math.max(0, layout.x + layout.width / 2 - screenWidth / 2);
      horizontalScrollRef.current.scrollTo({ x: scrollX, animated: true });
    }
  }, [activeId]);



  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 520, useNativeDriver: true }).start();
  }, []);

  const headerTranslateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const onLayoutSection = (id, y) => {
    yMapRef.current[id] = y;
  };

  const scrollToId = (id) => {
    const y = yMapRef.current[id] ?? 0;
    setActiveId(id);
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
  };

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    let closest = SECTIONS[0].id;
    let minDelta = Number.MAX_VALUE;
    for (const s of SECTIONS) {
      const sy = yMapRef.current[s.id] ?? 0;
      const delta = Math.abs(y - sy);
      if (delta < minDelta) {
        minDelta = delta;
        closest = s.id;
      }
    }
    if (closest !== activeId) setActiveId(closest);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50   mx-3">
      {/* Main Content */}
      <View className="flex-1 mt-12 mb-5">
        {/* Header */}
        <Animated.View
          style={{ transform: [{ translateY: headerTranslateY }], opacity: enter }}
          className="px-5 pt-2.5 pb-3"
        >
          <View
            className="rounded-3xl border border-gray-200 bg-white overflow-hidden"
            style={{
              shadowOpacity: 0.04,
              shadowRadius: 22,
              shadowOffset: { width: 0, height: 10 },
              elevation: 2,
              shadowColor: "#000",
            }}
          >
            <View className="p-4">
              {/* 🔎 Search Bar */}

              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-3 border border-gray-300">
                {/* Search Input */}
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor="#666"
                  className="flex-1 text-base text-slate-900"
                  onChangeText={(text) => {
                    setSearchQuery(text);

                    // Find the first section with a matching title
                    const match = SECTIONS.find((s) =>
                      s.title.toLowerCase().includes(text.toLowerCase())
                    );

                    if (match) {
                      scrollToId(match.id); // scroll to section
                      setActiveId(match.id); // update active tab
                    }
                  }}
                  value={searchQuery}
                />


                {/* Filter Button */}
                <Pressable
                  onPress={() => setModalVisible(true)}
                  className="ml-3 w-10 h-10 rounded-full bg-sky-600 items-center justify-center shadow"
                >
                  <Feather name="sliders" size={20} color="#082f49" />
                </Pressable>
              </View>

              {/* Horizontal Tabs */}
              <ScrollView
                ref={horizontalScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
              >
                {SECTIONS.map((s) => {
                  const active = s.id === activeId;
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => scrollToId(s.id)}
                      onLayout={(e) => {
                        const { x, width } = e.nativeEvent.layout;
                        tabLayouts.current[s.id] = { x, width };
                      }}
                      className={`mt-2 px-4 h-9 mr-2 rounded-full border items-center justify-center ${active
                        ? "bg-sky-900 border-slate-900"
                        : "bg-gray-100 border-gray-300"
                        }`}
                    >
                      <Text
                        className={`font-bold text-lg ${active ? "text-white" : "text-slate-900"
                          }`}
                      >
                        {s.title}
                      </Text>
                    </Pressable>
                  );
                })}

                {/* Done Button */}
                <Pressable
                  onPress={() => {
                    onDone?.();
                    navigations.navigate("SignIn");
                  }}
                  className="px-4 h-5 rounded-full  bg-gray-100 border-gray-300 items-center justify-center rounded-full border"
                >
                  <Text className="text-sky-950 font-black font-semibold">Done</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Animated.View>


        <View className="flex-1 justify-between">
          {/* Scrollable Content */}
          <ScrollView
            ref={scrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            className="px-5"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {SECTIONS.map((s, idx) => (
              <CardSection
                key={s.id}
                index={idx}
                section={s}
                onLayoutY={(y) => onLayoutSection(s.id, y)}
                imageHeight={Math.min(460, height * 0.52)}
              />
            ))}
          </ScrollView>

          {/* Skip Button at bottom-right */}
          <View className="items-end mr-5">
            <Pressable
              onPress={() => {
                onDone?.();
                navigations.navigate("SignIn");
              }}
              className="px-5 py-2 rounded-full bg-gray-200 border border-gray-300 items-center justify-center shadow-md pb-10"
            >
              <Text className="text-slate-900 font-bold">Skip</Text>
            </Pressable>
          </View>
        </View>
        {modalVisible && (
          <ModalSelector
            data={SECTIONS.map((s) => ({ key: s.id, label: s.title }))}
            initValue="Select Section"
            onChange={(option) => {
              scrollToId(option.key);
              setActiveId(option.key);
              setModalVisible(false);
            }}
            cancelText="Cancel"
            visible={modalVisible}
            onModalClose={() => setModalVisible(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function CardSection({ section, index, onLayoutY, imageHeight }) {
  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(appear, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    }, 120 + index * 80);
    return () => clearTimeout(t);
  }, []);

  const opacity = appear;
  const translateY = appear.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Animated.View
      onLayout={(e) => onLayoutY(e.nativeEvent.layout.y)}
      style={{ opacity, transform: [{ translateY }] }}
      className="mb-5 rounded-3xl border border-gray-200 bg-white overflow-hidden"
    >
      <View className="px-4 pt-4">
        <View className="flex-row items-center mb-2">
          <View className="px-2.5 h-7 p-2 rounded-full bg-gray-200 items-center justify-center mr-2.5">
            <Text className="text-slate-900 font-black">
              {String(index + 1).padStart(2, "0")}
            </Text>
          </View>
          <Text className="text-slate-900 font-bold text-lg ml-2">{section.title}</Text>
        </View>
        {section.tagline ? <Text className="text-slate-600 mb-1.5">{section.tagline}</Text> : null}
      </View>

      <View className="px-3 pt-1">
        <View className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <Image
            source={section.image}
            resizeMode="contain"
            style={{ width: "100%", height: imageHeight }}
          />
          <View className="h-[3px] bg-gray-200" />
        </View>
      </View>

      <View className="p-4">
        {section.bullets.map((b, i) => (
          <View key={i} className="flex-row mb-2">
            <Text className="text-slate-900 mr-2">▹</Text>
            <Text className="text-slate-600 text-sm flex-1">{b}</Text>
          </View>
        ))}
      </View>

    </Animated.View>

  );
}
