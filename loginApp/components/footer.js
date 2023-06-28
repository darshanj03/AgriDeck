import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome } from "@expo/vector-icons";

const Footer = ({ activePage, onChangePage }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={() => onChangePage("home")} style={styles.iconContainer}>
        <Ionicons
          name="md-home"
          size={24}
          color={activePage === "home" ? "blue" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangePage("test")} style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="leaf"
          size={24}
          color={activePage === "leaf" ? "blue" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangePage("plus")} style={styles.iconContainer}>
        <Entypo
          name="plus"
          size={24}
          color={activePage === "plus" ? "blue" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangePage("list")} style={styles.iconContainer}>
        <FontAwesome
          name="list-alt"
          size={24}
          color={activePage === "list" ? "blue" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChangePage("user")} style={styles.iconContainer}>
        <Ionicons
          name="person"
          size={24}
          color={activePage === "user" ? "blue" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: "center",
  },
});

export default Footer;
