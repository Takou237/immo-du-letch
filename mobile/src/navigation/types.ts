import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  MySearches: undefined;
  Favorites: undefined;
  Sell: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ListingDetail: { listingId: string };
  Compare: undefined;
  Profile: undefined;
};
