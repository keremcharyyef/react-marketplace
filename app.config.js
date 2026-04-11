// -----------------------------------------------------------------------------
// LESSON: app.config.js vs app.json
//
// app.json is static — it can't read environment variables.
// app.config.js is JavaScript, so it runs at build time and CAN read process.env.
//
// Expo reads API_URL from your .env file (via dotenv, built into Expo CLI),
// then bakes it into the binary as Constants.expoConfig.extra.apiUrl.
//
// On the phone, you access it like:
//   import Constants from 'expo-constants';
//   const url = Constants.expoConfig?.extra?.apiUrl;   → "http://192.168.0.190:3000"
// -----------------------------------------------------------------------------

export default {
  expo: {
    name: 'StudentMarket',
    slug: 'StudentMarket',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#4CAF50',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    // ── This is the key section ──────────────────────────────────────────────
    // process.env.API_URL comes from your .env file at build/start time.
    // If it's not set, apiUrl is "" and the app falls back to mock data.
    extra: {
      apiUrl: process.env.API_URL ?? '',
    },
  },
};
