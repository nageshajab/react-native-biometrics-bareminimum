//import * as Keychain from 'react-native-keychain';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const AuthService = {
  checkToken: async (navigation: any) => {
    try {
      //     const credentials = await Keychain.getGenericPassword();
      // if (!credentials) {
      //   navigation.navigate('Login');
      //   return false;
      // }
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      navigation.navigate('Login');
      return false;
    }
  },
};

export default AuthService;
