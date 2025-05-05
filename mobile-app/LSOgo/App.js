import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import CalendarScreen from './screens/CalendarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown: false}} >
          <Stack.Screen name='Splash' component={SplashScreen} />
          <Stack.Screen name='Calendar' component={CalendarScreen} />
    </Stack.Navigator>
      </NavigationContainer>
  );
}