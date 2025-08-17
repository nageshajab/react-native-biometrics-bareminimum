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
import { RootStackParamList, RootTabParamList } from '../types';
import AuthService from '../AuthService';
import { GetWatchlistItems } from '../api/WatchlistService';
import { getStoredToken } from '../TokenHandler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Watchlist'>;

const WatchlistScreen = ({ navigation }: Props) => {
  const [searchtxt, setSearchtxt] = useState('');
  const [pageNumber, setPgNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // ⏳ Loading state

  useEffect(() => {
    AuthService.checkToken(navigation);
    fetchEvents();
  }, [navigation, pageNumber, showAll]);
  function getOtt(ott: number) {
    switch (ott) {
      case 0:
        return 'Netflix';
      case 1:
        return 'Prime';
      case 2:
        return 'Hotstar';
      case 3:
        return 'SonyLiv';
      case 4:
        return 'Zee5';
      case 5:
        return 'YouTube';
      case 6:
        return 'Other';
    }
  }
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
        const response = await GetWatchlistItems({
          pageNumber,
          searchtxt,
          userid: claims.oid,
          pageSize: 10,
        });

        setEvents(response.data.items);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    } else {
      ToastAndroid.show('Token not found', ToastAndroid.SHORT);
    }

    setLoading(false); // Stop loading
  };

  const PreviousPage = async () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPgNo(newPage);
      // setSearchtxt('');
      // await fetchEvents();
    }
  };

  const NextPage = async () => {
    if (pageNumber < totalPages) {
      const newPage = pageNumber + 1;
      setPgNo(newPage);
      // setSearchtxt('');
      // await fetchEvents();
    }
  };

  const handleCheckChange = () => {
    setPgNo(1);
    setSearchtxt('');
    setShowAll(prev => !prev);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.eventItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text> {getOtt(item.ott)}</Text>
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
            <Text style={styles.header}>Home Screen</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.subheader}>Show All</Text>
              <CheckBox isChecked={showAll} onPress={handleCheckChange} />
            </View>
          </View>

          <View style={styles.paginationControls}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                pageNumber === 1 && styles.disabledButton,
              ]}
              onPress={PreviousPage}
              disabled={pageNumber === 1}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Showing {pageNumber} of {totalPages} pages
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                pageNumber === totalPages && styles.disabledButton,
              ]}
              onPress={NextPage}
              disabled={pageNumber === totalPages}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
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

export default WatchlistScreen;
