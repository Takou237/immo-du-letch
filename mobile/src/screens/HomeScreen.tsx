/**
 * HomeScreen — Page d'accueil IMMO DU LETCH Mobile.
 * Thème officiel du site (Navy #0B1B2B, Or #D4AF37, Fond #F8FAFC, Blanc #FFFFFF)
 * avec icônes vectorielles Lucide et traduction FR/EN complète.
 */
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppHeader } from '../components/AppHeader';
import { SearchBar } from '../components/home/SearchBar';
import { PromoBanner } from '../components/home/PromoBanner';
import { TopDealsSection } from '../components/home/TopDealsSection';
import { FeaturedCategoriesSection } from '../components/home/FeaturedCategoriesSection';
import { PropertyTypesSection } from '../components/home/PropertyTypesSection';

import { useListings } from '../hooks/useListings';
import { useFavorites } from '../hooks/useFavorites';
import { useLang } from '../i18n/LangContext';
import { PropertyType } from '../types/listing';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const PROPERTY_TYPES: PropertyType[] = ['villa', 'appartement', 'terrain', 'studio', 'bureau'];

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { lang, t } = useLang();
  const {
    getFeatured,
    countByTypeFn,
    countByTransactionFn,
    setFilters,
  } = useListings();
  const { favorites, toggleFavorite } = useFavorites();

  const deals = getFeatured(8);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleCardPress = useCallback((id: string) => {
    navigation.navigate('ListingDetail', { listingId: id });
  }, [navigation]);

  const handleViewAllDeals = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleVente = useCallback(() => {
    setFilters({ transaction: 'vente' });
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation, setFilters]);

  const handleLocation = useCallback(() => {
    setFilters({ transaction: 'location' });
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation, setFilters]);

  const handleType = useCallback((type: PropertyType) => {
    setFilters({ type });
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation, setFilters]);

  const typeItems = PROPERTY_TYPES.map(type => ({
    type,
    label: t.propertyTypes[type],
    count: countByTypeFn(type),
  }));

  const listingsWord = lang === 'fr' ? 'annonces' : 'listings';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PromoBanner
          badgeLabel={lang === 'fr' ? 'CAMEROUN • DOUALA • YAOUNDÉ • KRIBI' : 'CAMEROON • DOUALA • YAOUNDE • KRIBI'}
          title={t.home.heroTitle}
          subtitle={t.home.heroSubtitle}
          ctaLabel={t.home.heroCta}
          onPressCta={handleSearchPress}
        />

        <SearchBar
          placeholder={
            lang === 'fr'
              ? 'Rechercher... Ville • Type • Budget'
              : 'Search... City • Type • Budget'
          }
          onPress={handleSearchPress}
        />

        <TopDealsSection
          listings={deals}
          favorites={favorites}
          lang={lang}
          onPressCard={handleCardPress}
          onToggleFav={toggleFavorite}
          onPressViewAll={handleViewAllDeals}
          title={t.home.featuredTitle}
          badge={lang === 'fr' ? 'OFFRES' : 'DEALS'}
          viewAllLabel={t.home.viewAll}
          dealLabel={lang === 'fr' ? 'OPPORTUNITÉ' : 'DEAL'}
          newLabel={t.home.new.toUpperCase()}
          perMonthLabel={t.common.perMonth}
        />

        <FeaturedCategoriesSection
          title={t.home.categoriesTitle}
          buyLabel={t.home.buyTab}
          rentLabel={t.home.rentTab}
          listingsWord={listingsWord}
          countVente={countByTransactionFn('vente')}
          countLocation={countByTransactionFn('location')}
          onPressVente={handleVente}
          onPressLocation={handleLocation}
        />

        <PropertyTypesSection
          title={t.home.typeLabel}
          listingsWord={listingsWord}
          items={typeItems}
          onPress={handleType}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
});
