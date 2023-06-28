import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";
import Footer from "../components/footer";
import HamburgerSidebar from "../components/hamburger";
import db from "../config/firebaseDB";
import TestScreen from "./test";

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

const HomeScreen = ({ route }) => {
  const [weather, setWeather] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [userName, setUserName] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [highTemperature, setHighTemperature] = useState(null);
  const [lowTemperature, setLowTemperature] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);

  const navigation = useNavigation();

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

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const email = route.params?.email;
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserName(userData.name);
        });
      } catch (error) {
        console.log("Error fetching user data from Firestore", error);
      }
    };

    fetchUserName();
  }, [route.params?.email]);

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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (gestureState.dx > 50) {
        setSidebarOpen(true);
      } else if (gestureState.dx < -50) {
        setSidebarOpen(false);
      }
    },
    onPanResponderRelease: () => {},
  });

  const handleChangePage = (page) => {
    setActivePage(page);
    // Perform additional actions based on the page change if needed
    if (page === "test") {
      navigation.navigate("Test"); // Replace "TestScreen" with the appropriate screen name for the "test.js" file
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setSidebarOpen(false)}>
        <View style={styles.content}>
          <View style={styles.header}>
            {!isSidebarOpen && (
              <TouchableOpacity
                onPress={toggleSidebar}
                style={styles.hamburger}
              >
                <Feather name="menu" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Text style={styles.headerText}>Welcome, {userName}!</Text>
          </View>
          <View style={styles.main}>
            {/* Your main content here */}
            <Text style={styles.text}>Place: {placeName}</Text>
            <Text style={styles.text}>
              Temperature: {(weather?.main.temp - 273.15).toFixed(1)}°C
            </Text>
            <Text style={styles.text}>
              H: {(weather?.main.temp_max - 273.15).toFixed(1)}°C
            </Text>
            <Text style={styles.text}>
              L: {(weather?.main.temp_min - 273.15).toFixed(1)}°C
            </Text>
            <Text style={styles.text}>Wind Speed: {weather?.wind.speed} m/s</Text>
            <Text style={styles.text}>Humidity: {weather?.main.humidity} %</Text>
            <Text style={styles.text}>
              Sunset: {getISTTime(weather?.sys.sunset)}
            </Text>
            <Text style={styles.text}>
              Sunrise: {getISTTime(weather?.sys.sunrise)}
            </Text>
            <Text style={styles.text}>
              Time: {currentTime.toLocaleTimeString()}, {getCurrentDay()}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {isSidebarOpen && (
        <View style={styles.sidebar} {...panResponder.panHandlers}>
          <HamburgerSidebar
            activePage={activePage}
            setActivePage={setActivePage}
            handleLogout={handleLogout}
          />
        </View>
      )}
      {isSidebarOpen && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
      <Footer activePage={activePage} onChangePage={handleChangePage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
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
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Changed the header text color to black
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#000", // Changed the text color to black
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
    color: "#000", // Changed the logout button text color to black
  },
});

export default HomeScreen;
