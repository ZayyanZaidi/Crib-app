// Reads the Supabase settings from environment variables.
// In Expo, only variables with the EXPO_PUBLIC_ prefix are accessible on the client.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

if (
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  !process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
) {
  console.warn(
    '[env] Warning: Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. ' +
      'Using fallback placeholder values during compilation.'
  );
}

export const env = { supabaseUrl, supabaseKey };

