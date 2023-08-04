import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, useWindowDimensions, PanResponder, Animated, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import AddScreen from './addScreen';
import PlusScreen from './plusScreen';
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Alert } from 'react-native';

import db from "../config/firebaseDB";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import * as Location from "expo-location";
import axios from "axios";

const Stack = createStackNavigator();

const HomePage = ({email}) => {
    const [weather, setWeather] = useState(null);
    const [placeName, setPlaceName] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [userName, setUserName] = useState("");
    const navigation = useNavigation();
    const [highTemperature, setHighTemperature] = useState(null);
    const [lowTemperature, setLowTemperature] = useState(null);
    const [windSpeed, setWindSpeed] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [sunrise, setSunrise] = useState(null);
    const [sunset, setSunset] = useState(null);
  
    const getISTTime = (unixTimestamp) => {
      const date = new Date(unixTimestamp * 1000);
      const ISTOffset = 5.5 * 60; // IST offset is 5 hours and 30 minutes ahead of UTC
      const ISTTime = new Date(date.getTime() + ISTOffset * 1000);
    
      const hours = ISTTime.getHours();
      const minutes = ISTTime.getMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
    
      return `${formattedHours}:${formattedMinutes} ${amPm}`;
    };
    
    const getCurrentDay = () => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const currentDate = new Date();
      const dayIndex = currentDate.getDay();
    
      return days[dayIndex];
    };
  
    useEffect(() => {
      const getLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
  
          if (status !== "granted") {
            console.log("Permission to access location was denied");
            return;
          }
  
          const location = await Location.getCurrentPositionAsync({});
  
          const { latitude, longitude } = location.coords;
  
          setLatitude(latitude);
          setLongitude(longitude);
  
          fetchWeatherData(latitude, longitude);
          fetchPlaceName(latitude, longitude);
        } catch (error) {
          console.log("Error getting location", error);
        }
      };
  
      getLocation();
  
      const interval = setInterval(() => {
        if (latitude && longitude) {
          fetchWeatherData(latitude, longitude);
          setCurrentTime(new Date());
        }
      }, 1000); // Update time every second
  
      return () => {
        clearInterval(interval);
      };
    }, [latitude, longitude]);
  
    // useEffect(() => {
    //   const fetchUserName = async () => {
    //     try {
    //       if (!email) {
    //         console.log("Email is undefined.");
    //         return;
    //       }
    //       const q = query(collection(db, "users"), where("email", "==", email));
    //       const querySnapshot = await getDocs(q);
    //       if (!querySnapshot.empty) {
    //         const userData = querySnapshot.docs[0].data();
    //         setUserName(userData.name);
    //       } else {
    //         console.log("No user data found.");
    //       }
    //     } catch (error) {
    //       console.log("Error fetching user data from Firestore", error);
    //     }
    //   };
  
    //   fetchUserName();
    // }, [email]);
  
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const API_KEY = "f23742a6b79b9957a3decfdf4e51641d";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const response = await axios.get(url);
        setWeather(response.data);
  
        // Extracting additional weather data
        const { main, wind, sys } = response.data;
        setHighTemperature(main.temp_max);
        setLowTemperature(main.temp_min);
        setWindSpeed(wind.speed);
        setHumidity(main.humidity);
        setSunrise(sys.sunrise);
        setSunset(sys.sunset);
      } catch (error) {
        console.log("Error fetching weather data", error);
      }
    };
  
    const fetchPlaceName = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=f23742a6b79b9957a3decfdf4e51641d`
        );
  
        const placeData = response.data;
  
        if (placeData.length > 0) {
          const place = placeData[0].name;
          setPlaceName(place);
        }
      } catch (error) {
        console.log("Error fetching place name", error);
      }
    };

    const handleViewAll = () => {
      navigation.navigate('Leaf'); // Navigate to the Leaf screen
    };

    const changeToPlant = () => {
    navigation.navigate("Plant");
  };
  
  
    return (
      <SafeAreaView style={styles2.container}>
        <View style={styles2.header}>
          <View style={styles2.welcomeColumn}>
            <Text style={styles2.welcome}>Welcome</Text>
          </View>
        </View>
  
        <ScrollView contentContainerStyle={styles2.content}>
          <View style={styles2.card}>
            <View style={styles2.locationRow}>
              <EntypoIcon name="location-pin" style={styles2.locationIcon} />
              <Text style={styles2.placeName}>{placeName}</Text>
            </View>
            <View style={styles2.temperatureRow}>
              <Text style={styles2.temperature}>{(weather?.main.temp - 273.15).toFixed(1)}</Text>
              <Text style={styles2.degreeSymbol}>°</Text>
              <Text style={styles2.temperatureUnit}>C</Text>
              <Text style={styles2.temperatureRange}>H: {(weather?.main.temp_max - 273.15).toFixed(1)}°C{"\n"}L: {(weather?.main.temp_min - 273.15).toFixed(1)}°C</Text>
            </View>
            <Text style={styles2.currentDateTime}>{getCurrentDay()}, {currentTime.toLocaleTimeString()}</Text>
            <View style={styles2.separator} />
            <View style={styles2.weatherDataRow}>
    <View style={styles2.weatherDataColumn}>
      <MaterialCommunityIconsIcon
        name="weather-windy"
        style={styles2.weatherIcon}
      />
      <Text style={styles2.weatherDataLabel}>Wind</Text>
      <Text style={styles2.weatherDataValue}>{windSpeed} m/s</Text>
    </View>
    <View style={styles2.weatherDataColumn}>
      <FeatherIcon name="droplet" style={styles2.weatherIcon} />
      <Text style={styles2.weatherDataLabel}>Humidity</Text>
      <Text style={styles2.weatherDataValue}>{humidity}%</Text>
    </View>
    <View style={styles2.weatherDataColumn}>
      <FeatherIcon name="sunrise" style={styles2.weatherIcon} />
      <Text style={styles2.weatherDataLabel}>Sunrise</Text>
      <Text style={styles2.weatherDataValue}>{getISTTime(sunrise)}</Text>
    </View>
    <View style={styles2.weatherDataColumn}>
      <FeatherIcon name="sunset" style={styles2.weatherIcon} />
      <Text style={styles2.weatherDataLabel}>Sunset</Text>
      <Text style={styles2.weatherDataValue}>{getISTTime(sunset)}</Text>
    </View>
  </View>
          </View>
          <View style={styles2.myCropsRow}>
            <Text style={styles2.myCrops}>My Crops</Text>
            <TouchableOpacity onPress={handleViewAll}>
                <Text style={styles2.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={changeToPlant}>
          <View style={styles2.cropCard}>
          <Image
            source={require("../assets/images/new-removebg-preview.png")}
            resizeMode="contain"
            style={styles2.image}
          />
            <Text style={styles2.cropName}>Tomato</Text>
          </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const PlantPage = ({ apiKey }) => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://api.thingspeak.com/channels/2127677/feeds.json?api_key=8WE38UY0H9I2WXNL&results=1"
          );
          const responseData = response.data;
  
          if (
            responseData &&
            responseData.feeds &&
            responseData.feeds.length > 0
          ) {
            const latestData = responseData.feeds[0];
            setData(latestData);
          }
        } catch (error) {
          console.log("Error fetching data from ThingSpeak", error);
        }
      };
  
      fetchData();
  
      const interval = setInterval(() => {
        fetchData();
      }, 60000);
  
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    const handleBackPress = () => {
      navigation.navigate("HomePage");
    };

    const handlePlantNavigation = () => {
      navigation.navigate("Plant");
    }
  
    return (
      <View style={styles4.container}>
        <View style={styles4.header}>
          <Ionicons
            name="arrow-back"
            style={styles4.icon}
            onPress={handleBackPress}
          />
          <Text style={styles4.myPlants}>My Plants</Text>
        </View>
        <TouchableOpacity onPress={handlePlantNavigation}>
        <View style={styles4.imageRow}>
          <Image
            source={require("../assets/images/new-removebg-preview.png")}
            resizeMode="contain"
            style={styles4.image}
          />
          
          <View style={styles4.tomatoPlantColumn}>
            <Text style={styles4.tomatoPlant}>Tomato Plant</Text>
            {data && (
              <View style={styles4.iconRow}>
                <Ionicons name="md-water" style={styles4.icon} />
                <Text style={styles4.value}>
                  {Math.round(Number(data.field6))} %
                </Text>
              </View>
            )}
          </View>
          
        </View>
        </TouchableOpacity>
      </View>
    );
  };
  


const  HomeTest = ({route}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const windowWidth = useWindowDimensions().width;
    const sidebarWidth = windowWidth * 0.7;
    const navigation = useNavigation();
    const [activePage, setActivePage] = useState("Home1");
    const [forgotPasswordAnimation] = useState(new Animated.Value(0));
    const [overlayVisible, setOverlayVisible] = useState(false); // Add overlayVisible state
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { email } = route.params || {};

    const handlePlantNavigation = () => {
      Alert.alert(
        'Logout Confirmation',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => {
              handleLogout();
              console.log('User logged out');
            },
          },
        ]
      );
    };

    const handleLogout = () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          navigation.navigate("Login");
        })
        .catch((error) => {
          console.log("Error signing out", error);
        });
    };

    const forgotPasswordTranslateY = forgotPasswordAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    const handleForgotPasswordDismiss = () => {
      Animated.timing(forgotPasswordAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowForgotPassword(false);
        setOverlayVisible(false); // Hide the overlay when block is closed
      });
    };

    const handleForgotPassword = () => {
      if (!email) {
        Alert.alert("Forgot Password", "Please enter your email");
        return;
      }
      setShowForgotPassword(true);
      Animated.timing(forgotPasswordAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setOverlayVisible(true); // Show the overlay when block is opened
    };
  
    const handlePageChange = (page) => {
      setActivePage(page);
      navigation.navigate(page); // Navigate to the selected screen
    };

    const screens = {
      Home1: <HomePage email={email} />,
      Plus: <PlusScreen />,
      Leaf: <PlantPage />,
    };
  
    const renderIcon = (page, iconName) => {
      const isActive = activePage === page;
      const iconSize = page === "Plus" ? 32 : 24; // Set the icon size to 32 for the "Plus" page
    
      return (
        <TouchableOpacity
          style={[styles.iconContainer, isActive && styles.activeIconContainer]}
          onPress={() => handlePageChange(page)}
        >
          <Ionicons
            name={iconName}
            size={iconSize}
            color={isActive ? "blue" : "black"}
          />
        </TouchableOpacity>
      );
    };

    const Test = () => {
      setShowForgotPassword(true);
      Animated.timing(forgotPasswordAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setOverlayVisible(true); // Show the overlay when block is opened
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={() => setIsSidebarOpen(false)}>
          <View style={styles.content}>
            <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name="Home1" component={HomePage} />
            <Stack.Screen name="Plus" component={PlusScreen} />
            <Stack.Screen name="Leaf" component={PlantPage} />
            
        </Stack.Navigator>
          </View>
        </TouchableWithoutFeedback>

        {showForgotPassword && (
        <Animated.View
          style={[
          styles.forgotPasswordContainer,
           {
             transform: [{ translateY: forgotPasswordTranslateY }],
             height: 350,
           },
          ]}
        >
          <TouchableOpacity
            style={styles3.dismissButton}
            onPress={handleForgotPasswordDismiss}
          >
            <Ionicons name="md-close" style={styles3.dismissIcon} />
          </TouchableOpacity>
          <Text style={styles3.forgotPasswordTitle}>Add a Plant</Text>
          <Text style={styles3.forgotPasswordText}>
          Enter the unique key provided
          </Text>
          <View style={styles3.inputRow}>
            <Ionicons name="key" style={styles3.inputIcon} />
            <TextInput
              style={styles3.input}
              placeholder="Key"
              placeholderTextColor="rgba(159, 159, 159, 1)"
              autoCapitalize="none"
              editable={false}
            />
          </View>
          <TouchableOpacity
            style={[styles3.buttonContainer, styles3.resetPasswordButton]}
          >
            <Text style={styles3.buttonText}>Submit</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {/* {overlayVisible && <View style={styles.overlay} />} */}

      <View style={styles.footer}>
          {renderIcon("Home1", "home")}
          <Ionicons
            name="log-out-outline"
            size= {32}
            // color={isActive ? "blue" : "black"}
            onPress={handlePlantNavigation}
          />
          {renderIcon("Leaf", "leaf")}
        </View>

      </SafeAreaView>
    );
  }

  const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    image: {
      height: 75,
      width: 75,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    menuIcon: {
      color: "rgba(128,128,128,1)",
      fontSize: 40,
    },
    content: {
      flexGrow: 1,
      padding: 20,
    },
    card: {
      backgroundColor: "#E6E6E6",
      borderRadius: 8,
      padding: 20, // Update the padding to give more space around the content
      marginBottom: 20,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10, // Update the margin for better spacing
    },
    locationIcon: {
      color: "rgba(128,128,128,1)",
      fontSize: 30,
      height: 34,
      width: 30,
    },
    placeName: {
      color: "#121212",
      marginLeft: 10, // Update the margin for better spacing
      fontSize: 16, // Update the font size for better visibility
    },
    temperatureRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10, // Update the margin for better spacing
    },
    temperature: {
      color: "#121212",
      fontSize: 24,
    },
    degreeSymbol: {
      color: "#121212",
      marginLeft: 2,
      marginTop: 3,
      fontSize: 16, // Update the font size for better visibility
    },
    temperatureUnit: {
      color: "#121212",
      marginLeft: 1,
      marginTop: 3,
      fontSize: 16, // Update the font size for better visibility
    },
    temperatureRange: {
      color: "#121212",
      fontSize: 12, // Update the font size for better visibility
      marginLeft: 10, // Update the margin for better spacing
      marginTop: 4,
    },
    currentDateTime: {
      color: "#121212",
      fontSize: 12, // Update the font size for better visibility
      marginTop: 10, // Update the margin for better spacing
    },
    separator: {
      width: "100%",
      height: 3,
      backgroundColor: "rgba(0,0,0,1)",
      marginTop: 16,
      marginBottom: 16, // Update the margin for better spacing
    },
    weatherDataRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10, // Update the margin for better spacing
    },
    weatherDataColumn: {
      alignItems: "center",
      flex: 1, // Update the flex value for equal distribution
    },
    weatherData: {
      flexDirection: "row",
      alignItems: "center",
    },
    weatherDataLabel: {
      color: "#121212",
      marginTop: 5,
      fontSize: 12, // Update the font size for better visibility
    },
    weatherDataValue: {
      color: "#121212",
      fontSize: 14, // Update the font size for better visibility
      marginTop: 2,
    },
    myCropsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    myCrops: {
      color: "#121212",
      fontSize: 25,
      flex: 1,
    },
    viewAll: {
      color: "#121212",
    },
    cropCard: {
      width: "100%",
      borderRadius: 15,
      backgroundColor: "#E6E6E6",
      marginBottom: 20,
      padding: 8,
      flexDirection: "row", // Add flexDirection: "row" to display the image and text side by side
      alignItems: "center",
    },
    cropName: {
      color: "#121212",
      fontSize: 20,
      marginLeft: 15,
    },
  
    welcomeColumnRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      paddingHorizontal: 20,
    },
    welcomeColumn: {
      flexDirection: "column",
    },
    welcome: {
      color: "#121212",
      fontSize: 30,
      marginBottom: 5,
      fontWeight: 500,
    },
    user: {
      color: "#121212",
      fontSize: 35,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  hamburger: {
    marginRight: 16,
    zIndex: 2,
  },
  sidebar: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  sidebarContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 60,
    backgroundColor: "#f0f0f0",
    zIndex: 2,
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    left: 0,
    padding: 10,
    zIndex: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeIconContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "blue",
  },
});

const styles3 = StyleSheet.create({
  forgotPasswordContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 5,
  },
  dismissButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 10,
  },
  dismissIcon: {
    color: "rgba(41, 45, 50, 1)",
    fontSize: 25,
  },
  forgotPasswordTitle: {
    fontSize: 25,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  forgotPasswordText: {
    fontSize: 15,
    color: "rgba(87, 87, 87, 0.8)",
    marginBottom: 15,
    textAlign: "left",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "rgba(233, 233, 233, 1)",
    borderRadius: 10,
    marginTop: 14,
    width: "100%",
  },
  inputIcon: {
    color: "rgba(128, 128, 128, 1)",
    fontSize: 20,
    height: 23,
    width: 20,
    marginLeft: 5,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    height: 50,
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  resetPasswordButton: {
    marginTop: 15,
    backgroundColor: "rgba(0, 0, 0, 1)",
    borderRadius: 15,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});

const styles4 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  icon: {
    fontSize: 24,
    color: 'black',
    marginRight: 10,
  },
  myPlants: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  apiBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apiText: {
    fontSize: 18,
    color: 'black',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items at the top
    marginVertical: 10, // Reduce the margin to move the block up
    marginHorizontal: 20,
    padding: 10,
    marginTop: 20,
    backgroundColor: "#E6E6E6",
    borderRadius: 20,
  },
  tomatoPlantColumn: {
    flex: 1,
    alignItems: 'flex-start', // Align items at the top
  },
  image: {
    width: 75,
    height: 75,
    marginRight: 20,
  },
  tomatoPlant: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 5,
    color: 'gray',
  },
  value: {
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeTest;