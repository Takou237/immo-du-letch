/**
 * ListingCard — carte d'annonce horizontale scrollable, thème officiel IMMO DU LETCH.
 * Principe S : affichage uniquement, icône vectorielle au lieu d'emoji.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin, Maximize2, BedDouble, Star, TrendingDown } from 'lucide-react-native';
import { Listing } from '../../types/listing';
import { formatFCFA, formatSurface } from '../../utils/formatPrice';
import { PropertyTypeIcon } from '../PropertyTypeIcon';
import { colors } from '../../theme';

interface ListingCardProps {
  listing: Listing;
  isFav: boolean;
  lang: 'fr' | 'en';
  onPress: () => void;
  onToggleFav: () => void;
  dealLabel: string;
  newLabel: string;
  perMonthLabel: string;
}

export function ListingCard({
  listing,
  isFav,
  lang,
  onPress,
  onToggleFav,
  dealLabel,
  newLabel,
  perMonthLabel,
}: ListingCardProps) {
  const title = lang === 'fr' ? listing.title : listing.titleEn;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Zone visuelle */}
      <View style={[styles.colorBlock, { backgroundColor: listing.gradientColors[0] }]}>
        <View style={styles.dealBadge}>
          <Text style={styles.dealText}>{listing.isNew ? newLabel : dealLabel}</Text>
        </View>

        {listing.priceDropped && listing.priceDropPercent && (
          <View style={styles.dropBadge}>
            <TrendingDown size={10} color="#fff" />
            <Text style={styles.dropText}>-{listing.priceDropPercent}%</Text>
          </View>
        )}

        <TouchableOpacity style={styles.heartBtn} onPress={onToggleFav} hitSlop={8}>
          <Heart
            size={17}
            color={isFav ? colors.danger : '#fff'}
            fill={isFav ? colors.danger : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        <View style={styles.typeIconWrap}>
          <PropertyTypeIcon type={listing.type} size={26} color="rgba(255,255,255,0.9)" />
        </View>
      </View>

      {/* Corps */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        <Text style={styles.price}>
          {formatFCFA(listing.price)}
          {listing.transaction === 'location' ? (
            <Text style={styles.perMonth}> {perMonthLabel}</Text>
          ) : null}
        </Text>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Maximize2 size={10} color={colors.textSecondary} />
            <Text style={styles.chipText}>{formatSurface(listing.surface)}</Text>
          </View>
          {listing.bedrooms != null && (
            <View style={styles.chip}>
              <BedDouble size={10} color={colors.textSecondary} />
              <Text style={styles.chipText}>{listing.bedrooms}</Text>
            </View>
          )}
          <View style={styles.chip}>
            <MapPin size={10} color={colors.textSecondary} />
            <Text style={styles.chipText}>{listing.city}</Text>
          </View>
        </View>

        {listing.rating != null && (
          <View style={styles.ratingRow}>
            <Star size={12} color={colors.goldBright} fill={colors.goldBright} />
            <Text style={styles.ratingText}>{listing.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({listing.ratingCount})</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 16,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  colorBlock: {
    height: 112,
    justifyContent: 'flex-end',
    padding: 10,
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.gold,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dealText: {
    color: colors.navy,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dropBadge: {
    position: 'absolute',
    top: 34,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dropText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(11,27,43,0.55)',
    borderRadius: 20,
    padding: 6,
  },
  typeIconWrap: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    padding: 7,
  },
  body: {
    padding: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
    minHeight: 36,
  },
  price: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  perMonth: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  ratingCount: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
