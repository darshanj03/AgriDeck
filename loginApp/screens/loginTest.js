import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../config/firebaseConfig";

function LoginScreen(props) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBackPress = () => {
    navigation.navigate("GetStarted");
  };

  useEffect(() => {
    // Load the stored credentials on component mount
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");

      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    } catch (error) {
      console.log("Error loading stored credentials:", error);
    }
  };

  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }
    } catch (error) {
      console.log("Error saving credentials:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Login Error", "Please enter your email and password");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (rememberMe) {
        await saveCredentials();
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }
      navigation.navigate("Home", { email });
    } catch (error) {
      Alert.alert("Login Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("Restore");
  };

  const handleRegistration = () => {
    navigation.navigate("Register");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/leaf.jpg")}
        resizeMode="contain"
        style={styles.image}
      />
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.welcomeBack}>Welcome Back</Text>
        <Text style={styles.loginText}>Login to your account</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Ionicons name="md-mail" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="rgba(159, 159, 159, 1)"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="md-lock-closed" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="rgba(159, 159, 159, 1)"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              style={styles.eyeIconContainer}
            >
              <Ionicons
                name={showPassword ? "md-eye-off" : "md-eye"}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rememberRow}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
              style={styles.rememberContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  rememberMe
                    ? styles.checkedCheckbox
                    : styles.uncheckedCheckbox,
                ]}
              />
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegistration}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.overlayText}>Logging in...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  uncheckedCheckbox: {
    backgroundColor: "transparent",
  },
  checkedCheckbox: {
    backgroundColor: "#3366CC",
    borderColor: "#3366CC",
  },
  rememberText: {
    color: "rgba(87, 87, 87, 1)",
    fontSize: 14,
    marginTop: 5,
  },
  forgotText: {
    color: "rgba(87, 87, 87, 1)",
    fontSize: 13,
    marginLeft: "auto",
    marginTop: 5,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  image: {
    width: 481,
    height: 320,
    marginLeft: -21,
  },
  welcomeBack: {
    fontSize: 30,
    marginTop: 40,
    alignSelf: "center",
    letterSpacing: 1,
    fontWeight: 500,
  },
  loginText: {
    fontSize: 15,
    color: "rgba(87, 87, 87, 1)",
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: "90%", // Adjust the width as desired
    marginTop: 40,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "rgba(233,233,233,1)",
    borderRadius: 10,
    marginTop: 14,
  },
  inputIcon: {
    color: "rgba(128, 128, 128, 1)",
    fontSize: 20,
    height: 23,
    width: 20,
    marginLeft: 5,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    height: 50,
  },
  buttonContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "rgba(0,0,0,1)",
    borderRadius: 15,
    width: 353,
    height: 47,
    marginTop: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  signupText: {
    marginTop: 20,
    color: "rgba(87, 87, 87, 1)",
    fontSize: 15,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  eyeIconContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    color: "rgba(128, 128, 128, 1)",
    fontSize: 20,
    height: 23,
    width: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  overlayText: {
    color: "white",
    fontSize: 18,
    marginTop: 20,
  },
});

export default LoginScreen;
