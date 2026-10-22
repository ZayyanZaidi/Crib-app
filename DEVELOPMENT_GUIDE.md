# Expo Mobile Development & Execution Guide

## 1. Overview
This document guides developers on how to run, test, and debug the **Crib** mobile application using the Expo CLI and Android Emulator / Expo Go.

---

## 2. Prerequisites & Installed Tools

- **Node.js**: Installed in execution runtime
- **Expo SDK 51** with Expo Router v3
- **Android Emulator / Device** or **Expo Go** app on a physical iOS/Android device

---

## 3. Launching the App

### Start the Expo Dev Server:
From the project root:
```bash
npx expo start
```

### Clear Cache (Recommended after changes to `.env` or dependencies):
```bash
npx expo start --clear
```

### Direct Target Shortcuts:
- **Run on Android Emulator**:
  ```bash
  npx expo start --android
  ```
- **Run in Web Browser**:
  ```bash
  npx expo start --web
  ```

---

## 4. Running on an Android Emulator

1. **Launch your Android Virtual Device (AVD)** via Android Studio (`Virtual Device Manager`).
2. Verify that the device is online and detected:
   ```bash
   adb devices
   ```
3. Run:
   ```bash
   npx expo start --android
   ```
   Expo will automatically detect the running emulator, install Expo Go (or development client if configured), build the JavaScript bundle, and launch the app.

---

## 5. Running on a Physical Device via Expo Go

1. Install **Expo Go** from Google Play Store or Apple App Store.
2. Ensure your phone and development computer are connected to the same Wi-Fi network.
3. Run `npx expo start`.
4. Scan the QR code in the terminal using the Expo Go camera (Android) or the native Camera app (iOS).

---

## 6. Testing Deep Links

The app scheme is configured as `crib://` in [app.json](file:///c:/Users/Sony/Antigravity%20projects/OEL/app.json).

You can test opening a property directly via deep link:
```bash
npx uri-scheme open "crib://property/2" --android
```
Or test via the Settings screen under **Profile -> Settings** which generates live test links.
