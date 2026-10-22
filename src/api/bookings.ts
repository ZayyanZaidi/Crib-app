import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types/property';

// Fetch the signed-in user's bookings joined with property title and city, ordered by visit_date asc.
export async function fetchUserBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, user_id, home_id, visit_date, created_at, properties(title, city)')
    .order('visit_date', { ascending: true });

  if (error) throw error;
  return data as unknown as Booking[];
}

// Insert a booking for tomorrow's date with current user_id.
export async function createBooking(homeId: number, visitDate: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload: { home_id: number; visit_date: string; user_id?: string } = {
    home_id: Number(homeId),
    visit_date: visitDate,
  };
  if (user?.id) {
    payload.user_id = user.id;
  }

  const { error } = await supabase.from('bookings').insert(payload);
  if (error) throw error;
}

// Cancel (delete) a booking by its id.
export async function cancelBooking(bookingId: string): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
  if (error) throw error;
}
