/**
 * SearchScreen — Recherche, filtres et tri IMMO DU LETCH Mobile.
 * Principe S : composition des sous-composants, logique via useListings / useFavorites / useLang.
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, X, ArrowUpDown, SearchX, Clock, HelpCircle } from 'lucide-react-native';

import { ListingRowCard } from '../components/search/ListingRowCard';
import { FilterSheetModal } from '../components/search/FilterSheetModal';
import { PageGuideModal, GuideStep } from '../components/PageGuideModal';
import { useListings } from '../hooks/useListings';
import { useFavorites } from '../hooks/useFavorites';
import { usePageGuide } from '../hooks/usePageGuide';
import { useLang } from '../i18n/LangContext';
import { SortKey } from '../types/listing';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { formatFCFA } from '../utils/formatPrice';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const STORAGE_RECENT_QUERIES = 'immo:recentQueries';
const MAX_RECENT_QUERIES = 6;

export function SearchScreen() {
  const navigation = useNavigation<NavProp>();
  const { lang, t } = useLang();
  const {
    filteredListings,
    filters,
    setFilters,
    resetFilters,
    sortKey,
    setSortKey,
  } = useListings();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const { visible: guideVisible, openGuide, closeGuide } = usePageGuide('search');

  const guideSteps: GuideStep[] = useMemo(() => [
    {
      title: lang === 'fr' ? 'Recherche & Historique' : 'Search & History',
      description: lang === 'fr'
        ? 'Tapez une ville, un quartier ou un mot-clé. En touchant la barre, vos recherches récentes apparaissent juste en dessous.'
        : 'Type a city, district, or keyword. Tapping the bar shows your recent searches right below.',
      icon: <Search size={26} color={colors.navy} />,
    },
    {
      title: lang === 'fr' ? 'Filtres avancés' : 'Advanced filters',
      description: lang === 'fr'
        ? 'Touchez l’icône des réglages pour filtrer par transaction (Acheter/Louer), ville, type, budget, surface, équipements et documents.'
        : 'Tap the filter icon to filter by transaction, city, type, budget, area, amenities, and documents.',
      icon: <SlidersHorizontal size={26} color={colors.navy} />,
    },
    {
      title: lang === 'fr' ? 'Tri rapide' : 'Quick sorting',
      description: lang === 'fr'
        ? 'Utilisez la ligne "Trier par" pour classer les biens par prix croissant/décroissant, nouveauté, surface ou vues.'
        : 'Use the "Sort by" row to sort properties by price, newest, area, or views.',
      icon: <ArrowUpDown size={26} color={colors.navy} />,
    },
  ], [lang]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_RECENT_QUERIES);
        if (raw) setRecentQueries(JSON.parse(raw));
      } catch {
        // Silencieux
      }
    })();
  }, []);

  const persistQueries = useCallback((list: string[]) => {
    setRecentQueries(list);
    AsyncStorage.setItem(STORAGE_RECENT_QUERIES, JSON.stringify(list)).catch(() => {});
  }, []);

  const saveRecentQuery = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentQueries(prev => {
      const next = [trimmed, ...prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        MAX_RECENT_QUERIES,
      );
      AsyncStorage.setItem(STORAGE_RECENT_QUERIES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const handleSelectRecent = (q: string) => {
    setFilters({ query: q });
    saveRecentQuery(q);
    setSearchFocused(false);
    Keyboard.dismiss();
  };

  const sortOptions: { key: SortKey; label: string }[] = useMemo(() => [
    { key: 'relevance',  label: t.search.sortRelevance },
    { key: 'price_asc',  label: t.search.sortPriceAsc },
    { key: 'price_desc', label: t.search.sortPriceDesc },
    { key: 'newest',     label: t.search.sortNewest },
    { key: 'surface',    label: t.search.sortSurface },
    { key: 'views',      label: t.search.sortViews },
  ], [t]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.transaction) count++;
    if (filters.city) count++;
    if (filters.type) count++;
    if (filters.priceMin > 0) count++;
    if (filters.priceMax > 0) count++;
    if (filters.surfaceMin > 0) count++;
    if (filters.bedroomsMin > 0) count++;
    count += filters.features.length + filters.documents.length;
    return count;
  }, [filters]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Barre de recherche + bouton filtres */}
      <View style={styles.searchBarRow}>
        <View style={styles.inputWrap}>
          <Search size={17} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            value={filters.query}
            onChangeText={text => setFilters({ query: text })}
            onFocus={() => setSearchFocused(true)}
            onSubmitEditing={() => {
              saveRecentQuery(filters.query);
              setSearchFocused(false);
            }}
            placeholder={
              lang === 'fr'
                ? 'Ville, quartier, mot-clé...'
                : 'City, neighborhood, keyword...'
            }
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
          />
          {filters.query.length > 0 && (
            <TouchableOpacity onPress={() => setFilters({ query: '' })} hitSlop={8}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => {
            setSearchFocused(false);
            setFilterModalOpen(true);
          }}
          activeOpacity={0.85}
        >
          <SlidersHorizontal
            size={18}
            color={activeFilterCount > 0 ? colors.navy : colors.textPrimary}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => {
            setSearchFocused(false);
            openGuide();
          }}
          activeOpacity={0.85}
          accessibilityLabel="Guide"
        >
          <HelpCircle size={18} color={colors.navy} />
        </TouchableOpacity>
      </View>

      {/* Recherches récentes au clic sur la barre de recherche */}
      {searchFocused && recentQueries.length > 0 && (
        <View style={styles.recentBox}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentHeaderTitle}>
              {lang === 'fr' ? 'Recherches récentes' : 'Recent searches'}
            </Text>
            <View style={styles.recentHeaderActions}>
              <TouchableOpacity onPress={() => persistQueries([])} hitSlop={8}>
                <Text style={styles.recentClearText}>
                  {lang === 'fr' ? 'Effacer' : 'Clear'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSearchFocused(false);
                  Keyboard.dismiss();
                }}
                hitSlop={8}
              >
                <X size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
          {recentQueries.map(q => (
            <View key={q} style={styles.recentRow}>
              <TouchableOpacity
                style={styles.recentItemBtn}
                onPress={() => handleSelectRecent(q)}
                activeOpacity={0.75}
              >
                <Clock size={14} color={colors.textMuted} />
                <Text style={styles.recentItemText} numberOfLines={1}>
                  {q}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => persistQueries(recentQueries.filter(item => item !== q))}
                hitSlop={8}
              >
                <X size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Chips de tri horizontal */}
      <View style={styles.sortWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortScroll}
        >
          <View style={styles.sortLabelWrap}>
            <ArrowUpDown size={13} color={colors.textSecondary} />
            <Text style={styles.sortLabel}>{t.search.sortBy}:</Text>
          </View>
          {sortOptions.map(opt => {
            const active = sortKey === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortChip, active && styles.sortChipActive]}
                onPress={() => setSortKey(opt.key)}
              >
                <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filtres actifs + compteur résultats */}
      <View style={styles.summaryBar}>
        <Text style={styles.resultsCount}>
          {t.search.results(filteredListings.length)}
        </Text>
        <View style={styles.summaryActions}>
          {activeFilterCount > 0 && (
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.clearAllText}>{t.search.resetFilters}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {activeFilterCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeChipsScroll}
          style={styles.activeChipsBar}
        >
          {filters.transaction !== '' && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setFilters({ transaction: '' })}
            >
              <Text style={styles.activeChipText}>
                {filters.transaction === 'vente' ? t.home.buyTab : t.home.rentTab}
              </Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          )}
          {filters.city !== '' && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setFilters({ city: '' })}
            >
              <Text style={styles.activeChipText}>{filters.city}</Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          )}
          {filters.type !== '' && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setFilters({ type: '' })}
            >
              <Text style={styles.activeChipText}>{t.propertyTypeSingular[filters.type]}</Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          )}
          {filters.priceMin > 0 && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setFilters({ priceMin: 0 })}
            >
              <Text style={styles.activeChipText}>≥ {formatFCFA(filters.priceMin)}</Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          )}
          {filters.priceMax > 0 && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setFilters({ priceMax: 0 })}
            >
              <Text style={styles.activeChipText}>≤ {formatFCFA(filters.priceMax)}</Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          )}
          {filters.surfaceMin > 0 && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setFilters({ surfaceMin: 0 })}
            >
              <Text style={styles.activeChipText}>≥ {filters.surfaceMin} m²</Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          )}
          {filters.features.map(f => (
            <TouchableOpacity
              key={f}
              style={styles.activeChip}
              onPress={() =>
                setFilters({ features: filters.features.filter(item => item !== f) })
              }
            >
              <Text style={styles.activeChipText}>{f}</Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          ))}
          {filters.documents.map(d => (
            <TouchableOpacity
              key={d}
              style={styles.activeChip}
              onPress={() =>
                setFilters({ documents: filters.documents.filter(item => item !== d) })
              }
            >
              <Text style={styles.activeChipText}>{d}</Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          ))}
          {filters.bedroomsMin > 0 && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setFilters({ bedroomsMin: 0 })}
            >
              <Text style={styles.activeChipText}>
                {filters.bedroomsMin}+ {t.detail.bedrooms}
              </Text>
              <X size={12} color={colors.navy} />
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Liste des résultats */}
      <FlatList
        data={filteredListings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListingRowCard
            listing={item}
            isFav={isFavorite(item.id)}
            lang={lang}
            transactionLabel={t.transactions[item.transaction]}
            newLabel={t.home.new.toUpperCase()}
            perMonthLabel={t.common.perMonth}
            onPress={() => {
              if (filters.query.trim()) saveRecentQuery(filters.query);
              setSearchFocused(false);
              navigation.navigate('ListingDetail', { listingId: item.id });
            }}
            onToggleFav={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconWrap}>
              <SearchX size={34} color={colors.navy} />
            </View>
            <Text style={styles.emptyTitle}>{t.search.noResults}</Text>
            <Text style={styles.emptySub}>{t.search.noResultsSub}</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={resetFilters}>
              <Text style={styles.emptyBtnText}>{t.search.resetFilters}</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modale filtres */}
      <FilterSheetModal
        visible={filterModalOpen}
        filters={filters}
        resultCount={filteredListings.length}
        onChangeFilters={setFilters}
        onReset={resetFilters}
        onClose={() => setFilterModalOpen(false)}
      />

      <PageGuideModal
        visible={guideVisible}
        pageTitle={t.nav.search}
        steps={guideSteps}
        onClose={closeGuide}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.navy,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '800',
  },
  sortWrapper: {
    height: 42,
    flexGrow: 0,
    flexShrink: 0,
  },
  sortScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  sortLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 2,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortChipTextActive: {
    color: colors.gold,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  saveSearchText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  activeChipsBar: {
    height: 36,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 6,
  },
  activeChipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeChipText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 24,
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
  emptyBtn: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  emptyBtnText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  recentBox: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  recentHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.navy,
  },
  recentHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentClearText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  recentItemBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  recentItemText: {
    fontSize: 13,
    color: colors.navy,
    fontWeight: '500',
  },
  helpBtn: {
    width: 42,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
