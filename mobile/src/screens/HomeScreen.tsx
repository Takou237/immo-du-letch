/**
 * HomeScreen — Page d'accueil IMMO DU LETCH Mobile.
 * Dark theme fidèle aux screenshots mobile.de.
 * Architecture SOLID + Providers.
 *
 * Principe D : dépend uniquement des hooks useListings, useFavorites, useLang.
 * Principe S : ne contient que la composition des sections — logique déléguée aux providers/utils.
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

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const TYPE_ITEMS = [
  { type: 'villa'       as PropertyType, emoji: '🏡', labelFr: 'Villa',       labelEn: 'Villa' },
  { type: 'appartement' as PropertyType, emoji: '🏢', labelFr: 'Appartement', labelEn: 'Apartment' },
  { type: 'terrain'     as PropertyType, emoji: '🌿', labelFr: 'Terrain',     labelEn: 'Land' },
  { type: 'studio'      as PropertyType, emoji: '🛏️', labelFr: 'Studio',      labelEn: 'Studio' },
  { type: 'bureau'      as PropertyType, emoji: '🏪', labelFr: 'Bureau',      labelEn: 'Office' },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { lang } = useLang();
  const {
    getFeatured,
    countByTypeFn,
    countByTransactionFn,
    setFilters,
  } = useListings();
  const { favorites, toggleFavorite } = useFavorites();

  const deals = getFeatured(8);

  /* ── Handlers ── */
  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' } as never);
  }, [navigation]);

  const handleCardPress = useCallback((id: string) => {
    navigation.navigate('ListingDetail', { listingId: id });
  }, [navigation]);

  const handleViewAllDeals = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' } as never);
  }, [navigation]);

  const handleVente = useCallback(() => {
    setFilters({ transaction: 'vente' });
    navigation.navigate('MainTabs', { screen: 'Search' } as never);
  }, [navigation, setFilters]);

  const handleLocation = useCallback(() => {
    setFilters({ transaction: 'location' });
    navigation.navigate('MainTabs', { screen: 'Search' } as never);
  }, [navigation, setFilters]);

  const handleType = useCallback((type: PropertyType) => {
    setFilters({ type });
    navigation.navigate('MainTabs', { screen: 'Search' } as never);
  }, [navigation, setFilters]);

  const handlePromoCta = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' } as never);
  }, [navigation]);

  /* ── Counts pour types ── */
  const typeItems = TYPE_ITEMS.map(item => ({
    ...item,
    count: countByTypeFn(item.type),
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header fixe */}
      <AppHeader />

      {/* Contenu scrollable */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Bannière hero */}
        <PromoBanner
          title={lang === 'fr'
            ? 'Trouvez le bien\nqui vous ressemble.'
            : 'Find the property\nthat suits you.'}
          subtitle={lang === 'fr'
            ? 'Acheter, louer ou investir en toute confiance\nau Cameroun.'
            : 'Buy, rent or invest with confidence\nin Cameroon.'}
          ctaLabel={lang === 'fr' ? 'DÉCOUVRIR' : 'EXPLORE'}
          onPressCta={handlePromoCta}
        />

        {/* Barre de recherche pill */}
        <SearchBar
          placeholder={
            lang === 'fr'
              ? 'Rechercher... Ville • Type • Budget'
              : 'Search... City • Type • Budget'
          }
          onPress={handleSearchPress}
        />

        {/* Top offres */}
        <TopDealsSection
          listings={deals}
          favorites={favorites}
          lang={lang}
          onPressCard={handleCardPress}
          onToggleFav={toggleFavorite}
          onPressViewAll={handleViewAllDeals}
          titleFr="Top offres"
          titleEn="Top deals"
          badgeFr="OFFRES"
          badgeEn="DEALS"
          viewAllFr="Voir tout"
          viewAllEn="Show all"
          dealFr="OPPORTUNITÉ"
          dealEn="DEAL"
          newFr="NOUVEAU"
          newEn="NEW"
          priceDropFr="Prix baissé"
          priceDropEn="Price drop"
        />

        {/* Catégories VENTE / LOCATION */}
        <FeaturedCategoriesSection
          lang={lang}
          countVente={countByTransactionFn('vente')}
          countLocation={countByTransactionFn('location')}
          onPressVente={handleVente}
          onPressLocation={handleLocation}
        />

        {/* Types de biens */}
        <PropertyTypesSection
          lang={lang}
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
    backgroundColor: '#111827',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
});
