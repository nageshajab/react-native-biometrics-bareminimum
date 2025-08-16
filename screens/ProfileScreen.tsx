import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import AuthService from '../AuthService';
import { getStoredToken, storeToken } from '../TokenHandler';

type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: Props) => {
  const [userDetails, setUserDetails] = useState<{
    name?: string;
    email?: string;
    oid?: string;
    tenantId?: string;
  }>({});

  useEffect(() => {
    const loadUserDetails = async () => {
      const token = await getStoredToken();
      console.log('Token claims:', token);
      if (token && 'claims' in token) {
        const claims = token.claims as {
          name?: string;
          preferred_username?: string;
          oid?: string;
          tid?: string;
        };

        setUserDetails({
          name: claims.name,
          email: claims.preferred_username,
          oid: claims.oid,
          tenantId: claims.tid,
        });
      }
    };

    loadUserDetails();
  }, []);

  useEffect(() => {
    AuthService.checkToken(navigation);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      <Text>Name: {userDetails.name}</Text>
      <Text>Email: {userDetails.email}</Text>
      <Text>Object ID: {userDetails.oid}</Text>
      <Text>Tenant ID: {userDetails.tenantId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default ProfileScreen;
