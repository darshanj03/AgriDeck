import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HamburgerSidebar = ({ isOpen, onToggle }) => {
  const statusBarHeight = StatusBar.currentHeight || 0;
  const sidebarTop = statusBarHeight + 16;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity
        style={[styles.sidebarButton, { top: sidebarTop }]}
        onPress={onToggle}
      >
        <Ionicons name={isOpen ? "ios-close" : "ios-menu"} size={24} color="black" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.sidebar}>
          {/* Sidebar Content */}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sidebarButton: {
    position: "absolute",
    top: 16,
    left: 1,
    zIndex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 2,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "80%", // Take 60% of the width of the screen
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Opaque background color
  },
});

export default HamburgerSidebar;
