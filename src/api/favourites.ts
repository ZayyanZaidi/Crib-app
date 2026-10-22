import { supabase } from '@/lib/supabase';
import type { Favourite } from '@/types/property';

// The signed-in user's saved homes, newest first, each with its home joined in.
// Row Level Security returns only this user's rows, so no user filter is needed.
export async function fetchFavourites(): Promise<Favourite[]> {
  const { data, error } = await supabase
    .from('favourites')
    .select('property_id, properties(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  // Each favourite points to one home, so properties is one object, not a list.
  // Supabase cannot know that without generated types, so we tell TypeScript.
  return data as unknown as Favourite[];
}

// user_id is filled in by the database (default auth.uid()).
export async function addFavourite(propertyId: number): Promise<void> {
  const { error } = await supabase.from('favourites').insert({ property_id: propertyId });
  if (error) throw error;
}

export async function removeFavourite(propertyId: number): Promise<void> {
  const { error } = await supabase.from('favourites').delete().eq('property_id', propertyId);
  if (error) throw error;
}
