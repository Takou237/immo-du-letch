/**
 * TopDealsSection — section horizontale d'annonces (Top DEALS for you / Biens en vedette).
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
  /** Variante "Top [• DEALS] for you" avec étiquette corail */
  isTopDealsBanner?: boolean;
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
  isTopDealsBanner = false,
}: TopDealsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        {isTopDealsBanner ? (
          <View style={styles.topDealsTitleRow}>
            <Text style={styles.titleText}>Top</Text>
            <View style={styles.dealTag}>
              <View style={styles.dealTagHole} />
              <Text style={styles.dealTagText}>DEALS</Text>
            </View>
            <Text style={styles.titleText}>for you</Text>
          </View>
        ) : (
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          </View>
        )}
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
        <View style={styles.endSpacer} />
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
  topDealsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dealTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FF8A5B',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    paddingLeft: 7,
    paddingRight: 9,
    paddingVertical: 3,
  },
  dealTagHole: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.navy,
  },
  dealTagText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
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
    paddingLeft: 16,
  },
  endSpacer: {
    width: 16,
  },
});
