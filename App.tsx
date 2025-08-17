import { useEffect, useState } from 'react';
import { msalService } from './msal'; // adjust path as needed
import { ToastAndroid, SafeAreaView } from 'react-native';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import { RootTabParamList, RootStackParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigationRef';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Keychain from 'react-native-keychain';
import { clearStoredToken } from './TokenHandler';
import { SessionContext } from './SessionContext';
import MenuScreen from './screens/MenuScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const loggedIn = false; // await your logic to check login status
  //     setIsLoggedIn(loggedIn);
  //   };
  //   checkLoginStatus();
  // }, []);
  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        if (!msalService.ensureInitialized) {
          await msalService.init();
        }

        console.log('✅ MSAL initialized');

        const accounts = await msalService.getAccounts();
        console.log('accounts', accounts);

        if (accounts.length > 0) {
          // Optionally acquire token silently to confirm session
          try {
            await msalService.getTokenSilent(accounts[0], ['User.Read']);
            setIsLoggedIn(true);
            console.log('✅ Session restored');
          } catch {
            console.log('⚠️ Silent token failed, user must sign in');
          }
        }
      } catch (error) {
        console.error('❌ MSAL init failed:', error);
      }
    };

    initializeMSAL();
  }, []);
  const handleSignOut = async () => {
    try {
      const accounts = await msalService.getAccounts();
      if (accounts.length > 0) {
        await msalService.signOut(accounts[0]);
        console.log('Signed out');
      }
      await Keychain.resetGenericPassword();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };
  const TabNavigator = ({
    handleLoginStatusChange,
    handleSignOut,
  }: {
    handleLoginStatusChange: (loggedIn: boolean) => void;
    handleSignOut: () => void;
  }) => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerRight: () => <Button title="Logout" onPress={handleSignOut} />,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
      </Tab.Navigator>
    );
  };

  const handleLoginStatusChange = async (loggedIn: boolean) => {
    if (!loggedIn) {
      await clearStoredToken();
      //await Keychain.resetGenericPassword();
      // await Keychain.resetGenericPassword({ service: 'com.yourapp.msalToken' });
      // cachedToken = null;
    }
    setIsLoggedIn(loggedIn);
  };

  return (
    <SessionContext.Provider value={{ handleSignOut, handleLoginStatusChange }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen
              name="Tabs"
              component={() => (
                <TabNavigator
                  handleLoginStatusChange={handleLoginStatusChange}
                  handleSignOut={handleSignOut}
                />
              )}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen
                  {...props}
                  onLoginStatusChange={handleLoginStatusChange}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SessionContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
