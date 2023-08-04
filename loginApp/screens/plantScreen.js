import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, Image, SafeAreaView } from "react-native";
import { Ionicons, Entypo, MaterialCommunityIcons } from "react-native-vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

function PlantScreen(props) {
    const navigation = useNavigation()
    const [data, setData] = useState(null);
    const [userName, setUserName] = useState('');

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

  const ProgressCircle = ({ progress, iconName }) => {
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <View style={styles.progressCircleContainer}>
        <Svg width={radius * 4} height={radius * 4}>
          <Circle
            cx={radius * 2}
            cy={radius * 2}
            r={radius}
            stroke="rgba(128, 128, 128, 0.5)"
            strokeWidth="2"
            fill="transparent"
          />
          <Circle
            cx={radius * 2}
            cy={radius * 2}
            r={radius}
            stroke="#00cc00"
            strokeWidth="2"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
          />
          {iconName && (
            <View style={[styles.iconContainer, { top: radius * 1.5, left: radius * 1.5 }]}>
              <MaterialCommunityIcons name={iconName} style={styles.icon} />
            </View>
          )}
        </Svg>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="ios-arrow-back" style={styles.icon} />
      </View>
      <View style={styles.content}>
        <View style={styles.imageSection}>
          <Image
            source={require("../assets/images/tomato-pic.jpeg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Tomato</Text>
          <Text style={styles.description}>
            The tomato plant is widely cultivated for its delicious fruit, the tomato,
            which also offers health benefits due to its rich content of vitamins, minerals,
            and antioxidants, supporting heart health and boosting the immune system.
          </Text>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.row}>
            <View style={styles.infoItem}>
              <ProgressCircle progress={1} iconName="water" />
              <Text style={styles.infoText}>Soil Moisture</Text>
            </View>
            <View style={styles.infoItem}>
              <ProgressCircle progress={0.5} iconName="thermometer" />
              <Text style={styles.infoText}>Temperature</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.infoItem}>
              <ProgressCircle progress={0.8} iconName="water-outline" />
              <Text style={styles.infoText}>Humidity</Text>
            </View>
            <View style={styles.infoItem}>
              <ProgressCircle progress={0.3} iconName="gauge" />
              <Text style={styles.infoText}>Pressure</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(226, 251, 226, 1)",
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  icon: {
    color: "rgba(6, 6, 6, 1)",
    fontSize: 40,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  image: {
    width: 260,
    height: 260,
  },
  section: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 35,
    color: "#121212",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 20,
    color: "#121212",
    textAlign: "center",
  },
  infoSection: {
    flex: 1, // Make the infoSection stretch to the bottom
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    padding: 10,
  },
  infoText: {
    fontSize: 12,
    color: "#121212",
  },
  progressCircleContainer: {
    padding: 5, // Add padding to the container
  },
  iconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: -7.5 }, { translateY: -7.5 }],
  },
  icon: {
    fontSize: 20,
    color: "#00cc00",
  },
});

export default PlantScreen;
