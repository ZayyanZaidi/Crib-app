import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/offline-banner';
import { PropertyCard } from '@/components/property-card';
import { EmptyView, ErrorView, LoadingView } from '@/components/state-views';
import { useProperties } from '@/hooks/use-properties';

export default function HomeScreen() {
  // The filters modal sends the chosen city back as a URL parameter.
  const { city } = useLocalSearchParams<{ city?: string }>();

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProperties(city);

  // data.pages is a list of pages; flat() joins them into one list of homes.
  const properties = data?.pages.flat() ?? [];

  // Pull to refresh: show the spinner only while the user's own refresh runs.
  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  // Infinite scroll: near the end of the list, load the next page if there is one.
  function onEndReached() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  // Android only: press back twice within 2 seconds to leave the app.
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      let lastPress = 0;
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        const now = Date.now();
        if (now - lastPress < 2000) {
          BackHandler.exitApp(); // second press: close the app
          return true;
        }
        lastPress = now;
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        return true; // we handled it, so the app stays open
      });

      return () => subscription.remove();
    }, [])
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <OfflineBanner />

      <View style={styles.header}>
        <Text style={styles.heading}>Find your next home</Text>
        <Pressable
          style={styles.filterButton}
          onPress={() => router.push({ pathname: '/filters', params: city ? { city } : {} })}
        >
          <Text style={styles.filterText}>Filters</Text>
        </Pressable>
      </View>

      {city ? (
        <View style={styles.activeFilter}>
          <Text style={styles.activeFilterText}>Showing homes in {city}</Text>
          <Pressable onPress={() => router.setParams({ city: undefined })}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Loading, error, then the list (which shows its own empty state) */}
      {isPending ? (
        <LoadingView />
      ) : isError ? (
        <ErrorView message={error.message} onRetry={refetch} />
      ) : (
        <FlashList
          data={properties}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PropertyCard property={item} />}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={styles.footer} color="#0E4D92" /> : null
          }
          ListEmptyComponent={
            <EmptyView
              title="No homes found"
              message={city ? `There are no homes in ${city} yet.` : 'Check back soon.'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  filterButton: {
    backgroundColor: '#0E4D92',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  filterText: { color: '#FFFFFF', fontWeight: 'bold' },
  activeFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#E0ECF8',
  },
  activeFilterText: { color: '#0E4D92' },
  clearText: { color: '#0E4D92', fontWeight: 'bold' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  footer: { marginVertical: 16 },
});
