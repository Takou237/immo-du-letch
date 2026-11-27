/**
 * ListingRowCard — carte d'annonce pleine largeur pour les résultats de recherche.
 * Thème officiel IMMO DU LETCH, icônes Lucide, bilingue FR/EN.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Heart,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Star,
  TrendingDown,
  ShieldCheck,
  Eye,
} from 'lucide-react-native';
import { Listing } from '../../types/listing';
import { formatFCFA, formatSurface } from '../../utils/formatPrice';
import { ListingImage } from '../ListingImage';
import { colors } from '../../theme';

interface ListingRowCardProps {
  listing: Listing;
  isFav: boolean;
  lang: 'fr' | 'en';
  transactionLabel: string;
  newLabel: string;
  perMonthLabel: string;
  onPress: () => void;
  onToggleFav: () => void;
}

export function ListingRowCard({
  listing,
  isFav,
  lang,
  transactionLabel,
  newLabel,
  perMonthLabel,
  onPress,
  onToggleFav,
}: ListingRowCardProps) {
  const title = lang === 'fr' ? listing.title : listing.titleEn;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Bandeau visuel supérieur */}
      <View style={styles.banner}>
        <ListingImage
          uri={listing.image}
          type={listing.type}
          fallbackColor={listing.gradientColors[0]}
          iconSize={32}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.badgesLeft}>
          <View style={styles.transBadge}>
            <Text style={styles.transBadgeText}>{transactionLabel}</Text>
          </View>
          {listing.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>{newLabel}</Text>
            </View>
          )}
          {listing.priceDropped && listing.priceDropPercent && (
            <View style={styles.dropBadge}>
              <TrendingDown size={11} color="#fff" />
              <Text style={styles.dropBadgeText}>-{listing.priceDropPercent}%</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.heartBtn} onPress={onToggleFav} hitSlop={8}>
          <Heart
            size={18}
            color={isFav ? colors.danger : '#fff'}
            fill={isFav ? colors.danger : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <View style={styles.body}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatFCFA(listing.price)}
            {listing.transaction === 'location' ? (
              <Text style={styles.perMonth}> {perMonthLabel}</Text>
            ) : null}
          </Text>
          {listing.rating != null && (
            <View style={styles.ratingBadge}>
              <Star size={12} color={colors.goldBright} fill={colors.goldBright} />
              <Text style={styles.ratingText}>{listing.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color={colors.textSecondary} />
          <Text style={styles.locationText}>
            {listing.neighborhood}, {listing.city}
          </Text>
        </View>

        {/* Chips caractéristiques */}
        <View style={styles.specsRow}>
          <View style={styles.specChip}>
            <Maximize2 size={12} color={colors.navy} />
            <Text style={styles.specText}>{formatSurface(listing.surface)}</Text>
          </View>
          {listing.bedrooms != null && (
            <View style={styles.specChip}>
              <BedDouble size={12} color={colors.navy} />
              <Text style={styles.specText}>{listing.bedrooms}</Text>
            </View>
          )}
          {listing.bathrooms != null && (
            <View style={styles.specChip}>
              <Bath size={12} color={colors.navy} />
              <Text style={styles.specText}>{listing.bathrooms}</Text>
            </View>
          )}
        </View>

        {/* Pied de carte : vendeur + vues */}
        <View style={styles.footer}>
          <View style={styles.sellerRow}>
            {listing.seller.verified && (
              <ShieldCheck size={14} color={colors.success} />
            )}
            <Text style={styles.sellerName} numberOfLines={1}>
              {listing.seller.name}
            </Text>
          </View>
          <View style={styles.viewsRow}>
            <Eye size={13} color={colors.textMuted} />
            <Text style={styles.viewsText}>{listing.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  banner: {
    height: 120,
    padding: 12,
    justifyContent: 'space-between',
  },
  badgesLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingRight: 40,
  },
  transBadge: {
    backgroundColor: colors.navy,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  transBadgeText: {
    color: colors.textOnNavy,
    fontSize: 10,
    fontWeight: '700',
  },
  newBadge: {
    backgroundColor: colors.gold,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newBadgeText: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: '800',
  },
  dropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dropBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(11,27,43,0.55)',
    borderRadius: 20,
    padding: 7,
  },
  iconBottomRight: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    padding: 8,
  },
  body: {
    padding: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  price: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  perMonth: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.goldSoft,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  ratingText: {
    color: colors.navy,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  specText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  sellerName: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
