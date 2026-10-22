import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { queryClient } from '@/lib/query-client';

// Keep the splash screen on until we know whether the user is signed in.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    // Every screen inside can use useQuery and useMutation with this one cache.
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // the splash screen is still showing
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="(root)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
