/**
 * HomeScreen — Page d'accueil IMMO DU LETCH Mobile.
 * Ordre des sections :
 * 1. PromoBanner
 * 2. SearchBar
 * 3. Top DEALS for you (4 meilleures offres)
 * 4. Que recherchez-vous ? (grille 2x3 web)
 * 5. Biens en vedette
 */
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Flame, LayoutGrid, Bell } from 'lucide-react-native';

import { AppHeader } from '../components/AppHeader';
import { SearchBar } from '../components/home/SearchBar';
import { PromoBanner } from '../components/home/PromoBanner';
import { TopDealsSection } from '../components/home/TopDealsSection';
import { FeaturedCategoriesSection } from '../components/home/FeaturedCategoriesSection';
import { PageGuideModal, GuideStep } from '../components/PageGuideModal';

import { useListings } from '../hooks/useListings';
import { useFavorites } from '../hooks/useFavorites';
import { usePageGuide } from '../hooks/usePageGuide';
import { useLang } from '../i18n/LangContext';
import { PropertyType } from '../types/listing';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { lang, t } = useLang();
  const isFr = lang === 'fr';
  const { listings, getFeatured, setFilters, resetFilters } = useListings();
  const { favorites, toggleFavorite } = useFavorites();
  const { visible: guideVisible, openGuide, closeGuide } = usePageGuide('home', 1900);

  const guideSteps: GuideStep[] = useMemo(() => [
    {
      title: isFr ? 'Barre de recherche rapide' : 'Quick search bar',
      description: isFr
        ? 'Touchez la barre de recherche ou le bouton "Rechercher" pour trouver un bien par ville, quartier ou mot-clé.'
        : 'Tap the search bar or "Search" button to find a property by city, district, or keyword.',
      icon: <Search size={26} color={colors.navy} />,
    },
    {
      title: isFr ? 'Top DEALS for you' : 'Top DEALS for you',
      description: isFr
        ? 'Retrouvez ici les 4 meilleures offres du moment et faites défiler horizontalement pour voir chaque bien.'
        : 'Discover the top 4 current deals and swipe horizontally to explore each property.',
      icon: <Flame size={26} color="#EA580C" />,
    },
    {
      title: isFr ? 'Que recherchez-vous ?' : 'What are you looking for?',
      description: isFr
        ? 'Accédez en un clic aux villas, appartements, terrains, studios, bureaux ou locations meublées.'
        : 'Jump in one tap to villas, apartments, land, studios, offices, or furnished rentals.',
      icon: <LayoutGrid size={26} color={colors.navy} />,
    },
    {
      title: isFr ? 'Notifications & Profil' : 'Notifications & Profile',
      description: isFr
        ? 'En haut à droite, consultez vos alertes (cloche), accédez à votre compte (icône profil) ou rouvrez ce guide (?).'
        : 'At the top right, view alerts (bell), open your account (profile icon), or reopen this guide (?).',
      icon: <Bell size={26} color={colors.navy} />,
    },
  ], [isFr]);

  // 4 meilleures offres pour "Top DEALS for you"
  const topFourDeals = useMemo(() => {
    const sorted = [...listings].sort((a, b) => {
      const scoreA = (a.priceDropped ? 100 : 0) + (a.rating ?? 0) * 10 + (a.isNew ? 5 : 0);
      const scoreB = (b.priceDropped ? 100 : 0) + (b.rating ?? 0) * 10 + (b.isNew ? 5 : 0);
      return scoreB - scoreA;
    });
    return sorted.slice(0, 4);
  }, [listings]);

  const featuredListings = getFeatured(8);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleCardPress = useCallback((id: string) => {
    navigation.navigate('ListingDetail', { listingId: id });
  }, [navigation]);

  const handleViewAllDeals = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleSelectType = useCallback((type: PropertyType) => {
    resetFilters();
    setFilters({ type });
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation, resetFilters, setFilters]);

  const handleSelectFurnished = useCallback(() => {
    resetFilters();
    setFilters({ transaction: 'location', features: ['Meublé'] });
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation, resetFilters, setFilters]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <AppHeader onHelpPress={openGuide} />

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

        {/* 1. Top DEALS for you (4 meilleures offres) */}
        <TopDealsSection
          listings={topFourDeals}
          favorites={favorites}
          lang={lang}
          onPressCard={handleCardPress}
          onToggleFav={toggleFavorite}
          onPressViewAll={handleViewAllDeals}
          title="Top DEALS for you"
          badge="DEALS"
          viewAllLabel={t.home.viewAll}
          dealLabel={lang === 'fr' ? 'OPPORTUNITÉ' : 'DEAL'}
          newLabel={t.home.new.toUpperCase()}
          perMonthLabel={t.common.perMonth}
          isTopDealsBanner
        />

        {/* 2. Que recherchez-vous ? (grille 2x3 web) */}
        <FeaturedCategoriesSection
          title={t.home.categoriesTitle}
          lang={lang}
          onSelectType={handleSelectType}
          onSelectFurnished={handleSelectFurnished}
        />

        {/* 3. Biens en vedette */}
        <TopDealsSection
          listings={featuredListings}
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
      </ScrollView>

      <PageGuideModal
        visible={guideVisible}
        pageTitle={t.nav.home}
        steps={guideSteps}
        onClose={closeGuide}
      />
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
    paddingBottom: 24,
  },
});
