import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FavouriteButton } from '@/components/favourite-button';
import { formatPrice } from '@/lib/format';
import type { Property } from '@/types/property';

type Props = {
  property: Property;
};

export function PropertyCard({ property }: Props) {
  function openDetails() {
    // The id is a number in the database, but route params are strings.
    router.push({ pathname: '/property/[id]', params: { id: String(property.id) } });
  }

  return (
    <View style={styles.card}>
      <Pressable
        onPress={openDetails}
        style={({ pressed }) => pressed && styles.pressed}
        android_ripple={{ color: '#E5E7EB' }}
        accessibilityRole="button"
        accessibilityLabel={`${property.title}, ${property.city}`}
      >
        {/* expo-image keeps downloaded photos in memory and on disk */}
        <Image
          source={property.image_url}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={String(property.id)}
        />

        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.title}>{property.title}</Text>
            <Text style={styles.price}>{formatPrice(property.price)}</Text>
          </View>
          <Text style={styles.city}>{property.city}</Text>
          <Text style={styles.meta}>
            {plural(property.bedrooms, 'bed')} · {plural(property.bathrooms, 'bath')} ·{' '}
            {property.area} sq ft
          </Text>
        </View>
      </Pressable>

      {/* Next to the card's Pressable, not inside it, so a heart tap does not open the details */}
      <View style={styles.heart}>
        <FavouriteButton property={property} />
      </View>
    </View>
  );
}

// plural(1, 'bed') -> "1 bed", plural(3, 'bed') -> "3 beds"
function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden', // keeps the photo and the Android ripple inside the corners
  },
  pressed: { opacity: 0.7 },
  image: { width: '100%', height: 160, backgroundColor: '#E5E7EB' },
  heart: { position: 'absolute', top: 10, right: 10 },
  body: { padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#111827' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#0E4D92' },
  city: { marginTop: 4, color: '#4B5563' },
  meta: { marginTop: 8, fontSize: 13, color: '#6B7280' },
});
