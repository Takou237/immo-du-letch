import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';

import { AppHeader } from '../components/AppHeader';
import { colors, spacing, typography, radius } from '../theme';
import { useLang } from '../i18n/LangContext';

const { width } = Dimensions.get('window');

const TRANSACTION_TABS = ['buyTab', 'rentTab', 'furnishedTab', 'landTab', 'proTab'] as const;

export function HomeScreen() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = React.useState<typeof TRANSACTION_TABS[number]>('buyTab');

  return (
    <View style={styles.root}>
      {/* En-tête global */}
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Section ── */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t.home.heroTitle}</Text>
          <Text style={styles.heroSubtitle}>{t.home.heroSubtitle}</Text>

          {/* Onglets de transaction */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContent}
          >
            {TRANSACTION_TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {t.home[tab]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Champ de recherche simplifié */}
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.85}>
            <Search color={colors.textMuted} size={18} />
            <Text style={styles.searchPlaceholder}>
              {t.home.neighborhoodPlaceholder}
            </Text>
          </TouchableOpacity>

          {/* Bouton Rechercher */}
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.9}>
            <Text style={styles.searchBtnText}>
              {t.home.searchButtonCount(20)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Statistiques plateforme ── */}
        <View style={styles.statsRow}>
          {[
            { value: '20', label: t.search.results(20).replace('20 ', '') },
            { value: '3', label: 'Villes' },
            { value: '5', label: 'Types' },
            { value: '5+', label: 'Années' },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Catégories ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.home.categoriesTitle}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {Object.entries(t.propertyTypes).map(([key, label]) => (
              <TouchableOpacity key={key} style={styles.categoryCard} activeOpacity={0.8}>
                <Text style={styles.categoryEmoji}>
                  {key === 'villa' ? '🏡' : key === 'appartement' ? '🏢' : key === 'terrain' ? '🌿' : key === 'studio' ? '🛏️' : '🏪'}
                </Text>
                <Text style={styles.categoryLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── CTA Vendeur ── */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>{t.home.ctaVendor}</Text>
          <Text style={styles.ctaSub}>{t.home.ctaVendorSub}</Text>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>{t.home.ctaVendorBtn}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Section Biens en vedette (placeholder) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.home.featuredTitle}</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>{t.home.viewAll}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>
              📋 {t.home.seeAll(20)}
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // ── Hero ──
  hero: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },

  // Onglets
  tabsScroll: { marginBottom: spacing.md },
  tabsContent: { gap: spacing.sm, paddingRight: spacing.lg },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tabActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  tabText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.navy,
  },

  // Barre de recherche
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    marginBottom: spacing.md,
  },
  searchPlaceholder: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    flex: 1,
  },

  // Bouton de recherche
  searchBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  searchBtnText: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // ── Statistiques ──
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.lg,
    marginTop: -18,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Sections ──
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  viewAll: {
    fontSize: 13,
    color: colors.gold,
    fontWeight: '600',
  },

  // Catégories
  categoriesContent: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 90,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // ── CTA Vendeur ──
  ctaCard: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.navyLight,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  ctaSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  ctaBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  ctaBtnText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '800',
  },

  // Placeholder section
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
