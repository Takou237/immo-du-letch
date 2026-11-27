/**
 * TopDealsSection — section "Top offres pour vous" style mobile.de.
 * Principe S : affichage de la liste des deals, navigation déléguée via onPressCard.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ListingCard } from './ListingCard';
import { Listing } from '../../types/listing';

interface TopDealsSectionProps {
  listings: Listing[];
  favorites: string[];
  lang: 'fr' | 'en';
  onPressCard: (id: string) => void;
  onToggleFav: (id: string) => void;
  onPressViewAll: () => void;
  titleFr: string;
  titleEn: string;
  badgeFr: string;
  badgeEn: string;
  viewAllFr: string;
  viewAllEn: string;
  dealFr: string;
  dealEn: string;
  newFr: string;
  newEn: string;
  priceDropFr: string;
  priceDropEn: string;
}

export function TopDealsSection({
  listings,
  favorites,
  lang,
  onPressCard,
  onToggleFav,
  onPressViewAll,
  titleFr, titleEn,
  badgeFr, badgeEn,
  viewAllFr, viewAllEn,
  dealFr, dealEn,
  newFr, newEn,
  priceDropFr, priceDropEn,
}: TopDealsSectionProps) {
  const title    = lang === 'fr' ? titleFr    : titleEn;
  const badge    = lang === 'fr' ? badgeFr    : badgeEn;
  const viewAll  = lang === 'fr' ? viewAllFr  : viewAllEn;
  const deal     = lang === 'fr' ? dealFr     : dealEn;
  const newLabel = lang === 'fr' ? newFr      : newEn;
  const priceDrop = lang === 'fr' ? priceDropFr : priceDropEn;

  return (
    <View style={styles.section}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{title} </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPressViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>{viewAll} →</Text>
        </TouchableOpacity>
      </View>

      {/* Scroll horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {listings.map(listing => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isFav={favorites.includes(listing.id)}
            lang={lang}
            onPress={() => onPressCard(listing.id)}
            onToggleFav={() => onToggleFav(listing.id)}
            dealLabel={deal}
            newLabel={newLabel}
            priceDropLabel={priceDrop}
          />
        ))}
        {/* Espace droit */}
        <View style={{ width: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#0B1B2B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  viewAll: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  scroll: {
    paddingRight: 0,
  },
});
