# Project Overview & Architecture: Crib (OEL Real Estate App)

## 1. Overview
**Crib** is a cross-platform mobile real estate application built with **React Native** and **Expo Router**. It connects to a **Supabase** backend for authentication and database management (PostgreSQL), with **TanStack React Query** handling asynchronous server state, caching, offline capability, and optimistic UI mutations.

---

## 2. Tech Stack

- **Framework**: Expo SDK (React Native 0.74, React 18)
- **Routing & Navigation**: Expo Router v3 (file-based routing with typed routes and route protection)
- **Database & Auth**: Supabase (`@supabase/supabase-js`)
- **Secure Token Storage**: Custom AES-256 CTR encrypted adapter using `expo-secure-store` and `@react-native-async-storage/async-storage`
- **Data Fetching & Cache**: TanStack React Query v5 (`useQuery`, `useInfiniteQuery`, `useMutation`)
- **List Rendering**: `@shopify/flash-list` (high-performance 60fps list virtualization)
- **Image Handling**: `expo-image` (hardware accelerated, memory-disk cache)
- **Network State**: `@react-native-community/netinfo`
- **Language**: TypeScript

---

## 3. Directory & File Structure

```
OEL/
├── .env                         # Environment variables (EXPO_PUBLIC_*)
├── app.json                     # Expo app configuration (scheme, bundle ID, plugins)
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript config & path alias (@/* -> src/*)
└── src/
    ├── api/
    │   ├── properties.ts        # Supabase queries for property listings & details
    │   └── favourites.ts        # Supabase queries for user saved homes (RLS secured)
    ├── app/                     # Expo Router file-based route hierarchy
    │   ├── _layout.tsx          # Root Layout: Splash screen control, Providers, Route guards
    │   ├── (auth)/              # Unauthenticated user route group
    │   │   ├── _layout.tsx      # Auth Stack
    │   │   ├── sign-in.tsx      # Email/Password Sign-In
    │   │   └── sign-up.tsx      # Account registration
    │   └── (root)/              # Authenticated protected route group
    │       ├── _layout.tsx      # Root Stack: tabs, property details, and modal filters
    │       ├── filters.tsx      # Modal for filtering by city
    │       ├── (tabs)/          # Native Bottom Tabs
    │       │   ├── _layout.tsx  # NativeTabs configuration (Home, Search, Saved, Profile)
    │       │   ├── index.tsx    # Home screen: infinite property feed, pull-to-refresh
    │       │   ├── search.tsx   # Search screen
    │       │   ├── saved.tsx    # Saved homes / favourites with FlashList
    │       │   └── profile/     # Nested Profile Stack
    │       │       ├── _layout.tsx
    │       │       ├── index.tsx     # Profile summary & sign-out
    │       │       └── settings.tsx  # Settings & deep-linking test
    │       └── property/
    │           └── [id].tsx     # Dynamic property details screen with native Share
    ├── components/
    │   ├── favourite-button.tsx # Heart toggle button with optimistic updates
    │   ├── offline-banner.tsx   # Visual indicator when offline (NetInfo)
    │   ├── property-card.tsx    # FlashList card item with memoized image
    │   └── state-views.tsx      # Loading, Error, and Empty state fallback components
    ├── context/
    │   └── auth-context.tsx     # Supabase session lifecycle & user state
    ├── hooks/
    │   ├── use-favourites.ts    # React Query hooks for fetching & toggling favourites
    │   ├── use-properties.ts    # React Query useInfiniteQuery hook with pagination
    │   └── use-property.ts      # React Query single property fetch hook
    ├── lib/
    │   ├── constants.ts         # App constants (cities, PAGE_SIZE)
    │   ├── env.ts               # Validates & exports EXPO_PUBLIC_* env vars
    │   ├── format.ts            # Price formatting (e.g., Rs Lakh / Crore)
    │   ├── query-client.ts      # TanStack QueryClient with NetInfo & AppState focus sync
    │   └── supabase.ts          # Supabase client with LargeSecureStore encryption adapter
    └── types/
        └── property.ts          # TypeScript types for Property and Favourite models
```

---

## 4. Key Architectural Patterns

### Authentication & Route Protection
- App boots with the native splash screen locked via `SplashScreen.preventAutoHideAsync()`.
- [auth-context.tsx](file:///c:/Users/Sony/Antigravity%20projects/OEL/src/context/auth-context.tsx) checks for an existing session via the encrypted `LargeSecureStore` storage adapter.
- [src/app/_layout.tsx](file:///c:/Users/Sony/Antigravity%20projects/OEL/src/app/_layout.tsx) dynamically mounts either `(root)` or `(auth)` using `Stack.Protected guard={...}`. The splash screen unlocks once `isLoading` becomes false.

### LargeSecureStore Adapter
Native iOS Keychain and Android Keystore enforce a 2,048-byte limit per entry. Supabase JWT sessions frequently exceed this size. The hybrid storage solution in [supabase.ts](file:///c:/Users/Sony/Antigravity%20projects/OEL/src/lib/supabase.ts):
1. Encrypts the session JSON payload with AES-256 CTR using a 32-byte cryptographically secure random key.
2. Saves the small 32-byte key in `Expo SecureStore`.
3. Stores the encrypted payload in `AsyncStorage`.
4. Gracefully falls back to standard `AsyncStorage` on Web.

### Optimistic UI Mutations
Toggling property favourites ([use-favourites.ts](file:///c:/Users/Sony/Antigravity%20projects/OEL/src/hooks/use-favourites.ts)) immediately updates the cached React Query dataset before the Supabase network request resolves. If the request fails, the cache automatically rolls back to the snapshot captured in `onMutate`.
