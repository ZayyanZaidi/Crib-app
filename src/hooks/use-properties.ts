import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPropertiesPage } from '@/api/properties';
import { PAGE_SIZE } from '@/lib/constants';

// The home list, loaded one page at a time.
export function useProperties(city?: string, sortByPrice?: boolean) {
  const normalizedCity = city?.trim() || undefined;
  return useInfiniteQuery({
    // A different city or sort is a different list, so both are part of the key.
    queryKey: ['properties', { city: normalizedCity ?? null, sortByPrice: !!sortByPrice }],
    queryFn: ({ pageParam }) => fetchPropertiesPage(pageParam, normalizedCity, sortByPrice),
    initialPageParam: 0,
    // A short page means we reached the end: undefined tells TanStack Query to stop.
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
  });
}
