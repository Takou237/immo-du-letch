/**
 * ListingDetailScreen — Fiche détaillée d'une annonce IMMO DU LETCH Mobile.
 * Thème officiel du site, icônes vectorielles Lucide, bilingue FR/EN.
 */
import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Tag,
  Star,
  Eye,
  ShieldCheck,
  Phone,
  MessageCircle,
  Check,
  TrendingDown,
  Info,
  Clock,
  UserPlus,
  UserCheck,
} from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';
import { useListings } from '../hooks/useListings';
import { useFavorites } from '../hooks/useFavorites';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { useLang } from '../i18n/LangContext';
import { formatFullFCFA, formatPricePerSqm, formatSurface } from '../utils/formatPrice';
import { getPriceRating } from '../utils/listingUtils';
import { PropertyTypeIcon } from '../components/PropertyTypeIcon';
import { ListingCard } from '../components/home/ListingCard';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ListingDetail'>;

export function ListingDetailScreen({ route, navigation }: Props) {
  const { listingId } = route.params;
  const { lang, t } = useLang();
  const { listings } = useListings();
  const { isFavorite, toggleFavorite, addToRecent, favorites } = useFavorites();
  const { isFollowingSeller, toggleFollowSeller } = useSavedSearches();

  const listing = useMemo(
    () => listings.find(l => l.id === listingId),
    [listings, listingId],
  );

  useEffect(() => {
    if (listing) {
      addToRecent(listing.id);
    }
  }, [listing, addToRecent]);

  const similarListings = useMemo(() => {
    if (!listing) return [];
    return listings
      .filter(l => l.id !== listing.id && (l.type === listing.type || l.city === listing.city))
      .slice(0, 5);
  }, [listings, listing]);

  if (!listing) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color={colors.navy} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t.common.error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fav = isFavorite(listing.id);
  const title = lang === 'fr' ? listing.title : listing.titleEn;
  const description = lang === 'fr' ? listing.description : listing.descriptionEn;
  const features = lang === 'fr' ? listing.features : listing.featuresEn;
  const priceRating = getPriceRating(listing, listings);
  const ppm = formatPricePerSqm(listing.price, listing.surface);

  const priceRatingLabels: Record<string, { fr: string; en: string; bg: string; fg: string }> = {
    excellent: { fr: 'Excellent prix',   en: 'Great price',   bg: colors.successSoft, fg: colors.success },
    tres_bon:  { fr: 'Très bon prix',    en: 'Very good price', bg: colors.successSoft, fg: colors.success },
    bon:       { fr: 'Bon prix',         en: 'Fair price',    bg: colors.infoSoft,    fg: colors.info },
    marche:    { fr: 'Prix du marché',   en: 'Market price',  bg: colors.surfaceAlt,  fg: colors.textSecondary },
    eleve:     { fr: 'Au-dessus marché', en: 'Above market',  bg: colors.warningSoft, fg: colors.warning },
  };
  const ratingBadge = priceRatingLabels[priceRating];

  const handleCall = () => {
    const cleanPhone = listing.seller.phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {});
  };

  const handleWhatsApp = () => {
    const cleanPhone = listing.seller.phone.replace(/[^\d]/g, '');
    const msg = encodeURIComponent(
      lang === 'fr'
        ? `Bonjour, je suis intéressé par votre annonce "${listing.title}" sur IMMO DU LETCH.`
        : `Hello, I am interested in your listing "${listing.titleEn}" on IMMO DU LETCH.`,
    );
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${msg}`).catch(() => {});
  };

  const handleShare = () => {
    Share.share({
      message: `${title} — ${formatFullFCFA(listing.price)} (${listing.neighborhood}, ${listing.city}) | IMMO DU LETCH`,
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Barre supérieure */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {t.propertyTypeSingular[listing.type]} • {listing.city}
        </Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.navBtn} onPress={handleShare}>
            <Share2 size={18} color={colors.navy} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => toggleFavorite(listing.id)}>
            <Heart
              size={19}
              color={fav ? colors.danger : colors.navy}
              fill={fav ? colors.danger : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Visuel Hero */}
        <View style={[styles.hero, { backgroundColor: listing.gradientColors[0] }]}>
          <View style={styles.heroBadges}>
            <View style={styles.transBadge}>
              <Text style={styles.transText}>{t.transactions[listing.transaction]}</Text>
            </View>
            {listing.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newText}>{t.home.new.toUpperCase()}</Text>
              </View>
            )}
            {listing.priceDropped && listing.priceDropPercent && (
              <View style={styles.dropBadge}>
                <TrendingDown size={12} color="#fff" />
                <Text style={styles.dropText}>-{listing.priceDropPercent}%</Text>
              </View>
            )}
          </View>

          <View style={styles.heroIconCenter}>
            <PropertyTypeIcon type={listing.type} size={52} color="rgba(255,255,255,0.92)" />
          </View>

          <View style={styles.heroBottomRow}>
            <View style={styles.viewsPill}>
              <Eye size={13} color="#fff" />
              <Text style={styles.viewsPillText}>
                {listing.views} {t.detail.views}
              </Text>
            </View>
            {listing.rating != null && (
              <View style={styles.viewsPill}>
                <Star size={13} color={colors.gold} fill={colors.gold} />
                <Text style={styles.viewsPillText}>
                  {listing.rating.toFixed(1)} ({listing.ratingCount} {t.detail.reviews})
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Prix + Cote du marché */}
        <View style={styles.section}>
          <View style={styles.priceHeaderRow}>
            <View>
              <Text style={styles.price}>
                {formatFullFCFA(listing.price)}
                {listing.transaction === 'location' ? (
                  <Text style={styles.perMonth}> {t.common.perMonth}</Text>
                ) : null}
              </Text>
              {ppm !== '' && listing.transaction === 'vente' && (
                <Text style={styles.ppm}>{ppm}</Text>
              )}
            </View>

            <View style={[styles.ratingScaleBadge, { backgroundColor: ratingBadge.bg }]}>
              <Text style={[styles.ratingScaleText, { color: ratingBadge.fg }]}>
                {lang === 'fr' ? ratingBadge.fr : ratingBadge.en}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.locationRow}>
            <MapPin size={15} color={colors.navy} />
            <Text style={styles.locationText}>
              {listing.neighborhood}, {listing.city}
            </Text>
          </View>
        </View>

        {/* Grille caractéristiques */}
        <View style={styles.specsGrid}>
          <View style={styles.specBox}>
            <Maximize2 size={18} color={colors.navy} />
            <Text style={styles.specVal}>{formatSurface(listing.surface)}</Text>
            <Text style={styles.specLbl}>{lang === 'fr' ? 'Surface' : 'Area'}</Text>
          </View>

          {listing.bedrooms != null && (
            <View style={styles.specBox}>
              <BedDouble size={18} color={colors.navy} />
              <Text style={styles.specVal}>{listing.bedrooms}</Text>
              <Text style={styles.specLbl}>{t.detail.bedrooms}</Text>
            </View>
          )}

          {listing.bathrooms != null && (
            <View style={styles.specBox}>
              <Bath size={18} color={colors.navy} />
              <Text style={styles.specVal}>{listing.bathrooms}</Text>
              <Text style={styles.specLbl}>{lang === 'fr' ? 'Sdb' : 'Baths'}</Text>
            </View>
          )}

          <View style={styles.specBox}>
            <Tag size={18} color={colors.navy} />
            <Text style={styles.specVal} numberOfLines={1}>
              {t.conditions[listing.condition]}
            </Text>
            <Text style={styles.specLbl}>{lang === 'fr' ? 'État' : 'Condition'}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {lang === 'fr' ? 'Description' : 'Description'}
          </Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Équipements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.detail.features}</Text>
          <View style={styles.featuresWrap}>
            {features.map((feat, idx) => (
              <View key={idx} style={styles.featureChip}>
                <Check size={13} color={colors.success} strokeWidth={2.5} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Annonceur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.detail.seller}</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerTop}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>
                  {listing.seller.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{listing.seller.name}</Text>
                  {listing.seller.verified && (
                    <ShieldCheck size={16} color={colors.success} />
                  )}
                </View>
                <Text style={styles.sellerType}>
                  {listing.seller.type === 'professionnel'
                    ? (lang === 'fr' ? 'Professionnel' : 'Professional')
                    : (lang === 'fr' ? 'Particulier' : 'Private seller')}
                </Text>
                {listing.seller.responseTime && (
                  <View style={styles.responseRow}>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={styles.responseText}>
                      {lang === 'fr'
                        ? `Répond en ${listing.seller.responseTime}`
                        : `Replies in ${listing.seller.responseTime}`}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.followBtn,
                  isFollowingSeller(listing.seller.id) && styles.followBtnActive,
                ]}
                onPress={() => toggleFollowSeller(listing.seller.id)}
              >
                {isFollowingSeller(listing.seller.id) ? (
                  <UserCheck size={14} color={colors.navy} />
                ) : (
                  <UserPlus size={14} color={colors.gold} />
                )}
                <Text
                  style={[
                    styles.followBtnText,
                    isFollowingSeller(listing.seller.id) && styles.followBtnTextActive,
                  ]}
                >
                  {isFollowingSeller(listing.seller.id)
                    ? (lang === 'fr' ? 'Suivi' : 'Following')
                    : (lang === 'fr' ? 'Suivre' : 'Follow')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Mention légale / transparence */}
        <View style={styles.disclaimer}>
          <Info size={15} color={colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            {lang === 'fr'
              ? 'Informations et documents déclarés par l’annonceur. Vérifiez toujours les originaux avant toute transaction.'
              : 'Information and documents declared by the seller. Always verify originals before any transaction.'}
          </Text>
        </View>

        {/* Biens similaires */}
        {similarListings.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>{t.detail.similar}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similarListings.map(sim => (
                <ListingCard
                  key={sim.id}
                  listing={sim}
                  isFav={favorites.includes(sim.id)}
                  lang={lang}
                  onPress={() => navigation.push('ListingDetail', { listingId: sim.id })}
                  onToggleFav={() => toggleFavorite(sim.id)}
                  dealLabel={lang === 'fr' ? 'OPPORTUNITÉ' : 'DEAL'}
                  newLabel={t.home.new.toUpperCase()}
                  perMonthLabel={t.common.perMonth}
                />
              ))}
              <View style={{ width: 16 }} />
            </ScrollView>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Barre d'action fixe en bas */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.85}>
          <Phone size={18} color={colors.gold} />
          <Text style={styles.callBtnText}>{t.detail.contact}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
          <MessageCircle size={18} color="#fff" />
          <Text style={styles.waBtnText}>{t.detail.whatsapp}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  hero: {
    height: 220,
    padding: 16,
    justifyContent: 'space-between',
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  transBadge: {
    backgroundColor: colors.navy,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  transText: {
    color: colors.textOnNavy,
    fontSize: 11,
    fontWeight: '700',
  },
  newBadge: {
    backgroundColor: colors.gold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  newText: {
    color: colors.navy,
    fontSize: 11,
    fontWeight: '800',
  },
  dropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  heroIconCenter: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 24,
    padding: 18,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(11,27,43,0.6)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  viewsPillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  priceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
  },
  perMonth: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  ppm: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingScaleBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ratingScaleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  specBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  specVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  specLbl: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  featuresWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sellerCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
  },
  sellerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sellerType: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  responseText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.navy,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  followBtnActive: {
    backgroundColor: colors.gold,
  },
  followBtnText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  followBtnTextActive: {
    color: colors.navy,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  similarSection: {
    marginTop: 20,
  },
  similarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 14,
  },
  callBtnText: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '800',
  },
  waBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
  },
  waBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});
