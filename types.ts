import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
 Home: undefined;
  Profile: undefined;
  Menu: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  Watchlist: undefined;
  WatchlistForm: undefined;
  Pendingrent: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootTabParamList , 'Home'>;
