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

export default AuthService;
