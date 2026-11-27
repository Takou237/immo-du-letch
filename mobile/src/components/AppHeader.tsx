import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, User } from 'lucide-react-native';
import { colors, spacing } from '../theme';
import { useLang } from '../i18n/LangContext';
import { useNotifications } from '../hooks/useNotifications';
import { RootStackParamList } from '../navigation/types';

interface AppHeaderProps {
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export function AppHeader({
  unreadNotifications,
  onNotificationsPress,
  onProfilePress,
}: AppHeaderProps) {
  const { t } = useLang();
  const { unreadCount } = useNotifications();
  const badgeCount = unreadNotifications ?? unreadCount;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleProfilePress = onProfilePress ?? (() => navigation.navigate('Profile'));
  const handleNotificationsPress = onNotificationsPress ?? (() => navigation.navigate('Notifications'));

  return (
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top - 8, 4) }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>

        {/* ── Logo gauche ── */}
        <Image
          source={require('../../immo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="IMMO DU LETCH"
        />

        {/* ── Icônes droite ── */}
        <View style={styles.actions}>

          {/* Notifications */}
          <TouchableOpacity
            onPress={handleNotificationsPress}
            style={styles.iconBtn}
            activeOpacity={0.75}
            accessibilityLabel={t.header.notifications}
          >
            <Bell color="#0F172A" size={17} strokeWidth={1.9} />
            {badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badgeCount > 9 ? '9+' : badgeCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profil */}
          <TouchableOpacity
            onPress={handleProfilePress}
            style={styles.iconBtn}
            activeOpacity={0.75}
            accessibilityLabel={t.header.profile}
          >
            <User color="#0F172A" size={17} strokeWidth={1.9} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: 0,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },

  // Logo
  logo: {
    width: 100,
    height: 32,
  },

  // Icônes
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Badge rouge
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
