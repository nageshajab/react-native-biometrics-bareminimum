import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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

type Props = {
  initialData?: Watchlist;
  onSubmit: (data: Watchlist) => void;
};

const WatchlistForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<Watchlist>({
    title: initialData?.title || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    status: initialData?.status || Status.NotStarted,
    userId: initialData?.userId || '',
    type: initialData?.type || WatchlistType.Movie,
    language: initialData?.language || Language.English,
    genre: initialData?.genre || Genre.Action,
    rating: initialData?.rating || Rating.ThreeStars,
    ott: initialData?.ott || Ott.Netflix,
  });

  const handleChange = (key: keyof Watchlist, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const enumToOptions = (
    e: Record<string, string>,
  ): { label: string; value: string }[] =>
    Object.values(e).map((v: string) => ({ label: v, value: v }));

  return (
    <ScrollView style={styles.container}>
      <Title>
        {initialData ? 'Edit Watchlist Item' : 'Add Watchlist Item'}
      </Title>

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
        {initialData ? 'Update' : 'Add'}
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
