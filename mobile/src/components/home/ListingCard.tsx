/**
 * ListingCard — carte d'annonce horizontale scrollable, style mobile.de dark.
 * Principe S : affichage uniquement, pas de logique métier.
 * Principe O : onPress + onFavorite extensibles.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin, Maximize2, BedDouble, Star, TrendingDown } from 'lucide-react-native';
import { Listing } from '../../types/listing';
import { formatFCFA, formatSurface } from '../../utils/formatPrice';

interface ListingCardProps {
  listing: Listing;
  isFav: boolean;
  lang: 'fr' | 'en';
  onPress: () => void;
  onToggleFav: () => void;
  dealLabel: string;        // "OPPORTUNITÉ" / "DEAL"
  newLabel: string;         // "NOUVEAU" / "NEW"
  priceDropLabel: string;   // "Prix baissé" / "Price drop"
}

export function ListingCard({
  listing,
  isFav,
  lang,
  onPress,
  onToggleFav,
  dealLabel,
  newLabel,
  priceDropLabel,
}: ListingCardProps) {
  const title = lang === 'fr' ? listing.title : listing.titleEn;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Zone couleur (image placeholder) */}
      <View style={[styles.colorBlock, { backgroundColor: listing.gradientColors[0] }]}>
        {/* Badge deal */}
        <View style={styles.dealBadge}>
          <Text style={styles.dealText}>{listing.isNew ? newLabel : dealLabel}</Text>
        </View>

        {/* Badge prix baissé */}
        {listing.priceDropped && (
          <View style={styles.dropBadge}>
            <TrendingDown size={10} color="#fff" />
            <Text style={styles.dropText}>-{listing.priceDropPercent}%</Text>
          </View>
        )}

        {/* Favori */}
        <TouchableOpacity style={styles.heartBtn} onPress={onToggleFav} hitSlop={8}>
          <Heart
            size={18}
            color={isFav ? '#ef4444' : '#fff'}
            fill={isFav ? '#ef4444' : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* Emoji type */}
        <Text style={styles.typeEmoji}>
          {listing.type === 'villa' ? '🏡'
            : listing.type === 'appartement' ? '🏢'
            : listing.type === 'terrain' ? '🌿'
            : listing.type === 'studio' ? '🛏️'
            : '🏪'}
        </Text>
      </View>

      {/* Corps de la carte */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        <Text style={styles.price}>{formatFCFA(listing.price)}</Text>

        {/* Chips */}
        <View style={styles.chips}>
          <View style={styles.chip}>
            <Maximize2 size={10} color="#9CA3AF" />
            <Text style={styles.chipText}>{formatSurface(listing.surface)}</Text>
          </View>
          {listing.bedrooms != null && (
            <View style={styles.chip}>
              <BedDouble size={10} color="#9CA3AF" />
              <Text style={styles.chipText}>{listing.bedrooms}</Text>
            </View>
          )}
          <View style={styles.chip}>
            <MapPin size={10} color="#9CA3AF" />
            <Text style={styles.chipText}>{listing.city}</Text>
          </View>
        </View>

        {/* Rating */}
        {listing.rating != null && (
          <View style={styles.ratingRow}>
            <Star size={11} color="#D4AF37" fill="#D4AF37" />
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
    width: 200,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    marginLeft: 16,
    overflow: 'hidden',
  },
  colorBlock: {
    height: 120,
    justifyContent: 'flex-end',
    padding: 8,
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  dealText: {
    color: '#0B1B2B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dropBadge: {
    position: 'absolute',
    top: 32,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#ef4444',
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 5,
  },
  typeEmoji: {
    fontSize: 28,
    alignSelf: 'flex-end',
  },
  body: {
    padding: 10,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  price: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#252F3F',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  chipText: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700',
  },
  ratingCount: {
    color: '#6B7280',
    fontSize: 10,
  },
});
