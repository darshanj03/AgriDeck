// import React, { useEffect, useState } from "react";
// import { View, Text } from "react-native";
// import axios from "axios";

// const TestScreen = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://api.thingspeak.com/channels/2127677/feeds.json?api_key=8WE38UY0H9I2WXNL&results=1"
//         );
//         const responseData = response.data;

//         if (responseData && responseData.feeds && responseData.feeds.length > 0) {
//           const latestData = responseData.feeds[0];
//           setData(latestData);
//         }
//       } catch (error) {
//         console.log("Error fetching data from ThingSpeak", error);
//       }
//     };

//     fetchData();

//     const interval = setInterval(() => {
//       fetchData();
//     }, 60000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <View>
//       {data ? (
//         <View>
//           <Text>Temperature: {Number(data.field1).toFixed(2)} °C</Text>
//           <Text>Humidity: {Number(data.field2).toFixed(2)} %</Text>
//           <Text>Pressure: {Number(data.field3).toFixed(2)} HPa</Text>
//           <Text>Altitude: {Math.round(Number(data.field4))} m</Text>
//           <Text>Air Quality: {Math.round(Number(data.field5))} AQI</Text>
//           <Text>Soil Moisture: {Math.round(Number(data.field6))} %</Text>
//           {/* Add more fields as needed */}
//         </View>
//       ) : (
//         <Text>Loading data...</Text>
//       )}
//     </View>
//   );
// };

// export default TestScreen;
