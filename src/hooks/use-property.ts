import { useQuery } from '@tanstack/react-query';

import { fetchProperty } from '@/api/properties';

// One home for the details screen.
export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id),
  });
}
