import { PAGE_SIZE } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/types/property';

// One page of homes: page 0 is rows 0-5, page 1 is rows 6-11, and so on.
export async function fetchPropertiesPage(page: number, city?: string): Promise<Property[]> {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from('properties').select('*');
  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query.order('id', { ascending: true }).range(from, to);
  if (error) throw error; // TanStack Query turns a thrown error into isError
  return data;
}

// One home by its id, or null if there is no such home.
export async function fetchProperty(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
