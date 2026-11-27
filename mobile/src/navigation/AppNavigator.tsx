import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, Settings, Heart, PlusCircle } from 'lucide-react-native';
import { useLang } from '../i18n/LangContext';
import { useNotifications } from '../hooks/useNotifications';

import { MainTabParamList, RootStackParamList } from './types';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SellScreen } from '../screens/SellScreen';
import { ListingDetailScreen } from '../screens/ListingDetailScreen';
import { CompareScreen } from '../screens/CompareScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { FloatingCompareBubble } from '../components/FloatingCompareBubble';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const { t } = useLang();
  const { unreadCount } = useNotifications();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: colors.navy,
          borderTopColor: colors.navyLight,
          borderTopWidth: 1,
          height: 58 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingHorizontal: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t.nav.home,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: t.nav.search,
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: t.nav.favorites,
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Sell"
        component={SellScreen}
        options={{
          tabBarLabel: t.nav.sell,
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t.nav.settings,
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [currentRoute, setCurrentRoute] = useState<string | undefined>('MainTabs');

  const syncRoute = () => {
    const route = navigationRef.getCurrentRoute();
    setCurrentRoute(route?.name);
  };

  return (
    <View style={styles.root}>
      <NavigationContainer
        ref={navigationRef}
        onReady={syncRoute}
        onStateChange={syncRoute}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
          <Stack.Screen name="Compare" component={CompareScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <FloatingCompareBubble
        currentRouteName={currentRoute}
        onPress={() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Compare');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
