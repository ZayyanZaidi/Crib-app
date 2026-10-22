import { Stack } from 'expo-router';

export default function RootGroupLayout() {
  return (
    <Stack>
      {/* The tab bar is one screen of this stack. Its tabs have no header here. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Opens on top of the tabs, so the tab bar is hidden on this screen */}
      <Stack.Screen name="property/[id]" options={{ title: 'Property' }} />

      {/* A modal: slides up as a card on iOS, opens as a full screen on Android */}
      <Stack.Screen
        name="filters"
        options={{ presentation: 'modal', title: 'Filters' }}
      />
    </Stack>
  );
}
