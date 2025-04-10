import React from 'react';
import LandingPage from "./screens/LandingPage";
import HomePage from "./screens/HomePage";
import ChooseFilePage from "./screens/ChooseFilePage";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import "nativewind"
import "../global.css"
import { TCPProvider } from './service/TCPProvider';
import { RealmProvider } from "@realm/react";
import { Host } from "../db/schema"; // Import your Realm schema

const Stack = createStackNavigator();


const App = () => {
  return (
      <SafeAreaProvider>
        <RealmProvider schema={[Host]}>
          <TCPProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="LandingPage">
                <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown: false}}/>
                <Stack.Screen name="HomePage" component={HomePage} options={{headerShown: false}} />
                <Stack.Screen name="ChooseFilePage" component={ChooseFilePage} options={{headerShown: false}} />
              </Stack.Navigator>
            </NavigationContainer>
          </TCPProvider>
        </RealmProvider>
      </SafeAreaProvider>
  );
};

export default App;
