/**
 * FeaturedCategoriesSection — 2 grandes cartes VENTE / LOCATION, style mobile.de.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FeaturedCategoriesSectionProps {
  lang: 'fr' | 'en';
  countVente: number;
  countLocation: number;
  onPressVente: () => void;
  onPressLocation: () => void;
}

export function FeaturedCategoriesSection({
  lang,
  countVente,
  countLocation,
  onPressVente,
  onPressLocation,
}: FeaturedCategoriesSectionProps) {
  const title    = lang === 'fr' ? 'Catégories'       : 'Categories';
  const buyLabel = lang === 'fr' ? 'Acheter'          : 'Buy';
  const rentLabel = lang === 'fr' ? 'Louer'           : 'Rent';
  const listings = lang === 'fr' ? 'annonces'         : 'listings';

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.row}>
        {/* Vente */}
        <TouchableOpacity style={[styles.card, styles.cardVente]} onPress={onPressVente} activeOpacity={0.85}>
          <Text style={styles.emoji}>🏠</Text>
          <Text style={styles.cardLabel}>{buyLabel}</Text>
          <Text style={styles.cardCount}>{countVente} {listings}</Text>
        </TouchableOpacity>

        {/* Location */}
        <TouchableOpacity style={[styles.card, styles.cardLocation]} onPress={onPressLocation} activeOpacity={0.85}>
          <Text style={styles.emoji}>🔑</Text>
          <Text style={styles.cardLabel}>{rentLabel}</Text>
          <Text style={styles.cardCount}>{countLocation} {listings}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 20,
    justifyContent: 'flex-end',
    minHeight: 140,
  },
  cardVente: {
    backgroundColor: '#1a3a5c',
  },
  cardLocation: {
    backgroundColor: '#1a4731',
  },
  emoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardLabel: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardCount: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
