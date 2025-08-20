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
import { getUserId } from '../AuthService';
import { GetPendingRents, createRent } from '../api/RentService';
import { getStoredToken } from '../TokenHandler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';
type Props = NativeStackScreenProps<RootStackParamList, 'Pendingrent'>;

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
        // console.log(
        //   'pending rents list ' + JSON.stringify(response.data.rents),
        // );

        setEvents(response.data.rents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    } else {
      ToastAndroid.show('Token not found', ToastAndroid.SHORT);
    }

    setLoading(false); // Stop loading
  };
  const handleCreateRent = async (item: any) => {
    var month = new Date().getMonth() + 1;
    var formattedMonth = month < 10 ? `0${month}` : month.toString();
    const userId = await getUserId();
    try {
      const payload = {
        date: `${new Date().getFullYear()}-${formattedMonth}-03`,
        paidAmount: 0,
        remainingAmount: 0,
        mseb: 0,
        tenantName: item.tenantName,
        userid: userId,
      };

      await createRent(payload);
      ToastAndroid.show('✅ Rent created successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('❌ Rent creation failed:', error);
      ToastAndroid.show('❌ Failed to create rent', ToastAndroid.SHORT);
    }
  };
  const addRent = async (item: any) => {
    Alert.alert(
      'Confirm',
      `Are you sure you want to add rent for ${item.tenantName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          style: 'destructive',
          onPress: async () => {
            await handleCreateRent(item);
            await fetchEvents(); // Refresh after success
          },
        },
      ],
      { cancelable: true },
    );
  };
  const exportdata = async () => {
    if (!events || events.length === 0) {
      ToastAndroid.show('No data to export', ToastAndroid.SHORT);
      return;
    }

    const csvHeader = 'Tenant Name,Paid Amount,Remaining Amount,MSEB\n';
    const csvRows = events.map(
      item =>
        `${item.tenantName},${item.paidAmount || 0},${
          item.remainingAmount || 0
        },${item.mseb || 0}`,
    );
    const csvString = csvHeader + csvRows.join('\n');

    // try {
    //   const path = `${
    //     RNFS.DocumentDirectoryPath
    //   }/pending_rents_${Date.now()}.csv`;
    //   await RNFS.writeFile(path, csvString, 'utf8');

    //   await Share.open({
    //     url: `file://${path}`,
    //     type: 'text/csv',
    //     title: 'Export Pending Rents',
    //     failOnCancel: false,
    //   });
    // } catch (error) {
    //   console.error('❌ Export failed:', error);
    //   ToastAndroid.show('❌ Export failed', ToastAndroid.SHORT);
    // }
  };
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.eventItem}>
      <TouchableOpacity onPress={() => addRent(item)}>
        <Text style={styles.title}>{item.tenantName}</Text>
      </TouchableOpacity>
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
              marginBottom: 10,
            }}
          >
            <Text style={styles.header}>Pending Rents</Text>
            <TouchableOpacity onPress={async () => await exportdata()}>
              <Text style={styles.headerButton}>Export</Text>
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
  headerButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
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
