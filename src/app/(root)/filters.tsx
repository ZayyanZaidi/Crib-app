import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CITIES } from '@/lib/constants';

export default function FiltersScreen() {
  // Home sends the current city and sort params, so the modal opens with them selected.
  const params = useLocalSearchParams<{ city?: string; sortByPrice?: string }>();
  const [selected, setSelected] = useState(params.city ?? '');
  const [sortByPrice, setSortByPrice] = useState(params.sortByPrice === 'true');

  function apply() {
    // Close the modal and navigate to Home with the chosen city and sort parameter.
    router.navigate({
      pathname: '/',
      params: {
        ...(selected ? { city: selected } : { city: '' }),
        sortByPrice: sortByPrice ? 'true' : 'false',
      },
    });
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

      <Text style={styles.label}>Price</Text>
      <View style={styles.chips}>
        <Pressable
          style={[styles.chip, sortByPrice && styles.chipSelected]}
          onPress={() => setSortByPrice((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sortByPrice }}
        >
          <Text style={[styles.chipText, sortByPrice && styles.chipTextSelected]}>
            Price: low to high {sortByPrice ? '✓' : ''}
          </Text>
        </Pressable>
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
