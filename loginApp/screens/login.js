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
  Animated,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import auth from "../config/firebaseConfig";

function LoginScreen(props) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordAnimation] = useState(new Animated.Value(0));
  const [overlayVisible, setOverlayVisible] = useState(false); // Add overlayVisible state
  const [loading, setLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState(null); // null: not sent, true: success, false: error
  const [showPopup, setShowPopup] = useState(false);

  const handleBackPress = () => {
    navigation.navigate("GetStarted");
  };

  const loginNavigation = () => {
    navigation.navigate('Login');
  }

  const handleContinue = () => {
    setOverlayVisible(false);
    setShowPopup(false);
    setResetStatus(null);
    loginNavigation();
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
    if (!email) {
      Alert.alert("Forgot Password", "Please enter your email");
      return;
    }
    setShowForgotPassword(true);
    Animated.timing(forgotPasswordAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setOverlayVisible(true); // Show the overlay when block is opened
  };

  const handleForgotPasswordDismiss = () => {
    Animated.timing(forgotPasswordAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowForgotPassword(false);
      setOverlayVisible(false); // Hide the overlay when block is closed
    });
  };

  const handleRegistration = () => {
    navigation.navigate("Register");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    setShowForgotPassword(false);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetStatus(true); // Success: email sent
      setShowPopup(true);
    } catch (error) {
      setResetStatus(false); // Error: email not found or other error
      Alert.alert('Forgot Password Error', 'The entered email is invalid');
      setOverlayVisible(false);
    }
    setIsLoading(false);
  }

  const forgotPasswordTranslateY = forgotPasswordAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

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
              style={[styles.input, { paddingRight: 30 }]}
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
        <View style={[styles.overlay, {zIndex: 2}]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.overlayText}>Loading...</Text>
        </View>
      )}
      {showForgotPassword && (
        <Animated.View
          style={[
          styles.forgotPasswordContainer,
           {
             transform: [{ translateY: forgotPasswordTranslateY }],
             height: 350,
           },
          ]}
        >
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleForgotPasswordDismiss}
          >
            <Ionicons name="md-close" style={styles.dismissIcon} />
          </TouchableOpacity>
          <Text style={styles.forgotPasswordTitle}>Forgot Password?</Text>
          <Text style={styles.forgotPasswordText}>
          Enter the registered email below to receive instructions for resetting your password
          </Text>
          <View style={styles.inputRow}>
            <Ionicons name="md-mail" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="rgba(159, 159, 159, 1)"
              autoCapitalize="none"
              editable={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.resetPasswordButton]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {overlayVisible && <View style={styles.overlay} />}
      <Modal visible={showPopup} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.emailCheckContainer}>
            <Text style={styles.forgotPasswordTitle}>Check your email</Text>
            <Text style={styles.forgotPasswordText}>An email has been sent to your email address with password reset instructions</Text>
            <TouchableOpacity style={[styles.resetPasswordButton, {marginBottom: 15}]} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 10,
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
    position: "absolute",
    right: 10,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
  },
  forgotPasswordContainer: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 1,
    borderRadius: 25,
  },
  dismissButton: {
    alignSelf: "flex-end",
    marginTop: -10,
  },
  dismissIcon: {
    color: "rgba(41, 45, 50, 1)",
    fontSize: 25,
  },
  forgotPasswordTitle: {
    fontSize: 25,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  forgotPasswordText: {
    fontSize: 15,
    color: "rgba(87, 87, 87, 0.8)",
    marginBottom: 15,
  },
  resetPasswordButton: {
    marginTop: 15,
    backgroundColor: "rgba(0, 0, 0, 1)",
    borderRadius: 15,
    width: 353,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  emailCheckContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  emailCheckTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 10,
  },
  emailCheckText: {
    fontSize: 16,
    color: "#121212",
    marginBottom: 20,
  },
  emailCheckButton: {
    backgroundColor: "#E6E6E6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emailCheckButtonText: {
    fontSize: 16,
    color: "#121212",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure the loading container is above the modal
  },
});

export default LoginScreen;