/**
 * App.tsx — Point d'entrée IMMO DU LETCH Mobile.
 * Utilise AppProvider (LangProvider + ListingsProvider + FavoritesProvider).
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/providers/AppProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
