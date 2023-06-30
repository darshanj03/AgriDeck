import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, useWindowDimensions, PanResponder, Animated, SafeAreaView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
    </View>
  );
};

const UserScreen = () => {
  return (
    <View style={styles.container}>
      <Text>wonderful</Text>
    </View>
  );
};

const LeafScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Explore the Leaf Screen here!</Text>
    </View>
  );
};

const PlusScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Add something on the Plus Screen!</Text>
    </View>
  );
};

export default function HomeTest() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const windowWidth = useWindowDimensions().width;
    const sidebarWidth = windowWidth * 0.7;
    const navigation = useNavigation();
    const [activePage, setActivePage] = useState("Home1");
  
    const handleLogout = () => {
      console.log("lion");
    }
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const handlePageChange = (page) => {
      setActivePage(page);
      navigation.navigate(page); // Navigate to the selected screen
    };
  
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dx > 50) {
          setIsSidebarOpen(true);
        } else if (gestureState.dx < -50) {
          setIsSidebarOpen(false);
        }
      },
      onPanResponderRelease: () => {},
    });
  
    const screens = {
      Home1: <HomeScreen />,
      User: <UserScreen />,
      Leaf: <LeafScreen />,
      Plus: <PlusScreen />,
    };
  
    const renderScreen = (screenName) => {
      return screens[screenName] || null;
    };
  
    const renderIcon = (page, iconName) => {
      const isActive = activePage === page;
  
      return (
        <TouchableOpacity
          style={[styles.iconContainer, isActive && styles.activeIconContainer]}
          onPress={() => handlePageChange(page)}
        >
          <Ionicons
            name={iconName}
            size={24}
            color={isActive ? "blue" : "black"}
          />
        </TouchableOpacity>
      );
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={() => setIsSidebarOpen(false)}>
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
            </View>
            {/* {renderScreen(activePage)} */}
            <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name="Home1" component={HomeScreen} />
            <Stack.Screen name="User" component={UserScreen} />
            <Stack.Screen name="Leaf" component={LeafScreen} />
            <Stack.Screen name="Plus" component={PlusScreen} />
        </Stack.Navigator>
          </View>
        </TouchableWithoutFeedback>

        {isSidebarOpen && (
          <View style={styles.sidebar} {...panResponder.panHandlers}>
            {/* Sidebar content */}
            <View style={styles.sidebarContent}>
              <Text style={styles.sidebarText}>Sidebar</Text>
            </View>
          </View>
        )}
        {isSidebarOpen && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
        <View style={styles.footer}>
          {renderIcon("Home1", "home")}
          {renderIcon("User", "person")}
          {renderIcon("Leaf", "leaf")}
          {renderIcon("Plus", "add")}
        </View>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  sidebarContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 60,
    backgroundColor: "#f0f0f0",
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
    color: "#000",
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeIconContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "blue",
  },
});
