/**
 * SettingsScreen — IMMO DU LETCH Mobile
 * Paramètres de l'application : compte, langue FR/EN, notifications,
 * raccourcis (Messages, Comparateur), et informations de version.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Globe,
  Bell,
  GitCompare,
  Trash2,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

import { useLang } from '../i18n/LangContext';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingRowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
  right,
  danger,
}: SettingRowProps) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <ChevronRight color={colors.textMuted} size={18} /> : null)}
    </Container>
  );
}

export function SettingsScreen() {
  const { lang, toggleLang } = useLang();
  const { user } = useAuth();
  const navigation = useNavigation<NavProp>();
  const isFr = lang === 'fr';

  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newListingsAlerts, setNewListingsAlerts] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      isFr ? 'Réinitialiser les données' : 'Reset local data',
      isFr
        ? 'Voulez-vous effacer vos favoris, recherches sauvegardées et annonces locales ?'
        : 'Do you want to clear your favorites, saved searches, and local listings?',
      [
        { text: isFr ? 'Annuler' : 'Cancel', style: 'cancel' },
        {
          text: isFr ? 'Effacer' : 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                isFr ? 'Terminé' : 'Done',
                isFr
                  ? 'Les données locales ont été effacées.'
                  : 'Local data has been cleared.',
              );
            } catch {
              // Silencieux
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          {isFr ? 'Paramètres' : 'Settings'}
        </Text>
        <Text style={styles.pageSub}>
          {isFr
            ? 'Gérez votre compte, vos préférences et vos notifications.'
            : 'Manage your account, preferences, and notifications.'}
        </Text>

        {/* ── Compte ── */}
        <Text style={styles.sectionLabel}>
          {isFr ? 'COMPTE' : 'ACCOUNT'}
        </Text>
        <View style={styles.card}>
          <SettingRow
            icon={<User color={colors.navy} size={18} strokeWidth={2} />}
            iconBg="#EFF6FF"
            title={
              user
                ? user.name
                : isFr
                  ? 'Se connecter / Créer un compte'
                  : 'Sign in / Create account'
            }
            subtitle={
              user
                ? user.email
                : isFr
                  ? 'Accédez à votre profil et vos annonces'
                  : 'Access your profile and listings'
            }
            onPress={() => navigation.navigate('Profile')}
          />
        </View>

        {/* ── Préférences ── */}
        <Text style={styles.sectionLabel}>
          {isFr ? 'PRÉFÉRENCES' : 'PREFERENCES'}
        </Text>
        <View style={styles.card}>
          <SettingRow
            icon={<Globe color={colors.gold} size={18} strokeWidth={2} />}
            iconBg="#FEF3C7"
            title={isFr ? 'Langue de l’application' : 'App language'}
            subtitle={isFr ? 'Français (FR)' : 'English (EN)'}
            onPress={toggleLang}
            right={
              <View style={styles.langPill}>
                <Text style={styles.langPillText}>{lang.toUpperCase()}</Text>
              </View>
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<Bell color="#10B981" size={18} strokeWidth={2} />}
            iconBg="#D1FAE5"
            title={isFr ? 'Alertes baisse de prix' : 'Price drop alerts'}
            subtitle={
              isFr
                ? 'Être notifié sur vos biens favoris'
                : 'Get notified on your favorite properties'
            }
            right={
              <Switch
                value={priceAlerts}
                onValueChange={setPriceAlerts}
                trackColor={{ false: '#CBD5E1', true: colors.navy }}
                thumbColor={priceAlerts ? colors.gold : '#F8FAFC'}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<ShieldCheck color={colors.navy} size={18} strokeWidth={2} />}
            iconBg="#EFF6FF"
            title={isFr ? 'Nouveaux biens correspondants' : 'Matching new listings'}
            subtitle={
              isFr
                ? 'Selon vos recherches sauvegardées'
                : 'Based on your saved searches'
            }
            right={
              <Switch
                value={newListingsAlerts}
                onValueChange={setNewListingsAlerts}
                trackColor={{ false: '#CBD5E1', true: colors.navy }}
                thumbColor={newListingsAlerts ? colors.gold : '#F8FAFC'}
              />
            }
          />
        </View>

        {/* ── Raccourcis ── */}
        <Text style={styles.sectionLabel}>
          {isFr ? 'OUTILS & ACTIVITÉ' : 'TOOLS & ACTIVITY'}
        </Text>
        <View style={styles.card}>
          <SettingRow
            icon={<Bell color={colors.gold} size={18} strokeWidth={2} />}
            iconBg="#FEF3C7"
            title={isFr ? 'Notifications' : 'Notifications'}
            subtitle={isFr ? 'Historique de vos alertes' : 'Your alert history'}
            onPress={() => navigation.navigate('Notifications')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<GitCompare color="#7C3AED" size={18} strokeWidth={2} />}
            iconBg="#F3E8FF"
            title={isFr ? 'Comparateur de biens' : 'Property comparison'}
            subtitle={isFr ? 'Comparer jusqu’à 3 annonces' : 'Compare up to 3 listings'}
            onPress={() => navigation.navigate('Compare')}
          />
        </View>

        {/* ── Stockage & À propos ── */}
        <Text style={styles.sectionLabel}>
          {isFr ? 'STOCKAGE & À PROPOS' : 'STORAGE & ABOUT'}
        </Text>
        <View style={styles.card}>
          <SettingRow
            icon={<Trash2 color="#DC2626" size={18} strokeWidth={2} />}
            iconBg="#FEE2E2"
            title={isFr ? 'Effacer les données locales' : 'Clear local data'}
            subtitle={
              isFr
                ? 'Favoris, recherches et brouillons'
                : 'Favorites, searches and drafts'
            }
            onPress={handleClearCache}
            danger
          />
          <View style={styles.divider} />
          <SettingRow
            icon={<Info color={colors.textMuted} size={18} strokeWidth={2} />}
            iconBg="#F1F5F9"
            title="IMMO DU LETCH"
            subtitle={
              isFr
                ? 'Version 1.0.0 · Cameroun (Douala, Yaoundé, Kribi)'
                : 'Version 1.0.0 · Cameroon (Douala, Yaoundé, Kribi)'
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: 18,
    paddingBottom: 28,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 18,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  rowTitleDanger: {
    color: '#DC2626',
  },
  rowSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },
  langPill: {
    backgroundColor: colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  langPillText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
  },
});
