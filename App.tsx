import { useEffect, useState } from 'react';
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

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = false; // await your logic to check login status
      setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
  }, []);

  const TabNavigator = ({
    handleLoginStatusChange,
  }: {
    handleLoginStatusChange: (loggedIn: boolean) => void;
  }) => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerRight: () => (
            <Button
              title="Logout"
              onPress={() => handleLoginStatusChange(false)}
            />
          ),
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  };

  const handleLoginStatusChange = async (loggedIn: boolean) => {
    if (!loggedIn) {
      await Keychain.resetGenericPassword();
    }
    setIsLoggedIn(loggedIn);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen
            name="Tabs"
            component={() => (
              <TabNavigator handleLoginStatusChange={handleLoginStatusChange} />
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
