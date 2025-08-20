import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
 Home: undefined;
  Profile: undefined;
  Menu: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Tabs: NavigatorScreenParams<RootTabParamList>; // ✅ Accepts nested tab params
  Watchlist: undefined;
  WatchlistForm: { id?: string };
  Pendingrent: undefined;
  Passwordlist:undefined;
  PasswordForm: { id?: string };
};


export type HomeScreenProps = NativeStackScreenProps<RootTabParamList , 'Home'>;
