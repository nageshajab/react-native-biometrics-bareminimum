import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import AuthService from '../AuthService';
import { useSession } from '../SessionContext'; // import context

type Props = BottomTabScreenProps<RootTabParamList, 'Menu'>;

const MenuScreen = ({ navigation }: Props) => {
  const { handleSignOut } = useSession();

  useEffect(() => {
    AuthService.checkToken(navigation);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button title="Logout" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default MenuScreen;
