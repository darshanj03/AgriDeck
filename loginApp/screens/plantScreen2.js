import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const PlantScreen2 = (props) => {
    const navigation = useNavigation()
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleBack = () => {
    navigation.navigate('Home');
  }

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
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Update the progress every 1 minute
    const progressInterval = setInterval(() => {
      const newProgress = Math.round(Number(data?.field6)) // Replace with your logic to update the progress
      setProgress(newProgress);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rectStack}>
        <View style={styles.rect}>
          <View style={styles.header}>
            <Icon name="ios-arrow-back" style={styles.icon} onPress={handleBack}/>
            <View style={styles.titleContainer}>
              <Text style={styles.plantTitle}>Tomato Plant</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/My_project-2.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Temperature</Text>
              <Text style={styles.infoValue}>{Number(data?.field1).toFixed(2)} °C</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Humidity</Text>
              <Text style={styles.infoValue}>{Number(data?.field2).toFixed(2)} %</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Pressure</Text>
              <Text style={styles.infoValue}>{Number(data?.field3).toFixed(2)} HPa</Text>
            </View>
          </View>
        </View>
        <View style={styles.rect2}>
          <Text style={styles.soilMoisture}>Soil Moisture</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressValue, { width: `${Math.round(Number(data?.field6))}%` }]} />
            </View>
            <Text style={styles.progressText}>{`${Math.round(Number(data?.field6))}%`}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rectStack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rect: {
    width: 414,
    height: 632,
    backgroundColor: "rgba(243,242,242,1)",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    marginTop: 60,
    flexDirection: "column",
    alignItems: "left",
  },
  icon: {
    color: "rgba(41, 45, 50, 1)",
    fontSize: 30,
  },
  titleContainer: {
    marginTop: 10,
    justifyContent: "flex-start",
  },
  plantTitle: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 30,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 436,
    height: 436,
    alignSelf: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    color: "#121212",
  },
  infoValue: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },
  rect2: {
    width: 414,
    height: 273,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 5,
      height: 2,
    },
    elevation: 30,
    shadowOpacity: 1,
    shadowRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  soilMoisture: {
    color: "#121212",
    fontSize: 25,
    marginBottom: 20,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#E6E6E6",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressValue: {
    height: "100%",
    backgroundColor: "rgba(35, 181, 238, 1)",
  },
  progressText: {
    marginLeft: 10,
    color: "#121212",
    fontWeight: "bold",
  },
});

export default PlantScreen2;
