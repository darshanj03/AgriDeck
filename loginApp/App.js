import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetStartedScreen from './screens/getStartedScreen';
import HomeScreen from './screens/home';
import TestScreen from './screens/test';
import LoignScreen from './screens/login';
import RegistrationScreen from './screens/registration';
import HomeTest from './screens/homeTest';
import PlantScreen2 from './screens/plantScreen2';

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
        <Stack.Screen name="Login" component={LoignScreen} 
          options={{
            title: 'Login',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Register" component={RegistrationScreen} 
          options={{
            title: 'Register',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Home" component={HomeTest} 
          options={({ route }) => ({
            title: 'Home',
            headerTitleAlign: 'center',
            headerLeft: null,
            email: route.params?.email,
            gestureEnabled: false
          })}
          listeners={({ navigation }) => ({
            beforeRemove: () => {
              setNotFirstTime();
              navigation.removeListener('beforeRemove');
            },
          })}
        />
        <Stack.Screen name="Plant" component={PlantScreen2} 
          options={{
            title: 'Test',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}