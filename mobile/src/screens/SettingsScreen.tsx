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
  Modal,
  Image,
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
  X,
  Search,
  Home,
  Scale,
  Calculator,
  MessageCircle,
} from 'lucide-react-native';

import { useLang } from '../i18n/LangContext';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
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
  const { unreadCount } = useNotifications();
  const navigation = useNavigation<NavProp>();
  const isFr = lang === 'fr';

  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newListingsAlerts, setNewListingsAlerts] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);

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
            right={
              unreadCount > 0 ? (
                <View style={styles.notifBadgeRow}>
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                  </View>
                  <ChevronRight color={colors.textMuted} size={18} />
                </View>
              ) : undefined
            }
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
            icon={<Info color={colors.navy} size={18} strokeWidth={2} />}
            iconBg="#EFF6FF"
            title={isFr ? 'À propos d’IMMO DU LETCH' : 'About IMMO DU LETCH'}
            subtitle={
              isFr
                ? 'Découvrir l’application et ses services · v1.0.0'
                : 'Learn about the app and services · v1.0.0'
            }
            onPress={() => setAboutOpen(true)}
          />
        </View>
      </ScrollView>

      {/* Modal À propos */}
      <Modal
        visible={aboutOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAboutOpen(false)}
      >
        <View style={styles.aboutOverlay}>
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Text style={styles.aboutHeaderTitle}>
                {isFr ? 'À propos' : 'About'}
              </Text>
              <TouchableOpacity
                onPress={() => setAboutOpen(false)}
                style={styles.aboutCloseBtn}
              >
                <X size={18} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.aboutHero}>
                <Image
                  source={require('../../immo.png')}
                  style={styles.aboutLogo}
                  resizeMode="contain"
                />
                <Text style={styles.aboutVersion}>Version 1.0.0 · Cameroun</Text>
                <Text style={styles.aboutTagline}>
                  {isFr
                    ? 'Votre plateforme immobilière de confiance pour acheter, louer ou publier un bien au Cameroun (Douala, Yaoundé, Kribi).'
                    : 'Your trusted real estate platform to buy, rent, or list properties in Cameroon (Douala, Yaoundé, Kribi).'}
                </Text>
              </View>

              <Text style={styles.aboutSectionTitle}>
                {isFr ? 'Comment l’app vous aide au quotidien' : 'How the app helps you'}
              </Text>

              <View style={styles.aboutFeatureRow}>
                <View style={styles.aboutFeatureIcon}>
                  <Search size={16} color={colors.navy} />
                </View>
                <View style={styles.aboutFeatureText}>
                  <Text style={styles.aboutFeatureTitle}>
                    {isFr ? 'Recherche ciblée & filtres avancés' : 'Targeted search & filters'}
                  </Text>
                  <Text style={styles.aboutFeatureDesc}>
                    {isFr
                      ? 'Filtrez par transaction (achat/location), ville, quartier, budget, surface, équipements et documents fonciers.'
                      : 'Filter by transaction, city, district, budget, area, amenities, and legal documents.'}
                  </Text>
                </View>
              </View>

              <View style={styles.aboutFeatureRow}>
                <View style={styles.aboutFeatureIcon}>
                  <Scale size={16} color={colors.navy} />
                </View>
                <View style={styles.aboutFeatureText}>
                  <Text style={styles.aboutFeatureTitle}>
                    {isFr ? 'Comparateur intelligent' : 'Smart comparison'}
                  </Text>
                  <Text style={styles.aboutFeatureDesc}>
                    {isFr
                      ? 'Comparez jusqu’à 3 biens similaires côte à côte (prix, m², équipements) pour faire le meilleur choix.'
                      : 'Compare up to 3 similar properties side by side (price, area, amenities).'}
                  </Text>
                </View>
              </View>

              <View style={styles.aboutFeatureRow}>
                <View style={styles.aboutFeatureIcon}>
                  <Calculator size={16} color={colors.navy} />
                </View>
                <View style={styles.aboutFeatureText}>
                  <Text style={styles.aboutFeatureTitle}>
                    {isFr ? 'Simulateur de mensualité' : 'Monthly payment simulator'}
                  </Text>
                  <Text style={styles.aboutFeatureDesc}>
                    {isFr
                      ? 'Estimez votre financement immobilier directement sur les fiches de biens à vendre.'
                      : 'Estimate your mortgage financing directly on property sale pages.'}
                  </Text>
                </View>
              </View>

              <View style={styles.aboutFeatureRow}>
                <View style={styles.aboutFeatureIcon}>
                  <Home size={16} color={colors.navy} />
                </View>
                <View style={styles.aboutFeatureText}>
                  <Text style={styles.aboutFeatureTitle}>
                    {isFr ? 'Dépôt d’annonces simplifié' : 'Easy listing submission'}
                  </Text>
                  <Text style={styles.aboutFeatureDesc}>
                    {isFr
                      ? 'Publiez votre villa, appartement, studio, terrain ou bureau en quelques clics et gérez vos favoris hors-ligne.'
                      : 'Post your villa, apartment, studio, land, or office in a few taps and access favorites offline.'}
                  </Text>
                </View>
              </View>

              <View style={styles.aboutFeatureRow}>
                <View style={styles.aboutFeatureIcon}>
                  <MessageCircle size={16} color={colors.navy} />
                </View>
                <View style={styles.aboutFeatureText}>
                  <Text style={styles.aboutFeatureTitle}>
                    {isFr ? 'Contact direct annonceur' : 'Direct advertiser contact'}
                  </Text>
                  <Text style={styles.aboutFeatureDesc}>
                    {isFr
                      ? 'Appelez ou envoyez une demande de visite en un clic depuis chaque annonce.'
                      : 'Call or send a visit request in one tap from any listing.'}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.aboutOkBtn}
              onPress={() => setAboutOpen(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.aboutOkText}>
                {isFr ? 'Compris' : 'Got it'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  notifBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  aboutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 31, 73, 0.55)',
    justifyContent: 'flex-end',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  aboutHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  aboutCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutHero: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  aboutLogo: {
    width: 120,
    height: 44,
    marginBottom: 6,
  },
  aboutVersion: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: 8,
  },
  aboutTagline: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  aboutSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 12,
  },
  aboutFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  aboutFeatureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  aboutFeatureText: {
    flex: 1,
  },
  aboutFeatureTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 2,
  },
  aboutFeatureDesc: {
    fontSize: 12.5,
    color: colors.textMuted,
    lineHeight: 18,
  },
  aboutOkBtn: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  aboutOkText: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '800',
  },
});
