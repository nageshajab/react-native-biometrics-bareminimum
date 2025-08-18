import { ToastAndroid } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { storeToken, getStoredToken } from './TokenHandler';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const AuthService = {
  checkToken: async (navigation: any) => {
    try {
      var credentials = await getStoredToken();
      //   const credentials = await Keychain.getGenericPassword();
      ToastAndroid.show('token read', ToastAndroid.SHORT);
      if (!credentials) {
        navigation.navigate('Login');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      navigation.navigate('Login');
      return false;
    }
  },
};

export async function getUserId(): Promise<string> {
  const token = await getStoredToken();
  if (token && 'claims' in token) {
    const claims = token.claims as {
      name?: string;
      preferred_username?: string;
      oid?: string;
      tid?: string;
    };
    return claims.oid ?? '';
  }
  return '';
}

export default AuthService;
