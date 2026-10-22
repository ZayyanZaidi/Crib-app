import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPropertiesPage } from '@/api/properties';
import { PAGE_SIZE } from '@/lib/constants';

// The home list, loaded one page at a time.
export function useProperties(city?: string) {
  return useInfiniteQuery({
    // A different city is a different list, so the city is part of the key.
    queryKey: ['properties', { city: city ?? null }],
    queryFn: ({ pageParam }) => fetchPropertiesPage(pageParam, city),
    initialPageParam: 0,
    // A short page means we reached the end: undefined tells TanStack Query to stop.
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
  });
}
