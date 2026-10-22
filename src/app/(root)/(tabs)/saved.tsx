import { FlashList } from '@shopify/flash-list';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/offline-banner';
import { PropertyCard } from '@/components/property-card';
import { EmptyView, ErrorView, LoadingView } from '@/components/state-views';
import { useFavourites } from '@/hooks/use-favourites';

export default function SavedScreen() {
  // The same query as the hearts, so a heart tap shows up here at once.
  const { data: favourites = [], isPending, isError, error, refetch } = useFavourites();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <OfflineBanner />
      <View style={styles.header}>
        <Text style={styles.heading}>Saved homes</Text>
      </View>

      {isPending ? (
        <LoadingView />
      ) : isError ? (
        <ErrorView message={error.message} onRetry={refetch} />
      ) : (
        <FlashList
          data={favourites}
          keyExtractor={(item) => String(item.property_id)}
          renderItem={({ item }) => <PropertyCard property={item.properties} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyView title="No saved homes yet" message="Tap the heart on a home to save it here." />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
});
