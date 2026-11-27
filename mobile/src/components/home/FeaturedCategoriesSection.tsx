/**
 * FeaturedCategoriesSection — 2 grandes cartes Acheter / Louer avec icônes Lucide.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, KeyRound } from 'lucide-react-native';
import { colors } from '../../theme';

interface FeaturedCategoriesSectionProps {
  title: string;
  buyLabel: string;
  rentLabel: string;
  listingsWord: string;
  countVente: number;
  countLocation: number;
  onPressVente: () => void;
  onPressLocation: () => void;
}

export function FeaturedCategoriesSection({
  title,
  buyLabel,
  rentLabel,
  listingsWord,
  countVente,
  countLocation,
  onPressVente,
  onPressLocation,
}: FeaturedCategoriesSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.card, styles.cardVente]} onPress={onPressVente} activeOpacity={0.85}>
          <View style={styles.iconBox}>
            <Home size={22} color={colors.gold} strokeWidth={2.2} />
          </View>
          <Text style={styles.cardLabel}>{buyLabel}</Text>
          <Text style={styles.cardCount}>{countVente} {listingsWord}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.cardLocation]} onPress={onPressLocation} activeOpacity={0.85}>
          <View style={styles.iconBoxLight}>
            <KeyRound size={22} color={colors.navy} strokeWidth={2.2} />
          </View>
          <Text style={styles.cardLabelDark}>{rentLabel}</Text>
          <Text style={styles.cardCountDark}>{countLocation} {listingsWord}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 126,
  },
  cardVente: {
    backgroundColor: colors.navy,
  },
  cardLocation: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconBoxLight: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    color: colors.textOnNavy,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardCount: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  cardLabelDark: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardCountDark: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
