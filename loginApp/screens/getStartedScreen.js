import React from 'react';
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';

const GetStartedScreen = ({ navigation }) => {
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to the Get Started Page!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLoginPress} color="#FF6F61" />
        <Button title="Register" onPress={handleRegisterPress} color="#FFA5AB" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333333',
  },
  buttonContainer: {
    width: '70%',
    justifyContent: 'space-between',
  },
});

export default GetStartedScreen;
