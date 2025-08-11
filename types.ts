import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  Login: undefined;
};



export type HomeScreenProps = NativeStackScreenProps<RootTabParamList , 'Home'>;
