import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import auth from "../config/firebaseConfig";
import db from "../config/firebaseDB";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function RegistrationScreen() {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateLogin = () => {
    navigation.navigate("Login");
  };

  const handleBackPress = () => {
    navigation.navigate("GetStarted");
  };

  const handleRegistration = async () => {
    if (!name || !phoneNumber || !email || !password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    try {
      setLoading(true); // Set loading state to true
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        name,
        phoneNumber,
        email,
        userId: user.uid,
      });

      Alert.alert("Registration Successful", "Successfully created an account");
      navigation.navigate("Home", { email });
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.register}>Register</Text>
            <Text style={[styles.subText, { marginTop: 10 }]}>
              Create your new account
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/single-leaf.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Ionicons name="person" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="rgba(159, 159, 159, 1)"
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="call" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholderTextColor="rgba(159, 159, 159, 1)"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="mail" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="rgba(159, 159, 159, 1)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="md-lock-closed" style={styles.inputIcon} />
              <View style={styles.passwordContainer}>
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
            </View>

            <View style={styles.registerButton}>
              <TouchableOpacity onPress={handleRegistration}>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={navigateLogin}>
              <Text style={[styles.subText, { marginTop: 15, textDecorationLine: "underline", }]}>
                Already have an account? Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.overlayText}>Loading</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  icon: {
    color: "rgba(41, 45, 50, 1)",
    fontSize: 30,
  },
  contentContainer: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  register: {
    fontSize: 40,
    letterSpacing: 1,
    fontWeight: "600",
  },
  subText: {
    fontSize: 15,
    color: "rgba(87, 87, 87, 1)",
  },
  imageContainer: {
    position: "absolute",
    top: -25,
    right: -50,
    flex: 1,
    alignItems: "flex-start", // Align the image to the right
  },
  image: {
    width: 150,
    height: 150,
    transform: [{ rotate: "-70.00deg" }],
    marginLeft: 1,
    marginTop: 20,
    shadowColor: "rgba(0, 0, 0, 0.9)",
    shadowOpacity: 0.5,
    shadowOffset: { width: -4, height: 4 },
    shadowRadius: 8,
  },
  inputContainer: {
    width: "100%",
    marginTop: 50,
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "rgba(233,233,233,0.7)",
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
    marginLeft: 10,
    color: "black",
    flex: 1,
    height: 50,
  },
  passwordContainer: {
    flex: 1,
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIconContainer: {
    marginLeft: 10,
  },
  eyeIcon: {
    fontSize: 20,
    color: "rgba(128, 128, 128, 1)",
  },
  registerButton: {
    width: 353,
    height: 47,
    backgroundColor: "rgba(0, 0, 0, 1)",
    borderRadius: 15,
    marginTop: 134,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 25,
    letterSpacing: 2,
    fontFamily: "System",
  },
  loadingOverlay: {
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

export default RegistrationScreen;
