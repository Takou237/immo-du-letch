import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, User } from 'lucide-react-native';
import { colors, spacing } from '../theme';
import { useLang } from '../i18n/LangContext';
import { RootStackParamList } from '../navigation/types';

interface AppHeaderProps {
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export function AppHeader({
  unreadNotifications = 0,
  onNotificationsPress,
  onProfilePress,
}: AppHeaderProps) {
  const { t } = useLang();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleProfilePress = onProfilePress ?? (() => navigation.navigate('Profile'));
  const handleNotificationsPress = onNotificationsPress ?? (() => navigation.navigate('Notifications'));

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
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
            <Bell color={colors.textOnNavy} size={18} strokeWidth={1.8} />
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profil */}
          <TouchableOpacity
            onPress={handleProfilePress}
            style={[styles.iconBtn, styles.profileBtn]}
            activeOpacity={0.75}
            accessibilityLabel={t.header.profile}
          >
            <User color={colors.textOnNavy} size={18} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.navy,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 3,
    backgroundColor: colors.navy,
  },

  // Logo
  logo: {
    width: 96,
    height: 28,
  },

  // Icônes
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
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
