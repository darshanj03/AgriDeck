import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const AddScreen = ({ route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="x-circle" style={styles.icon} />
        <Text style={styles.restorePassword}>Restore Password</Text>
        <Text style={styles.enterTheEmail}>
          Enter the registered email below to receive instructions for{"\n"}
          resetting your password
        </Text>
        <View style={styles.rect}>
          <Text style={styles.email}>Email</Text>
        </View>
        <View style={styles.rect2}>
          <Text style={styles.send}>Send</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    marginBottom: 30,
  },
  restorePassword: {
    color: "#121212",
    fontSize: 29,
    marginBottom: 30,
  },
  enterTheEmail: {
    color: "#121212",
    textAlign: "center",
    marginBottom: 30,
  },
  rect: {
    width: 365,
    height: 46,
    backgroundColor: "#E6E6E6",
    marginBottom: 15,
    justifyContent: "center",
    paddingLeft: 15,
  },
  email: {
    color: "#121212",
  },
  rect2: {
    width: 365,
    height: 50,
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
    paddingLeft: 15,
  },
  send: {
    color: "#121212",
  },
});

export default AddScreen;
