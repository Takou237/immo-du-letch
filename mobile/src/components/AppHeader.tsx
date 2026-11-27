import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageSquare, Bell, User } from 'lucide-react-native';
import { colors, spacing } from '../theme';
import { useLang } from '../i18n/LangContext';
import { RootStackParamList } from '../navigation/types';

interface AppHeaderProps {
  unreadMessages?: number;
  unreadNotifications?: number;
  onMessagesPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export function AppHeader({
  unreadMessages = 0,
  unreadNotifications = 0,
  onMessagesPress,
  onNotificationsPress,
  onProfilePress,
}: AppHeaderProps) {
  const { t, toggleLang } = useLang();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleProfilePress = onProfilePress ?? (() => navigation.navigate('Profile'));

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>

        {/* ── Logo gauche ── */}
        <View style={styles.logoRow}>
          {/* Carré rouge accent (inspiré de mobile.de) */}
          <View style={styles.logoAccent} />
          <Text style={styles.logoText}>IMMO DU LETCH</Text>
        </View>

        {/* ── Icônes droite ── */}
        <View style={styles.actions}>

          {/* Switch langue FR / EN */}
          <TouchableOpacity
            onPress={toggleLang}
            style={styles.langBtn}
            activeOpacity={0.75}
            accessibilityLabel={t.common.langToggle}
          >
            <Text style={styles.langText}>{t.common.langToggle}</Text>
          </TouchableOpacity>

          {/* Messages */}
          <TouchableOpacity
            onPress={onMessagesPress}
            style={styles.iconBtn}
            activeOpacity={0.75}
            accessibilityLabel={t.header.messages}
          >
            <MessageSquare color={colors.textOnNavy} size={22} strokeWidth={1.8} />
            {unreadMessages > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            onPress={onNotificationsPress}
            style={styles.iconBtn}
            activeOpacity={0.75}
            accessibilityLabel={t.header.notifications}
          >
            <Bell color={colors.textOnNavy} size={22} strokeWidth={1.8} />
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
            <User color={colors.textOnNavy} size={22} strokeWidth={1.8} />
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
    paddingVertical: 12,
    backgroundColor: colors.navy,
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoAccent: {
    width: 10,
    height: 24,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Icônes
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
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

  // Bouton langue
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gold,
    marginRight: 4,
  },
  langText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
