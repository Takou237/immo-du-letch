/**
 * MySearchesScreen — Recherches sauvegardées & Annonceurs suivis (IMMO DU LETCH Mobile).
 * Inspiré de mobile.de "My Searches" / "My Dealers", thème officiel du site.
 */
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bookmark,
  Users,
  Trash2,
  Play,
  ShieldCheck,
  Search,
  UserMinus,
} from 'lucide-react-native';

import { AppHeader } from '../components/AppHeader';
import { useListings } from '../hooks/useListings';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { useLang } from '../i18n/LangContext';
import { filterListings } from '../utils/listingUtils';
import { formatFCFA } from '../utils/formatPrice';
import { RootStackParamList } from '../navigation/types';
import { Filters, Seller } from '../types/listing';
import { colors } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function MySearchesScreen() {
  const navigation = useNavigation<NavProp>();
  const { lang, t } = useLang();
  const { listings, setFilters } = useListings();
  const {
    savedSearches,
    followedSellerIds,
    deleteSearch,
    toggleFollowSeller,
  } = useSavedSearches();

  const [tab, setTab] = useState<'searches' | 'sellers'>('searches');

  const followedSellers = useMemo(() => {
    const map = new Map<string, { seller: Seller; count: number; firstListingId: string }>();
    for (const l of listings) {
      if (!followedSellerIds.includes(l.seller.id)) continue;
      const existing = map.get(l.seller.id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(l.seller.id, { seller: l.seller, count: 1, firstListingId: l.id });
      }
    }
    return Array.from(map.values());
  }, [listings, followedSellerIds]);

  const buildFilterTags = (f: Filters): string[] => {
    const tags: string[] = [];
    if (f.transaction) tags.push(f.transaction === 'vente' ? t.home.buyTab : t.home.rentTab);
    if (f.city) tags.push(f.city);
    if (f.type) tags.push(t.propertyTypeSingular[f.type]);
    if (f.priceMax > 0) tags.push(`≤ ${formatFCFA(f.priceMax)}`);
    if (f.bedroomsMin > 0) tags.push(`${f.bedroomsMin}+ ${t.detail.bedrooms}`);
    if (f.query.trim()) tags.push(`"${f.query.trim()}"`);
    return tags;
  };

  const handleResume = (f: Filters) => {
    setFilters(f);
    navigation.navigate('MainTabs', { screen: 'Search' });
  };

  return (
    <View style={styles.root}>
      <AppHeader />

      {/* En-tête + Onglets */}
      <View style={styles.topSection}>
        <Text style={styles.pageTitle}>{t.mySearches.title}</Text>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'searches' && styles.tabBtnActive]}
            onPress={() => setTab('searches')}
          >
            <Bookmark
              size={15}
              color={tab === 'searches' ? colors.gold : colors.textSecondary}
            />
            <Text style={[styles.tabText, tab === 'searches' && styles.tabTextActive]}>
              {t.mySearches.savedTitle} ({savedSearches.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'sellers' && styles.tabBtnActive]}
            onPress={() => setTab('sellers')}
          >
            <Users
              size={15}
              color={tab === 'sellers' ? colors.gold : colors.textSecondary}
            />
            <Text style={[styles.tabText, tab === 'sellers' && styles.tabTextActive]}>
              {t.mySearches.followedSellers} ({followedSellers.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === 'searches' ? (
        <FlatList
          data={savedSearches}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const tags = buildFilterTags(item.filters);
            const matchCount = filterListings(listings, item.filters).length;
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.matchText}>
                    {t.search.results(matchCount)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteIconBtn}
                    onPress={() => deleteSearch(item.id)}
                    hitSlop={8}
                  >
                    <Trash2 size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>

                <View style={styles.tagsWrap}>
                  {tags.length > 0 ? (
                    tags.map((tag, idx) => (
                      <View key={idx} style={styles.tagChip}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.tagChip}>
                      <Text style={styles.tagText}>
                        {lang === 'fr' ? 'Tous les biens' : 'All properties'}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.resumeBtn}
                  onPress={() => handleResume(item.filters)}
                  activeOpacity={0.85}
                >
                  <Play size={14} color={colors.navy} fill={colors.navy} />
                  <Text style={styles.resumeBtnText}>{t.mySearches.resumeSearch}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconWrap}>
                <Bookmark size={32} color={colors.navy} />
              </View>
              <Text style={styles.emptyTitle}>{t.mySearches.empty}</Text>
              <Text style={styles.emptySub}>{t.mySearches.emptySub}</Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
              >
                <Search size={15} color={colors.navy} />
                <Text style={styles.exploreBtnText}>{t.home.searchButton}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <FlatList
          data={followedSellers}
          keyExtractor={item => item.seller.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sellerCard}
              onPress={() =>
                navigation.navigate('ListingDetail', { listingId: item.firstListingId })
              }
              activeOpacity={0.85}
            >
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>
                  {item.seller.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{item.seller.name}</Text>
                  {item.seller.verified && (
                    <ShieldCheck size={15} color={colors.success} />
                  )}
                </View>
                <Text style={styles.sellerMeta}>
                  {item.seller.type === 'professionnel'
                    ? (lang === 'fr' ? 'Professionnel' : 'Professional')
                    : (lang === 'fr' ? 'Particulier' : 'Private seller')}{' '}
                  • {item.count} {lang === 'fr' ? 'annonce(s)' : 'listing(s)'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.unfollowBtn}
                onPress={() => toggleFollowSeller(item.seller.id)}
                hitSlop={8}
              >
                <UserMinus size={16} color={colors.danger} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconWrap}>
                <Users size={32} color={colors.navy} />
              </View>
              <Text style={styles.emptyTitle}>{t.mySearches.noSellers}</Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
              >
                <Search size={15} color={colors.navy} />
                <Text style={styles.exploreBtnText}>{t.home.searchButton}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabBtnActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.gold,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.navy,
  },
  deleteIconBtn: {
    padding: 4,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 10,
  },
  resumeBtnText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    color: colors.gold,
    fontSize: 17,
    fontWeight: '800',
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sellerMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  unfollowBtn: {
    padding: 8,
    backgroundColor: colors.dangerSoft,
    borderRadius: 10,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  exploreBtnText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '800',
  },
});
