import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SidebarMenu = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.menuItem}>Menu Item 1</Text>
      <Text style={styles.menuItem}>Menu Item 2</Text>
      <Text style={styles.menuItem}>Menu Item 3</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: 200,
    height: '100%',
    paddingTop: 50,
    paddingLeft: 20,
    zIndex: 3,
  },
  menuItem: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default SidebarMenu;