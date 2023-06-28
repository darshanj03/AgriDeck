import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '../config/firebaseConfig';
import db from '../config/firebaseDB';
import { Ionicons } from "@expo/vector-icons";

export default function RegistrationScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleBackPress = () => {
    navigation.navigate('GetStarted');
  };

  const handleRegistration = async () => {
    if (!name || !age || !phoneNumber || !email || !password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
  
    try {
      // Create an account with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save user details to Firestore collection
      await addDoc(collection(db, 'users'), {
        name,
        age,
        phoneNumber,
        email,
        userId: user.uid, // Link the user's email with the document using a userId field
      });
  
      Alert.alert('Registration Successful', 'Successfully created an account');
      navigation.navigate('Home', { email }); // Navigate to the Home screen after successful registration
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333333" />
      </TouchableOpacity>
      <Text style={styles.heading}>Registration</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999999"
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor="#999999"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999999"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999999"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999999"
        />
        <Button title="Register" onPress={handleRegistration} color="#FF6F61" />
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>Already have an account? Click here to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginLeft: 16,
    marginTop: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#333333',
  },
  loginText: {
    marginTop: 10,
    color: '#3366CC',
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
});
