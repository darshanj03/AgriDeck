import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from "../config/firebaseDB";
import Footer from "../components/footer";
import { useNavigation } from "@react-navigation/native";

const TestScreen = ({ route }) => {
  const navigation = useNavigation()
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState('');
  const [activePage, setActivePage] = useState("Test");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.thingspeak.com/channels/2127677/feeds.json?api_key=8WE38UY0H9I2WXNL&results=1"
        );
        const responseData = response.data;

        if (responseData && responseData.feeds && responseData.feeds.length > 0) {
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

  const handleChangePage = (page) => {
    setActivePage(page);
    // Perform additional actions based on the page change if needed
    if (page === "test") {
      navigation.navigate("Test"); // Replace "TestScreen" with the appropriate screen name for the "test.js" file
    }
    else if (page == "home") {
      navigation.navigate("Home")
    }
  };

  return (
    <View style={styles.container}>
      
      {data ? (
        <View style={styles.content}>
          <Text>Temperature: {Number(data.field1).toFixed(2)} °C</Text>
          <Text>Humidity: {Number(data.field2).toFixed(2)} %</Text>
          <Text>Pressure: {Number(data.field3).toFixed(2)} HPa</Text>
          <Text>Altitude: {Math.round(Number(data.field4))} m</Text>
          <Text>Air Quality: {Math.round(Number(data.field5))} AQI</Text>
          <Text>Soil Moisture: {Math.round(Number(data.field6))} %</Text>
        </View>
      ) : (
        <Text>Loading data...</Text>
      )}
      <Footer activePage={activePage} onChangePage={handleChangePage}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  userName: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TestScreen;
