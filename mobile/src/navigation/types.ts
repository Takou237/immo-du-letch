import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Sell: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ListingDetail: { listingId: string };
  Compare: undefined;
  Profile: undefined;
  Messages: undefined;
  Notifications: undefined;
  Support: undefined;
};
