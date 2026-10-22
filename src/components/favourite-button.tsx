import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { useFavourites, useToggleFavourite } from '@/hooks/use-favourites';
import type { Property } from '@/types/property';

// The heart on a card and on the details screen.
export function FavouriteButton({ property }: { property: Property }) {
  const { data: favourites = [] } = useFavourites();
  const toggle = useToggleFavourite();

  const isSaved = favourites.some((f) => f.property_id === property.id);

  return (
    <Pressable
      style={styles.button}
      hitSlop={8}
      onPress={() => toggle.mutate({ property, isSaved })}
      accessibilityRole="button"
      accessibilityLabel={isSaved ? 'Remove from saved homes' : 'Save this home'}
    >
      <Ionicons
        name={isSaved ? 'heart' : 'heart-outline'}
        size={22}
        color={isSaved ? '#DC2626' : '#111827'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 8,
  },
});
