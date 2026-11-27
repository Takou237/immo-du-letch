/**
 * CompareScreen — Comparateur de biens (aligné sur src/components/CompareModal.tsx du web).
 * Compare jusqu'à 3 biens : meilleur prix, plus grande surface, prix/m², localisation, vendeur, équipements.
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, X, Trash2, MapPin, Star, Scale } from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';
import { useListings } from '../hooks/useListings';
import { useCompare } from '../hooks/useCompare';
import { useLang } from '../i18n/LangContext';
import { formatFCFA, formatPricePerSqm, formatSurface } from '../utils/formatPrice';
import { PropertyTypeIcon } from '../components/PropertyTypeIcon';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Compare'>;

export function CompareScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const { listings } = useListings();
  const { compareIds, removeFromCompare, clearCompare } = useCompare();

  const items = useMemo(
    () =>
      compareIds
        .map(id => listings.find(l => l.id === id))
        .filter((l): l is NonNullable<typeof l> => Boolean(l)),
    [compareIds, listings],
  );

  const sameTransaction =
    items.length > 0 && items.every(l => l.transaction === items[0].transaction);
  const minPrice = sameTransaction ? Math.min(...items.map(l => l.price)) : Number.NaN;
  const maxSurface = items.length > 0 ? Math.max(...items.map(l => l.surface)) : 0;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {t.favorites.compareTitle} ({items.length}/3)
        </Text>
        {items.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={clearCompare}>
            <Trash2 size={16} color={colors.danger} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Scale size={32} color={colors.navy} />
          </View>
          <Text style={styles.emptyTitle}>
            {lang === 'fr' ? 'Aucun bien à comparer' : 'No properties to compare'}
          </Text>
          <Text style={styles.emptySub}>
            {lang === 'fr'
              ? 'Ajoutez jusqu’à 3 biens depuis leur fiche pour comparer leurs caractéristiques.'
              : 'Add up to 3 properties from their detail page to compare their features.'}
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
          >
            <Text style={styles.ctaText}>{t.home.searchButton}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              {/* En-tête des cartes */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.headerColLabel}>
                    {lang === 'fr' ? 'Critères' : 'Criteria'}
                  </Text>
                </View>
                {items.map(item => (
                  <View key={item.id} style={styles.itemCol}>
                    <View style={styles.itemHeaderCard}>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeFromCompare(item.id)}
                      >
                        <X size={13} color={colors.danger} />
                      </TouchableOpacity>
                      <View style={[styles.itemBanner, { backgroundColor: item.gradientColors[0] }]}>
                        <PropertyTypeIcon type={item.type} size={26} color="#fff" />
                      </View>
                      <TouchableOpacity
                        style={styles.itemHeaderBody}
                        onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
                      >
                        <Text style={styles.itemTitle} numberOfLines={2}>
                          {lang === 'fr' ? item.title : item.titleEn}
                        </Text>
                        <View style={styles.locRow}>
                          <MapPin size={11} color={colors.textSecondary} />
                          <Text style={styles.locText} numberOfLines={1}>
                            {item.neighborhood}, {item.city}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              {/* Prix */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.rowLabel}>{lang === 'fr' ? 'Prix' : 'Price'}</Text>
                </View>
                {items.map(item => {
                  const isBest = items.length > 1 && item.price === minPrice;
                  return (
                    <View key={item.id} style={styles.itemCol}>
                      <Text style={[styles.valBold, isBest && { color: colors.success }]}>
                        {formatFCFA(item.price)}
                        {item.transaction === 'location' ? ` ${t.common.perMonth}` : ''}
                      </Text>
                      {isBest && (
                        <View style={styles.bestBadge}>
                          <Text style={styles.bestBadgeText}>
                            {lang === 'fr' ? 'Meilleur prix' : 'Best price'}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Prix / m² */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.rowLabel}>{lang === 'fr' ? 'Prix / m²' : 'Price / m²'}</Text>
                </View>
                {items.map(item => (
                  <View key={item.id} style={styles.itemCol}>
                    <Text style={styles.valText}>
                      {formatPricePerSqm(item.price, item.surface) || '—'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Surface */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.rowLabel}>{lang === 'fr' ? 'Surface' : 'Area'}</Text>
                </View>
                {items.map(item => {
                  const isMax = items.length > 1 && item.surface === maxSurface;
                  return (
                    <View key={item.id} style={styles.itemCol}>
                      <Text style={[styles.valBold, isMax && { color: colors.success }]}>
                        {formatSurface(item.surface)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Chambres */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.rowLabel}>{t.home.roomsLabel}</Text>
                </View>
                {items.map(item => (
                  <View key={item.id} style={styles.itemCol}>
                    <Text style={styles.valText}>{item.bedrooms ?? '—'}</Text>
                  </View>
                ))}
              </View>

              {/* État */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.rowLabel}>{lang === 'fr' ? 'État' : 'Condition'}</Text>
                </View>
                {items.map(item => (
                  <View key={item.id} style={styles.itemCol}>
                    <Text style={styles.valText}>{t.conditions[item.condition]}</Text>
                  </View>
                ))}
              </View>

              {/* Annonceur */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.rowLabel}>{t.detail.seller}</Text>
                </View>
                {items.map(item => (
                  <View key={item.id} style={styles.itemCol}>
                    <Text style={styles.valText}>{item.seller.name}</Text>
                    {item.rating != null && (
                      <View style={styles.ratingRow}>
                        <Star size={11} color={colors.goldBright} fill={colors.goldBright} />
                        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Équipements */}
              <View style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.rowLabel}>{t.detail.features}</Text>
                </View>
                {items.map(item => {
                  const feats = lang === 'fr' ? item.features : item.featuresEn;
                  return (
                    <View key={item.id} style={styles.itemCol}>
                      <Text style={styles.featsText}>
                        {feats.length > 0 ? feats.slice(0, 4).join(' • ') : '—'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      )}
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
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  table: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  labelCol: {
    width: 105,
    paddingRight: 10,
  },
  headerColLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    marginTop: 8,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  itemCol: {
    width: 165,
    paddingHorizontal: 6,
  },
  itemHeaderCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  itemBanner: {
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHeaderBody: {
    padding: 8,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    minHeight: 32,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 10,
    color: colors.textSecondary,
    flex: 1,
  },
  valBold: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.navy,
  },
  valText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successSoft,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 4,
  },
  bestBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  featsText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  ctaBtn: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '800',
  },
});
