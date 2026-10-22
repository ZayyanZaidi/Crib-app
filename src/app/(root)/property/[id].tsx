import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { FavouriteButton } from '@/components/favourite-button';
import { ErrorView, LoadingView } from '@/components/state-views';
import { useProperty } from '@/hooks/use-property';
import { formatPrice } from '@/lib/format';

export default function PropertyDetailsScreen() {
  // [id] in the file name becomes the "id" parameter: /property/2 -> id = "2"
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: property, isPending, isError, error, refetch } = useProperty(id);

  if (isPending) {
    return <LoadingView />;
  }

  if (isError) {
    return <ErrorView message={error.message} onRetry={refetch} />;
  }

  if (!property) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.notFound}>Property not found</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>
      </View>
    );
  }

  // If this screen was opened from a link, there is no screen behind it.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${property.title} in ${property.city} for ${formatPrice(property.price)}`,
      });
    } catch {
      // Some platforms/browsers cannot invoke native sharing.
      Alert.alert('Sharing unavailable', 'Sharing works on mobile devices (Expo Go / standalone builds).');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Set this screen's header title and add a button on the right */}
      <Stack.Screen
        options={{
          title: property.title,
          headerRight: () => (
            <Pressable onPress={handleShare} hitSlop={8} accessibilityLabel="Share">
              <Ionicons name="share-social-outline" size={22} color="#0E4D92" />
            </Pressable>
          ),
        }}
      />

      <Image
        source={property.image_url}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <View style={styles.titleRow}>
        <Text style={styles.title}>{property.title}</Text>
        <FavouriteButton property={property} />
      </View>
      <Text style={styles.city}>{property.city}</Text>
      <Text style={styles.price}>{formatPrice(property.price)}</Text>

      <View style={styles.facts}>
        <Fact label="Bedrooms" value={property.bedrooms} />
        <Fact label="Bathrooms" value={property.bathrooms} />
        <Fact label="Area (sq ft)" value={property.area} />
      </View>

      <Text style={styles.description}>{property.description}</Text>

      <Pressable style={styles.button} onPress={goBack}>
        <Text style={styles.buttonText}>Back to list</Text>
      </Pressable>
    </ScrollView>
  );
}

function Fact({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, gap: 8 },
  image: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#E5E7EB' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  title: { flex: 1, fontSize: 24, fontWeight: 'bold', color: '#111827' },
  city: { fontSize: 16, color: '#4B5563' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#0E4D92', marginTop: 4 },
  facts: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  fact: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  factValue: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  factLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  description: { fontSize: 15, lineHeight: 22, color: '#374151' },
  button: {
    marginTop: 16,
    alignSelf: 'stretch',
    backgroundColor: '#0E4D92',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  notFound: { fontSize: 18, color: '#374151' },
});
