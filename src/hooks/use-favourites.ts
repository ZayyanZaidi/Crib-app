import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { addFavourite, fetchFavourites, removeFavourite } from '@/api/favourites';
import { useAuth } from '@/context/auth-context';
import type { Favourite, Property } from '@/types/property';

// Each user has their own list, so the user's id is part of the key.
function useFavouritesKey() {
  const { session } = useAuth();
  return ['favourites', session?.user.id];
}

export function useFavourites() {
  const queryKey = useFavouritesKey();
  return useQuery({
    queryKey,
    queryFn: fetchFavourites,
  });
}

type ToggleVariables = { property: Property; isSaved: boolean };

// Saves or removes a favourite. The heart changes at once (an optimistic update),
// and goes back if the server says no.
export function useToggleFavourite() {
  const queryClient = useQueryClient();
  const queryKey = useFavouritesKey();

  return useMutation({
    mutationFn: ({ property, isSaved }: ToggleVariables) =>
      isSaved ? removeFavourite(property.id) : addFavourite(property.id),

    // 1. Before the request: change the cached list right away.
    onMutate: async ({ property, isSaved }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Favourite[]>(queryKey);
      queryClient.setQueryData<Favourite[]>(queryKey, (old = []) =>
        isSaved
          ? old.filter((f) => f.property_id !== property.id)
          : [{ property_id: property.id, properties: property }, ...old]
      );
      return { previous }; // handed to onError as "context"
    },

    // 2. If the request fails: put the old list back.
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      Alert.alert('Could not update your saved homes', 'Please try again.');
    },

    // 3. Success or failure: fetch the real list from the server.
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
