import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../AuthService';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  useEffect(() => {
    AuthService.checkToken(navigation);
  }, [navigation]);

  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
};

export default HomeScreen;
