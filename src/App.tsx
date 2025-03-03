import React from 'react';
import LandingPage from "./screens/LandingPage";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "nativewind"
import "../global.css"

const App = () => {
  return (
      <SafeAreaProvider>
        <LandingPage/>
      </SafeAreaProvider>
  );
};

export default App;
