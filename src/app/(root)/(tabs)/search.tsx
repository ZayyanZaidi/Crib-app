import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const [cityInput, setCityInput] = useState('');

  const handleSearch = () => {
    const trimmed = cityInput.trim();
    if (!trimmed) return;

    // Switch to Home tab with the specified city
    router.navigate({
      pathname: '/',
      params: { city: trimmed },
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Search homes by city</Text>
          <Text style={styles.subheading}>
            Find available properties in Karachi, Lahore, Islamabad, and more.
          </Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter city (e.g. Karachi)..."
              placeholderTextColor="#9CA3AF"
              value={cityInput}
              onChangeText={setCityInput}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {cityInput.length > 0 && (
              <Pressable onPress={() => setCityInput('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.searchButton, !cityInput.trim() && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={!cityInput.trim()}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  subheading: { fontSize: 14, color: '#6B7280' },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#0E4D92',
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
