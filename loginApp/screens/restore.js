import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import auth from '../config/firebaseConfig';
import { useNavigation } from "@react-navigation/native";

function RestorePage(props) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null); // null: not sent, true: success, false: error
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Forgot Password', 'Please enter your email to reset the password');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetStatus(true); // Success: email sent
    } catch (error) {
      setResetStatus(false); // Error: email not found or other error
      Alert.alert('Forgot Password Error', 'The entered email is invalid');
    }

    setLoading(false);
    setShowPopup(true);
  };

  const loginNavigation = () => {
    navigation.navigate('Login');
  }

  const handleContinue = () => {
    setShowPopup(false);
    setResetStatus(null);
    loginNavigation();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={loginNavigation}>
          <Ionicons name="close-circle" style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.restorePassword}>Restore Password</Text>
      <Text style={styles.enterTheEmail}>
        Enter the registered email below to receive instructions for resetting your password
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#808080"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      <Modal visible={showPopup} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.emailCheckContainer}>
            <Text style={styles.emailCheckTitle}>Check your email</Text>
            <Text style={styles.emailCheckText}>An email has been sent to your email address</Text>
            <TouchableOpacity style={styles.emailCheckButton} onPress={handleContinue}>
              <Text style={styles.emailCheckButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
    zIndex: 1, // Ensure the header is above the modal
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 20,
  },
  restorePassword: {
    fontSize: 29,
    marginLeft: 15,
    marginTop: 40,
    alignSelf: "flex-start",
    zIndex: 1, // Ensure the text is above the modal
  },
  enterTheEmail: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 30,
    textAlign: "left",
    fontSize: 16,
    alignSelf: "flex-start",
    zIndex: 1, // Ensure the text is above the modal
  },
  inputContainer: {
    width: 365,
    height: 46,
    backgroundColor: "#E6E6E6",
    marginTop: 22,
    paddingHorizontal: 10,
    alignSelf: "center",
    zIndex: 1, // Ensure the input is above the modal
  },
  input: {
    flex: 1,
    color: "#121212",
    fontSize: 16,
  },
  button: {
    width: 365,
    height: 50,
    backgroundColor: "#E6E6E6",
    marginTop: 17,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    zIndex: 1, // Ensure the button is above the modal
  },
  buttonText: {
    color: "#121212",
    textAlign: "center",
    fontSize: 16,
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

export default RestorePage;
