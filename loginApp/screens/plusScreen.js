import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlusScreen = () => {
  const [showPopUp, setShowPopUp] = useState(false);

  const handleOpenPopUp = () => {
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  return (
    <View style={styles.container}>
      <Text>Explore the Leaf Screen here!</Text>

      {/* Button to open the pop-up */}
      <TouchableOpacity style={styles.openPopUpButton} onPress={handleOpenPopUp}>
        <Text style={styles.openPopUpButtonText}>Open Pop-Up</Text>
      </TouchableOpacity>

      <Modal visible={showPopUp} transparent>
        <View style={styles.overlay}>
          <View style={styles.popUpContainer}>
            {/* Pop-up content */}
            <TouchableOpacity style={styles.closeButton} onPress={handleClosePopUp}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.popUpText}>This is a pop-up!</Text>
            {/* Add more content or components as needed */}
          </View>
        </View>
      </Modal>

      {/* Add the rest of your content/components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openPopUpButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#ccc',
  },
  openPopUpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popUpContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  popUpText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default PlusScreen;
