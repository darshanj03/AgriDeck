import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

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
        <Text style={styles.weatherText}>
          Place: {placeName}
          {"\n"}
          Weather: {weather.weather[0].main}, Temperature: {(
            weather.main.temp - 273.15
          ).toFixed(2)}
          °C, H: {(weather.main.temp_max - 273.15).toFixed(2)}°C, L: {(
            weather.main.temp_min - 273.15
          ).toFixed(2)}
          °C
          {"\n"}
          Sunrise: {getISTTime(weather.sys.sunrise)},
          Sunset: {getISTTime(weather.sys.sunset)}
          {"\n"}
          Wind: {weather.wind.speed} m/s
          {"\n"}
          Current Time: {getISTTime(currentTime.getTime() / 1000)}
          Current Day: {getCurrentDay()}
        </Text>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherText: {
    fontSize: 18,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default HomeScreen;
