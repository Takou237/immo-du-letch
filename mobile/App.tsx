import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LangProvider } from './src/i18n/LangContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </LangProvider>
    </SafeAreaProvider>
  );
}

export default App;
