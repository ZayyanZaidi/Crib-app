import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CITIES } from '@/lib/constants';

export default function FiltersScreen() {
  // Home sends the current city, so the modal opens with it selected.
  const params = useLocalSearchParams<{ city?: string }>();
  const [selected, setSelected] = useState(params.city ?? '');

  function apply() {
    // Close the modal and go back to Home with the chosen city as a parameter.
    // An empty string means "All cities", so Home gets no city at all.
    router.dismissTo({ pathname: '/', params: selected ? { city: selected } : {} });
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>City</Text>
      <View style={styles.chips}>
        {['', ...CITIES].map((city) => (
          <Pressable
            key={city || 'all'}
            style={[styles.chip, selected === city && styles.chipSelected]}
            onPress={() => setSelected(city)}
          >
            <Text style={[styles.chipText, selected === city && styles.chipTextSelected]}>
              {city || 'All cities'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.apply} onPress={apply}>
        <Text style={styles.applyText}>Show homes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16, backgroundColor: '#FFFFFF' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  chipSelected: { backgroundColor: '#0E4D92', borderColor: '#0E4D92' },
  chipText: { color: '#374151' },
  chipTextSelected: { color: '#FFFFFF', fontWeight: 'bold' },
  apply: {
    backgroundColor: '#0E4D92',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
