import { User } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { http, setAuthToken } from './httpClient';
import { USE_MOCK } from './config';

// -----------------------------------------------------------------------------
// LESSON: Auth service
//
// A real backend returns a JWT token on login. We:
//   1. Store it (in memory here; use SecureStore for production)
//   2. Pass it to setAuthToken() so httpClient attaches it to every request
//   3. Return the User object so the context can update state
//
// With mock data we skip all of that and return the demo user instantly.
// -----------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  university: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

/** Sign in and receive a user + JWT */
export async function login(payload: LoginPayload): Promise<User> {
  if (USE_MOCK) {
    // Skip real auth — just return the demo user
    return CURRENT_USER;
  }

  const { token, user } = await http.post<AuthResponse>('/api/auth/login', payload);
  setAuthToken(token); // attach JWT to all future requests
  return user;
}

/** Register a new account */
export async function register(payload: RegisterPayload): Promise<User> {
  if (USE_MOCK) {
    return {
      ...CURRENT_USER,
      name: payload.name,
      email: payload.email,
      university: payload.university,
    };
  }

  const { token, user } = await http.post<AuthResponse>('/api/auth/register', payload);
  setAuthToken(token);
  return user;
}

/** Sign out — clears the token */
export async function logout(): Promise<void> {
  setAuthToken(null);
  if (USE_MOCK) return;
  // Tell the server to invalidate the session (optional for JWT, required for sessions)
  await http.post('/api/auth/logout', {}).catch(() => {});
}

/** Fetch the current user's profile */
export async function getProfile(): Promise<User> {
  if (USE_MOCK) return CURRENT_USER;
  return http.get<User>('/api/auth/me');
}
