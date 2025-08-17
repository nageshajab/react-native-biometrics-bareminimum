import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import CheckBox from './Checkbox';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import AuthService from '../AuthService';
import { GetPendingRents } from '../api/RentService';
import { getStoredToken } from '../TokenHandler';

type Props = BottomTabScreenProps<RootTabParamList, 'Pendingrent'>;

const PendingrentScreen = ({ navigation }: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // ⏳ Loading state

  useEffect(() => {
    AuthService.checkToken(navigation);
    fetchEvents();
  }, [navigation]);

  const fetchEvents = async () => {
    setLoading(true); // Start loading
    const token = await getStoredToken();
    if (token && 'claims' in token) {
      const claims = token.claims as {
        name?: string;
        preferred_username?: string;
        oid?: string;
        tid?: string;
      };
      try {
        const response = await GetPendingRents({
          userid: claims.oid,
          month: 8,
          year: 2025,
        });
        console.log(
          'pending rents list ' + JSON.stringify(response.data.rents),
        );

        setEvents(response.data.rents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    } else {
      ToastAndroid.show('Token not found', ToastAndroid.SHORT);
    }

    setLoading(false); // Stop loading
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.eventItem}>
      <Text style={styles.title}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading, please wait...</Text>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.header}>Pending Rents</Text>
          </View>

          <FlatList
            data={events}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 10,
  },

  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },

  list: { paddingBottom: 20 },
  eventItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default PendingrentScreen;
