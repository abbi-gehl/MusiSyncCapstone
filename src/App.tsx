import React from 'react';
import LandingPage from "./screens/LandingPage";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "nativewind"
import "../global.css"
import { TCPProvider } from './service/TCPProvider';

const App = () => {
  return (
      <SafeAreaProvider>
        <TCPProvider>
          <LandingPage />
        </TCPProvider>
      </SafeAreaProvider>
  );
};

export default App;
