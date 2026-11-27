/**
 * TopDealsSection — section "Biens en vedette / Top deals" thème IMMO DU LETCH.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { ListingCard } from './ListingCard';
import { Listing } from '../../types/listing';
import { colors } from '../../theme';

interface TopDealsSectionProps {
  listings: Listing[];
  favorites: string[];
  lang: 'fr' | 'en';
  onPressCard: (id: string) => void;
  onToggleFav: (id: string) => void;
  onPressViewAll: () => void;
  title: string;
  badge: string;
  viewAllLabel: string;
  dealLabel: string;
  newLabel: string;
  perMonthLabel: string;
}

export function TopDealsSection({
  listings,
  favorites,
  lang,
  onPressCard,
  onToggleFav,
  onPressViewAll,
  title,
  badge,
  viewAllLabel,
  dealLabel,
  newLabel,
  perMonthLabel,
}: TopDealsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAllBtn} onPress={onPressViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>{viewAllLabel}</Text>
          <ArrowRight size={14} color={colors.navy} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

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
            dealLabel={dealLabel}
            newLabel={newLabel}
            perMonthLabel={perMonthLabel}
          />
        ))}
        <View style={{ width: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: colors.goldSoft,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAll: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '700',
  },
  scroll: {
    paddingBottom: 4,
  },
});
