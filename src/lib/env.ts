// Reads the Supabase settings from .env, and stops with a clear message if one is missing.
// Expo only copies variables whose names start with EXPO_PUBLIC_ into the app.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase settings. Add EXPO_PUBLIC_SUPABASE_URL and ' +
      'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env, then run npx expo start --clear.'
  );
}

export const env = { supabaseUrl, supabaseKey };
