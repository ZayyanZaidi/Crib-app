import { Stack } from 'expo-router';

// A stack inside the Profile tab: Settings opens on top of Profile,
// and the tab bar stays visible.
export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
