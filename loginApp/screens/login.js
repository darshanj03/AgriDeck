import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import auth from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegistrationScreen from './registration';
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleBackPress = () => {
    navigation.navigate('GetStarted');
  };

  useEffect(() => {
    // Load the stored credentials on component mount
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');

      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    } catch (error) {
      console.log('Error loading stored credentials:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
      }
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login Error', 'Please enter your email and password');
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        await saveCredentials();
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
      }

      Alert.alert('Login Successful');
      navigation.navigate('Home', { email });
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleForgotPassword = async () => {
  //   if (!email) {
  //     Alert.alert('Forgot Password', 'Please enter your email to reset the password');
  //     return;
  //   }

  //   try {
  //     await sendPasswordResetEmail(auth, email);
  //     Alert.alert('Password Reset Email Sent', 'Please check your email for password reset instructions.');
  //   } catch (error) {
  //     Alert.alert('Forgot Password Error', error.message);
  //   }
  // };

  const handleForgotPassword = () => {
    navigation.navigate('Restore')
  }

  const handleRegistration = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333333" />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
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
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, rememberMe && styles.checkedCheckbox]} />
            <Text style={styles.checkboxLabel}>Remember Me</Text>
          </View>
        </TouchableOpacity>
        <Button title={isLoading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={isLoading} color="#FF6F61" />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegistration}>
          <Text style={styles.registrationText}>New user? Click here to register</Text>
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
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
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
  registrationText: {
    marginTop: 10,
    color: '#3366CC',
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: '#3366CC',
    borderColor: '#3366CC',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333333',
  },
  forgotPasswordText: {
    marginTop: 10,
    color: '#3366CC',
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
});
