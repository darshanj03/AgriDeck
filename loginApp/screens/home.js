import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { Feather } from "@expo/vector-icons";

const getISTTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  const ISTOffset = 5.5 * 60; // IST offset is 5 hours and 30 minutes ahead of UTC
  const ISTTime = new Date(date.getTime() + ISTOffset * 1000);

  const hours = ISTTime.getHours();
  const minutes = ISTTime.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${amPm} `;
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

const HomeScreen = () => {
  const [weather, setWeather] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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

    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f23742a6b79b9957a3decfdf4e51641d`
        );

        const weatherData = response.data;

        setWeather(weatherData);
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
  }, []);

  return (
    <View style={styles.container}>
      {weather && currentTime ? (
        <View style={styles.weatherContainer}>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={24} color="#607D8B" />
            <Text style={styles.locationText}>{placeName}</Text>
          </View>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperatureText}>
              {(weather.main.temp - 273.15).toFixed(1)}°C
            </Text>
            <View style={styles.tempRangeContainer}>
              <Text style={styles.tempRangeText}>
                H: {(weather.main.temp_max - 273.15).toFixed(1)}°C
              </Text>
              <Text style={styles.tempRangeText}>
                L: {(weather.main.temp_min - 273.15).toFixed(1)}°C
              </Text>
            </View>
          </View>
          <View style={styles.dayTimeContainer}>
            <Text style={styles.dayTimeText}>
              {getCurrentDay()}, {getISTTime(currentTime.getTime() / 1000)}
            </Text>
            <View style={styles.horizontalLine} />
          </View>
          <View style={styles.weatherInfoContainer}>
            <View style={styles.weatherInfoItem}>
              <Feather name="wind" size={24} color="#03A9F4" />
              <Text style={styles.weatherInfoLabelText}>Wind</Text>
              <Text style={styles.weatherInfoText}>
                {weather.wind.speed} m/s
              </Text>
            </View>
            <View style={styles.weatherInfoItem}>
              <Feather name="droplet" size={24} color="#4CAF50" />
              <Text style={styles.weatherInfoLabelText}>Humidity</Text>
              <Text style={styles.weatherInfoText}>
                {weather.main.humidity}%
              </Text>
            </View>
            <View style={styles.weatherInfoItem}>
              <Feather name="sunrise" size={24} color="#FFC107" />
              <Text style={styles.weatherInfoLabelText}>Sunrise</Text>
              <Text style={styles.weatherInfoText}>
                {getISTTime(weather.sys.sunrise)}
              </Text>
            </View>
            <View style={styles.weatherInfoItem}>
              <Feather name="sunset" size={24} color="#FF5722" />
              <Text style={styles.weatherInfoLabelText}>Sunset</Text>
              <Text style={styles.weatherInfoText}>
                {getISTTime(weather.sys.sunset)}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    padding: 16,
    width: "80%",
    alignItems: "flex-start",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "flex-start",
  },
  locationText: {
    marginLeft: 8,
    fontSize: 18,
    color: "#607D8B",
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#424242",
  },
  tempRangeContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  tempRangeText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "left",
    color: "#757575",
  },
  dayTimeContainer: {
    marginBottom: 16,
    alignSelf: "stretch",
    alignItems: "flex-start",
  },
  dayTimeText: {
    fontSize: 16,
    textAlign: "left",
    color: "#757575",
  },
  horizontalLine: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 16,
    width: "100%",
  },
  weatherInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weatherInfoItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  weatherInfoLabelText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "#757575",
  },
  weatherInfoText: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    color: "#424242",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#757575",
  },
});

export default HomeScreen;