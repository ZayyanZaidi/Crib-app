import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

// One cache for the whole app. Every screen that asks for the same
// query key gets the same data from here.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // data counts as fresh for 1 minute
      retry: 2, // try a failed request 2 more times before showing an error
    },
  },
});

// Tell TanStack Query when the phone goes online or offline.
// Offline, it pauses requests instead of failing them, and resumes them later.
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

// Refetch stale data when the user comes back to the app.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (status) => {
    focusManager.setFocused(status === 'active');
  });
}
