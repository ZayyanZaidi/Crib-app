import { Link } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '@/context/auth-context';
import { useBookings, useCancelBooking } from '@/hooks/use-bookings';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { session } = useAuth();
  const fullName = session?.user?.user_metadata?.full_name;

  const { data: bookings = [], isPending, isError, error, refetch } = useBookings();
  const cancelMutation = useCancelBooking();

  const handleCancelBooking = (bookingId: string, title?: string, date?: string) => {
    Alert.alert(
      'Cancel Visit',
      `Are you sure you want to cancel your visit${title ? ` to ${title}` : ''}${date ? ` on ${date}` : ''}?`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel visit',
          style: 'destructive',
          onPress: () => cancelMutation.mutate(bookingId),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.userCard}>
        <Text style={styles.label}>Signed in as</Text>
        {fullName ? <Text style={styles.fullName}>{fullName}</Text> : null}
        <Text style={styles.email}>{session?.user.email}</Text>
      </View>

      <Link href="/exercises" asChild>
        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Exercises</Text>
          <Text style={styles.rowText}>›</Text>
        </Pressable>
      </Link>

      <Link href="/profile/settings" asChild>
        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Settings</Text>
          <Text style={styles.rowText}>›</Text>
        </Pressable>
      </Link>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booked Visits</Text>

        {isPending ? (
          <ActivityIndicator color="#0E4D92" style={styles.loader} />
        ) : isError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error?.message || 'Failed to load bookings.'}</Text>
            <Pressable style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No visits booked yet.</Text>
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingTitle} numberOfLines={1}>
                    {booking.properties?.title ?? 'Home listing'}
                  </Text>
                  {booking.properties?.city ? (
                    <Text style={styles.bookingCity}>{booking.properties.city}</Text>
                  ) : null}
                  <Text style={styles.bookingDate}>Visit date: {booking.visit_date}</Text>
                </View>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() =>
                    handleCancelBooking(
                      booking.id,
                      booking.properties?.title,
                      booking.visit_date
                    )
                  }
                  disabled={cancelMutation.isPending}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      <Pressable style={styles.signOut} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, gap: 14 },
  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: { color: '#6B7280', fontSize: 13, marginBottom: 4 },
  fullName: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  email: { fontSize: 15, color: '#4B5563' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowText: { fontSize: 16, color: '#111827' },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  loader: { marginVertical: 16 },
  errorBox: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  errorText: { color: '#B91C1C', fontSize: 14, textAlign: 'center' },
  retryButton: {
    backgroundColor: '#B91C1C',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  emptyBox: { paddingVertical: 12 },
  emptyText: { color: '#6B7280', fontSize: 14 },
  bookingsList: { gap: 10 },
  bookingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookingDetails: { flex: 1, marginRight: 8, gap: 2 },
  bookingTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  bookingCity: { fontSize: 13, color: '#6B7280' },
  bookingDate: { fontSize: 13, color: '#0E4D92', fontWeight: '500', marginTop: 2 },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  cancelButtonText: { color: '#B91C1C', fontWeight: 'bold', fontSize: 13 },
  signOut: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
  },
  signOutText: { color: '#B91C1C', fontWeight: 'bold', fontSize: 16 },
});
