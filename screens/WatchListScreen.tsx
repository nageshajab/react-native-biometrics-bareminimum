import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
  Button,
} from 'react-native';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootTabParamList } from '../types';
import AuthService from '../AuthService';
import {
  GetWatchlistItems,
  DeleteWatchlistitem,
} from '../api/WatchlistService';
import { getStoredToken } from '../TokenHandler';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or use any icon set you prefer

type Props = NativeStackScreenProps<RootStackParamList, 'Watchlist'>;
type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

const WatchlistScreen = ({ navigation }: Props) => {
  const [searchtxt, setSearchtxt] = useState('');
  const [pageNumber, setPgNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // ⏳ Loading state
  const rootNavigation = useNavigation<NavigationProp>();

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
  const confirmDelete = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWatchlistItem(id),
        },
      ],
      { cancelable: true },
    );
  };

  const deleteWatchlistItem = async (id: string) => {
    await DeleteWatchlistitem(id)
      .then(() => {
        ToastAndroid.show(
          'Watchlist item deleted successfully',
          ToastAndroid.SHORT,
        );
        fetchEvents();
      })
      .catch(error => {
        console.error('Error deleting watchlist item:', error);
        ToastAndroid.show('Error deleting watchlist item', ToastAndroid.SHORT);
      });
  };
  const PreviousPage = async () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPgNo(newPage);
      // setSearchtxt('');
      // await fetchEvents();
    }
  };
  const AddNew = async () => {};
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
      <View style={styles.itemContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.ott}>{getOtt(item.ott)}</Text>
        </View>

        <TouchableOpacity onPress={() => confirmDelete(item.id)}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
  // const rootNavigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
            <Button
              title="Add New"
              onPress={() =>
                rootNavigation.navigate('WatchlistForm', { id: '' })
              }
            />
            <Button
              title="Back"
              onPress={() =>
                rootNavigation.navigate('Tabs', {
                  screen: 'Home',
                })
              }
            />
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
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },

  ott: {
    marginTop: 4,
    color: '#555',
  },
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
    marginTop: 10,
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
