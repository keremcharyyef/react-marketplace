import { API_URL, REQUEST_TIMEOUT_MS } from './config';

// -----------------------------------------------------------------------------
// LESSON: Why a custom HTTP client?
//
// Raw fetch() has no:
//   • timeout  — a hung request freezes the UI forever
//   • auth headers — you'd repeat token logic in every call
//   • central error handling — 4xx/5xx go undetected unless you check res.ok
//
// This thin wrapper adds all three. It is NOT a full library like Axios —
// it's ~40 lines and has zero dependencies.
// -----------------------------------------------------------------------------

let authToken: string | null = null;

/** Call this after login to attach the JWT to every future request. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        // Attach the JWT if we have one
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      // Turn HTTP errors (400, 401, 404, 500…) into thrown errors
      // so callers don't have to check res.ok themselves
      const text = await res.text().catch(() => res.statusText);
      throw new ApiError(res.status, text);
    }

    // 204 No Content — return empty object instead of trying to parse JSON
    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timerId);
  }
}

// Convenience methods — mimic what Axios gives you
export const http = {
  get:    <T>(path: string)              => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown) => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown) => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body: unknown) => request<T>('PATCH',  path, body),
  delete: <T>(path: string)              => request<T>('DELETE', path),
};
