import React from 'react';
import LandingPage from "./screens/LandingPage";
import HomePage from "./screens/HomePage";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import "nativewind"
import "../global.css"
import { TCPProvider } from './service/TCPProvider';

const Stack = createStackNavigator();


const App = () => {
  return (
      <SafeAreaProvider>
        <TCPProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="LandingPage">
                <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown: false}}/>
                <Stack.Screen name="HomePage" component={HomePage} options={{headerShown: false}} />
            </Stack.Navigator>
          </NavigationContainer>
        </TCPProvider>
      </SafeAreaProvider>
  );
};

export default App;
