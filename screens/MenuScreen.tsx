import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList, RootTabParamList } from '../types';
import AuthService from '../AuthService';
import { useSession } from '../SessionContext';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

type Props = BottomTabScreenProps<RootTabParamList, 'Menu'>;

const MenuScreen = ({ navigation }: Props) => {
  const { handleSignOut } = useSession();
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    AuthService.checkToken(navigation);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <View style={styles.button}>
        <Button
          title="Watchlist"
          onPress={() => rootNavigation.navigate('Watchlist')}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Pending Rents"
          onPress={() => rootNavigation.navigate('Pendingrent')}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Passwords"
          onPress={() => rootNavigation.navigate('Passwordlist')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  button: { marginBottom: 10 },
});

export default MenuScreen;
