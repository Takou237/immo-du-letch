/**
 * client.ts — Client API Laravel (Railway) pour IMMO DU LETCH Mobile.
 * Miroir exact de src/api/client.ts du web, adapté pour React Native (AsyncStorage).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'https://laravel-backend-production-7438ec96.up.railway.app/api';
const TOKEN_KEY = 'immo:token';
const TIMEOUT_MS = 8000;

let cachedToken: string | null = null;

export async function getApiToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  try {
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedToken;
  } catch {
    return null;
  }
}

export async function setApiToken(token: string | null): Promise<void> {
  cachedToken = token;
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Silencieux
  }
}

export interface ApiError extends Error {
  status?: number;
  isNetworkError?: boolean;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getApiToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      let message = `Erreur serveur (${res.status})`;
      try {
        const payload = (await res.json()) as { message?: string };
        if (payload.message) message = payload.message;
      } catch {
        // Ignorer erreur JSON
      }
      const err: ApiError = new Error(message);
      err.status = res.status;
      throw err;
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof Error && !('status' in err)) {
      (err as ApiError).isNetworkError = true;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export interface ApiUser {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  accountType?: 'particulier' | 'professionnel';
  createdAt?: string;
}

export interface CreateListingPayload {
  title: string;
  price: number;
  transaction: 'vente' | 'location';
  type: string;
  city: string;
  neighborhood: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  surface: number;
  description: string;
  features: string[];
  condition: string;
  sellerPhone?: string;
}

export const api = {
  // ── Auth ──────────────────────────────────────────────
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    accountType: 'particulier' | 'professionnel';
  }) =>
    request<{ user: ApiUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (email: string, password: string) =>
    request<{ user: ApiUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleLogin: (name: string, email: string) =>
    request<{ user: ApiUser; token: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    }),

  me: () => request<{ user: ApiUser }>('/auth/me'),

  updateProfile: (payload: {
    name: string;
    phone?: string;
    accountType: 'particulier' | 'professionnel';
  }) =>
    request<{ user: ApiUser }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),

  // ── Annonces ──────────────────────────────────────────
  createListing: (payload: CreateListingPayload) =>
    request<{ listing: { id: string | number } }>('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteListing: (slug: string) =>
    request<{ ok: boolean }>(`/listings/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    }),

  // ── Favoris ───────────────────────────────────────────
  getFavorites: () => request<{ favorites: string[] }>('/favorites'),

  toggleFavorite: (slug: string) =>
    request<{ favorited: boolean }>(`/favorites/${encodeURIComponent(slug)}/toggle`, {
      method: 'POST',
    }),

  // ── Messages / Demandes de visite ─────────────────────
  sendInquiry: (
    slug: string,
    payload: { name: string; email: string; phone?: string; message: string },
  ) =>
    request<{ id: number }>(`/listings/${encodeURIComponent(slug)}/inquiries`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
