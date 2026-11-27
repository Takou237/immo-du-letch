/**
 * FavoritesScreen — Favoris & Consultés récemment (IMMO DU LETCH Mobile).
 * Principe S : affichage via useFavorites + useListings + useLang.
 */
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Clock, Trash2, Search, Scale } from 'lucide-react-native';

import { AppHeader } from '../components/AppHeader';
import { ListingRowCard } from '../components/search/ListingRowCard';
import { ListingCard } from '../components/home/ListingCard';
import { useListings } from '../hooks/useListings';
import { useFavorites } from '../hooks/useFavorites';
import { useCompare } from '../hooks/useCompare';
import { useLang } from '../i18n/LangContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation = useNavigation<NavProp>();
  const { lang, t } = useLang();
  const { listings } = useListings();
  const { favorites, recentlyViewed, toggleFavorite, clearRecent } = useFavorites();
  const { compareIds, clearCompare } = useCompare();

  const [tab, setTab] = useState<'favorites' | 'recent'>('favorites');

  const favListings = useMemo(
    () =>
      favorites
        .map(id => listings.find(l => l.id === id))
        .filter((l): l is NonNullable<typeof l> => Boolean(l)),
    [favorites, listings],
  );

  const recentListings = useMemo(
    () =>
      recentlyViewed
        .map(id => listings.find(l => l.id === id))
        .filter((l): l is NonNullable<typeof l> => Boolean(l)),
    [recentlyViewed, listings],
  );

  return (
    <View style={styles.root}>
      <AppHeader />

      {/* En-tête + Onglets */}
      <View style={styles.topSection}>
        <Text style={styles.pageTitle}>{t.favorites.title}</Text>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'favorites' && styles.tabBtnActive]}
            onPress={() => setTab('favorites')}
          >
            <Heart
              size={15}
              color={tab === 'favorites' ? colors.gold : colors.textSecondary}
              fill={tab === 'favorites' ? colors.gold : 'transparent'}
            />
            <Text style={[styles.tabText, tab === 'favorites' && styles.tabTextActive]}>
              {t.nav.favorites} ({favListings.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'recent' && styles.tabBtnActive]}
            onPress={() => setTab('recent')}
          >
            <Clock
              size={15}
              color={tab === 'recent' ? colors.gold : colors.textSecondary}
            />
            <Text style={[styles.tabText, tab === 'recent' && styles.tabTextActive]}>
              {t.favorites.recentTitle} ({recentListings.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === 'favorites' ? (
        <FlatList
          data={favListings}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingRowCard
              listing={item}
              isFav
              lang={lang}
              transactionLabel={t.transactions[item.transaction]}
              newLabel={t.home.new.toUpperCase()}
              perMonthLabel={t.common.perMonth}
              onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
              onToggleFav={() => toggleFavorite(item.id)}
            />
          )}
          ListFooterComponent={
            recentListings.length > 0 ? (
              <View style={styles.recentFooter}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentHeaderTitle}>{t.favorites.recentTitle}</Text>
                  <TouchableOpacity style={styles.clearBtn} onPress={clearRecent}>
                    <Trash2 size={13} color={colors.textSecondary} />
                    <Text style={styles.clearBtnText}>{t.favorites.clearCompare}</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recentListings.map(item => (
                    <ListingCard
                      key={item.id}
                      listing={item}
                      isFav={favorites.includes(item.id)}
                      lang={lang}
                      onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
                      onToggleFav={() => toggleFavorite(item.id)}
                      dealLabel={lang === 'fr' ? 'OPPORTUNITÉ' : 'DEAL'}
                      newLabel={t.home.new.toUpperCase()}
                      perMonthLabel={t.common.perMonth}
                    />
                  ))}
                  <View style={{ width: 16 }} />
                </ScrollView>
              </View>
            ) : undefined
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconWrap}>
                <Heart size={32} color={colors.navy} />
              </View>
              <Text style={styles.emptyTitle}>{t.favorites.empty}</Text>
              <Text style={styles.emptySub}>{t.favorites.emptySub}</Text>
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
          data={recentListings}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            recentListings.length > 0 ? (
              <View style={styles.recentActionRow}>
                <TouchableOpacity style={styles.clearBtn} onPress={clearRecent}>
                  <Trash2 size={14} color={colors.danger} />
                  <Text style={[styles.clearBtnText, { color: colors.danger }]}>
                    {t.favorites.clearCompare}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : undefined
          }
          renderItem={({ item }) => (
            <ListingRowCard
              listing={item}
              isFav={favorites.includes(item.id)}
              lang={lang}
              transactionLabel={t.transactions[item.transaction]}
              newLabel={t.home.new.toUpperCase()}
              perMonthLabel={t.common.perMonth}
              onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
              onToggleFav={() => toggleFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconWrap}>
                <Clock size={32} color={colors.navy} />
              </View>
              <Text style={styles.emptyTitle}>{t.home.noRecent}</Text>
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

      {compareIds.length > 0 && (
        <View style={styles.compareBar}>
          <View style={styles.compareBarLeft}>
            <Scale size={16} color={colors.gold} />
            <Text style={styles.compareBarText}>
              {t.favorites.compareTitle} ({compareIds.length}/3)
            </Text>
          </View>
          <View style={styles.compareBarActions}>
            <TouchableOpacity onPress={clearCompare}>
              <Text style={styles.compareClearText}>{t.favorites.clearCompare}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.compareOpenBtn}
              onPress={() => navigation.navigate('Compare')}
            >
              <Text style={styles.compareOpenText}>{t.favorites.openCompare}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  tabBtnActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.gold,
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  recentActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  recentFooter: {
    marginTop: 12,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  recentHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
  compareBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.navy,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  compareBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compareBarText: {
    color: colors.textOnNavy,
    fontSize: 13,
    fontWeight: '700',
  },
  compareBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compareClearText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  compareOpenBtn: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  compareOpenText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '800',
  },
});
