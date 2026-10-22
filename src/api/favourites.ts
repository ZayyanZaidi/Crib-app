import { supabase } from '@/lib/supabase';
import type { Favourite } from '@/types/property';

// The signed-in user's saved homes, newest first, each with its home joined in.
// Row Level Security returns only this user's rows.
export async function fetchFavourites(): Promise<Favourite[]> {
  const { data, error } = await supabase
    .from('favourites')
    .select('property_id, properties(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as Favourite[];
}

export async function addFavourite(propertyId: number): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload: { property_id: number; user_id?: string } = {
    property_id: Number(propertyId),
  };
  if (user?.id) {
    payload.user_id = user.id;
  }

  const { error } = await supabase.from('favourites').insert(payload);
  if (error) throw error;
}

export async function removeFavourite(propertyId: number): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from('favourites').delete().eq('property_id', Number(propertyId));
  if (user?.id) {
    query = query.eq('user_id', user.id);
  }

  const { error } = await query;
  if (error) throw error;
}
