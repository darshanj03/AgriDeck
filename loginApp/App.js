import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
//import HomeScreen from './screens/home';
import TestScreen from './screens/test';
import ModelScreen from './screens/3dtest';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={ModelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
