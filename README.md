# 🏡 Crib - Real Estate Mobile App

A modern, high-performance cross-platform mobile application for browsing and discovering real estate properties, built with **React Native**, **Expo Router**, **Supabase**, and **TanStack Query**.

---

## ✨ Features

- **Dynamic Property Feed**: Smooth, virtualized 60fps scrolling powered by `@shopify/flash-list` with infinite pagination and pull-to-refresh.
- **Smart Filtering**: Filter listings by major cities (Karachi, Lahore, Islamabad) with interactive modal controls.
- **Detailed Property Views**: High-resolution image caching (`expo-image`), key property specs (beds, baths, square footage), and native device sharing.
- **Saved / Favourites**: Instant heart-toggle bookmarking with **Optimistic UI Updates** and backend synchronization.
- **Secure Authentication**: User sign-up, sign-in, and persistent session management backed by Supabase Auth and hybrid hardware encryption.
- **Offline Resilience**: Automatic network detection with `@react-native-community/netinfo`, visual offline banners, and query request pausing/resuming.
- **Deep Linking**: Built-in URL scheme support (`crib://property/<id>`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React Native 0.74](https://reactnative.dev/) / [Expo SDK 51](https://expo.dev/) |
| **Routing** | [Expo Router v3](https://docs.expo.dev/router/introduction/) (File-based routing with route protection) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security) |
| **Data Fetching & Cache** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **List Virtualization** | [@shopify/flash-list](https://shopify.github.io/flash-list/) |
| **Encrypted Storage** | Custom AES-256 CTR adapter (`expo-secure-store` + `@react-native-async-storage/async-storage`) |
| **Image Component** | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) |
| **Language** | TypeScript |

---

## 📁 Project Structure

```
OEL/
├── .env                         # Client environment variables (EXPO_PUBLIC_*)
├── app.json                     # Expo configuration (app name, scheme, plugins)
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler config & path aliases
├── PROJECT_CONTEXT.md           # Detailed technical architecture documentation
├── SUPABASE_CONTEXT.md          # Database schema & RLS policies
├── DEVELOPMENT_GUIDE.md         # Emulator & device testing guide
└── src/
    ├── api/                     # Supabase API queries (properties, favourites)
    ├── app/                     # Expo Router navigation hierarchy
    │   ├── _layout.tsx          # Root Layout & route protection guards
    │   ├── (auth)/              # Sign In & Sign Up screens
    │   └── (root)/              # Main app (Tabs, Filters modal, Property details)
    ├── components/              # Reusable UI widgets (cards, buttons, banners)
    ├── context/                 # React Contexts (auth-context)
    ├── hooks/                   # Custom React Query hooks
    ├── lib/                     # Utilities (supabase client, query-client, formatters)
    └── types/                   # TypeScript interfaces & types
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **Expo CLI**: Included via `npx expo`
- **Expo Go** app on your physical mobile device OR **Android Studio / Xcode** for emulators

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

### 4. Database Setup
Set up the required tables (`properties` and `favourites`) in your Supabase project. For the full SQL migration script and sample seed data, refer to [SUPABASE_CONTEXT.md](./SUPABASE_CONTEXT.md).

---

## 📱 Running the App

Start the Expo development server:
```bash
npx expo start
```

### Direct Target Commands:
- **Run on Android Emulator**:
  ```bash
  npx expo start --android
  ```
- **Run in Web Browser**:
  ```bash
  npx expo start --web
  ```
- **Clear Metro Cache**:
  ```bash
  npx expo start --clear
  ```

Scan the terminal's QR code using **Expo Go** on Android or the native **Camera** app on iOS to run on a physical device.

---

## 🔒 Security Architecture (Supabase SecureStore)

Native secure storage on iOS (Keychain) and Android (Keystore) has a strict **2,048-byte limit** per key. Because Supabase auth sessions (containing user metadata, JWTs, and refresh tokens) often exceed this threshold, Crib implements a hybrid encryption pattern:
1. The session payload is encrypted with **AES-256 CTR** (`aes-js`).
2. The generated 32-byte cryptographic key is securely stored in hardware-backed **`Expo SecureStore`**.
3. The encrypted ciphertext is stored in **`AsyncStorage`**.
4. On web, it automatically falls back to standard client storage.

---

## 📖 Additional Documentation

- [Project Context & Architecture](./PROJECT_CONTEXT.md)
- [Supabase Schema & Policies](./SUPABASE_CONTEXT.md)
- [Development & Emulator Guide](./DEVELOPMENT_GUIDE.md)

---

## 📄 License
This project is private and intended for educational and commercial development.
