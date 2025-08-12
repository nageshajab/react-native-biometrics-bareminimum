import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '../types';
//import * as Keychain from 'react-native-keychain';
import { navigationRef } from '../navigationRef';
import { RootStackParamList } from '../types';

type LoginScreenProps = {
  onLoginStatusChange: (loggedIn: boolean) => void;
};

const LoginScreen = ({ onLoginStatusChange }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (username === 'test' && password === 'test') {
      try {
        // await Keychain.setGenericPassword('token', 'your_token_value');
        onLoginStatusChange(true);
      } catch (error) {
        console.error('Error storing token:', error);
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />

      {/* Fingerprint Icon */}
      <View style={styles.iconContainer}>
        <Icon name="fingerprint" size={40} color="#007AFF" />
        <Text style={styles.iconText}>Use Fingerprint</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  iconContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
    color: '#007AFF',
  },
});

export default LoginScreen;
