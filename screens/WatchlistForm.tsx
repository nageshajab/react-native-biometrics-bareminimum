import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
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
import { getwachlistitem } from '../api/WatchlistService';

type Props = {
  id?: string;
  onSubmit: (data: Watchlist) => void;
};

const WatchlistForm: React.FC<Props> = ({ id, onSubmit }) => {
  const [form, setForm] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);

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
    e: Record<string, string>,
  ): { label: string; value: string }[] =>
    Object.values(e).map((v: string) => ({ label: v, value: v }));

  if (loading || !form) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

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

      <TextInput
        label="User ID"
        value={form.userId}
        onChangeText={text => handleChange('userId', text)}
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

      <Button
        mode="contained"
        onPress={() => onSubmit(form)}
        style={styles.button}
      >
        {id ? 'Update' : 'Add'}
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
  value: string;
  onValueChange: (val: string) => void;
  options: { label: string; value: string }[];
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
