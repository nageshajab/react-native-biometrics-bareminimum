import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import {
  Watchlist,
  Status,
  WatchlistType,
  Language,
  Genre,
  Rating,
  Ott,
} from '../watchlisttypes';
import {
  getwachlistitem,
  createWatchlistItem,
  updateWatchlistItem,
} from '../api/WatchlistService';
import { RootStackParamList } from '../types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { getUserId } from '../AuthService';

type Props = NativeStackScreenProps<RootStackParamList, 'WatchlistForm'>;

const WatchlistForm: React.FC<Props> = ({ route, navigation }) => {
  const [form, setForm] = useState<Watchlist | null>(null);
  const { id } = route.params || {};
  const [loading, setLoading] = useState<boolean>(!!id);
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (id) {
      // Replace with your actual API call
      getwachlistitem(id)
        .then(res => {
          const formattedDate = res.data.date.split('T')[0];
          setForm({ ...res.data, date: formattedDate });
          setLoading(false);
        })
        .catch(() => {
          // Handle error, fallback to empty form
          setForm(getEmptyForm());
          setLoading(false);
        });
    } else {
      setForm(getEmptyForm());
    }
  }, [id]);

  const getEmptyForm = (): Watchlist => ({
    title: '',
    date: new Date().toISOString().split('T')[0],
    status: Status.NotStarted,
    userId: '',
    type: WatchlistType.Movie,
    language: Language.English,
    genre: Genre.Action,
    rating: Rating.ThreeStars,
    ott: Ott.Netflix,
  });

  const handleChange = (key: keyof Watchlist, value: any) => {
    setForm(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  const enumToOptions = (
    e: Record<string, string | number>,
  ): { label: string; value: number }[] => {
    return Object.entries(e)
      .filter(([key]) => isNaN(Number(key))) // Filter out reverse mappings
      .map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').trim(), // Optional: format label
        value: value as number,
      }));
  };

  if (loading || !form) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  const handleSubmit = async () => {
    if (!form) return;

    const userId = await getUserId(); // Replace with dynamic value if needed
    const formWithUser = { ...form, userId };

    try {
      if (id) {
        await updateWatchlistItem(formWithUser);
        ToastAndroid.show(
          'Watchlist item updated successfully',
          ToastAndroid.SHORT,
        );
      } else {
        await createWatchlistItem(formWithUser);
        ToastAndroid.show(
          'Watchlist item created successfully',
          ToastAndroid.SHORT,
        );
      }

      rootNavigation.navigate('Watchlist');
    } catch (err) {
      ToastAndroid.show('Error submitting form', ToastAndroid.SHORT);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Title>{id ? 'Edit Watchlist Item' : 'Add Watchlist Item'}</Title>

      <TextInput
        label="Title"
        value={form.title}
        onChangeText={text => handleChange('title', text)}
        style={styles.input}
      />

      <TextInput
        label="Date"
        value={form.date}
        onChangeText={text => handleChange('date', text)}
        style={styles.input}
      />

      <Dropdown
        label="Status"
        value={form.status}
        onValueChange={v => handleChange('status', v)}
        options={enumToOptions(Status)}
      />
      <Dropdown
        label="Type"
        value={form.type}
        onValueChange={v => handleChange('type', v)}
        options={enumToOptions(WatchlistType)}
      />
      <Dropdown
        label="Language"
        value={form.language}
        onValueChange={v => handleChange('language', v)}
        options={enumToOptions(Language)}
      />
      <Dropdown
        label="Genre"
        value={form.genre}
        onValueChange={v => handleChange('genre', v)}
        options={enumToOptions(Genre)}
      />
      <Dropdown
        label="Rating"
        value={form.rating}
        onValueChange={v => handleChange('rating', v)}
        options={enumToOptions(Rating)}
      />
      <Dropdown
        label="OTT Platform"
        value={form.ott}
        onValueChange={v => handleChange('ott', v)}
        options={enumToOptions(Ott)}
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        {id ? 'Update' : 'Add'}
      </Button>

      <Button
        mode="contained"
        onPress={() => rootNavigation.navigate('Watchlist')}
        style={styles.button}
      >
        Back
      </Button>
    </ScrollView>
  );
};
const Dropdown = ({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: number;
  onValueChange: (val: number) => void;
  options: { label: string; value: number }[];
}) => (
  <View style={styles.dropdown}>
    <RNPickerSelect
      onValueChange={onValueChange}
      items={options}
      value={value}
      placeholder={{ label: `Select ${label}`, value: null }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 12 },
  dropdown: { marginBottom: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  button: { marginTop: 16 },
});

export default WatchlistForm;
