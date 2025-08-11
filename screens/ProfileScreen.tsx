import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { RootTabParamList } from '../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import AuthService from '../AuthService';

type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: Props) => {
  useEffect(() => {
    AuthService.checkToken(navigation);
  }, [navigation]);

  return (
    <View>
      <Text>Profile Screen</Text>
    </View>
  );
};

export default ProfileScreen;
