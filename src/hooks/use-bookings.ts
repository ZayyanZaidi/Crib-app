import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { cancelBooking, fetchUserBookings } from '@/api/bookings';
import { useAuth } from '@/context/auth-context';

function useBookingsKey() {
  const { session } = useAuth();
  return ['bookings', session?.user?.id];
}

export function useBookings() {
  const queryKey = useBookingsKey();
  return useQuery({
    queryKey,
    queryFn: fetchUserBookings,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const queryKey = useBookingsKey();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      Alert.alert('Cancellation failed', error?.message || 'Could not cancel booking.');
    },
  });
}
