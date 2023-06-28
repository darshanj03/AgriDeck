import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetStartedScreen from './screens/getStartedScreen';
import LoginScreen from './screens/login';
import RegisterScreen from './screens/registration';
import HomeScreen from './screens/home';
import TestScreen from './screens/test';
import Restorepage from './screens/restore';

const Stack = createStackNavigator();

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    checkIfFirstTime();
  }, []);

  const checkIfFirstTime = async () => {
    try {
      const value = await AsyncStorage.getItem('@app:isFirstTime');
      setIsFirstTime(value === null);
    } catch (error) {
      console.log('Error checking first time:', error);
    }
  };

  const setNotFirstTime = async () => {
    try {
      await AsyncStorage.setItem('@app:isFirstTime', 'false');
    } catch (error) {
      console.log('Error setting not first time:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isFirstTime ? 'GetStarted' : 'Login'} 
        screenOptions={{ 
          headerShown: false 
        }}
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} 
          options={{
            title: 'Get Started',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Login" component={LoginScreen} 
          options={{
            title: 'Login',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} 
          options={{
            title: 'Register',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Restore" component={Restorepage} 
          options={{
            title: 'Test',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} 
          options={({ route }) => ({
            title: 'Home',
            headerTitleAlign: 'center',
            headerLeft: null,
            email: route.params?.email,
          })}
          listeners={({ navigation }) => ({
            beforeRemove: () => {
              setNotFirstTime();
              navigation.removeListener('beforeRemove');
            },
          })}
        />
        <Stack.Screen name="Test" component={TestScreen} 
          options={{
            title: 'Test',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
