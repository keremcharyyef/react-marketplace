import Constants from 'expo-constants';

// -----------------------------------------------------------------------------
// LESSON: Environment variables in Expo
//
// In Expo you expose env vars through app.config.js (or app.json) under
// "extra". Then read them with Constants.expoConfig?.extra.
//
// For local dev create a .env file:
//   API_URL=http://192.168.0.190:3000   ← your machine's LAN IP, NOT localhost
//                                          (the phone is a different device!)
//
// For production set the var in your CI/cloud dashboard and it gets baked
// into the build automatically.
// -----------------------------------------------------------------------------

export const API_URL: string =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? '';

// When API_URL is empty ("") every service call falls back to mock data.
// Flip USE_MOCK to true to force mock data even when API_URL is set —
// useful while the backend isn't ready yet.
export const USE_MOCK = !API_URL;

// How long to wait before a network request is considered failed (ms)
export const REQUEST_TIMEOUT_MS = 8000;
