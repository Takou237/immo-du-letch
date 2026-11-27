import type { Filters, Listing } from "../data/listings";
import type { SavedSearch, User, UserListing } from "../store/AppStore";

const TOKEN_KEY = "immo:token";

export function getApiToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setApiToken(token: string | null): void {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* stockage indisponible */
  }
}

// In production, VITE_API_URL points to the Railway backend (e.g. https://backend.railway.app)
// In development, an empty string keeps the Vite proxy (/api → localhost:8000) working.
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getApiToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Erreur serveur (${res.status})`;
    try {
      const payload = (await res.json()) as { message?: string };
      if (payload.message) message = payload.message;
    } catch {
      /* ignore */
    }
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return (await res.json()) as T;
}

export const api = {
  getListings: () => request<{ listings: Listing[] }>("/listings"),
  getMyListings: () => request<{ listings: UserListing[] }>("/my-listings"),
  createListing: (payload: Omit<UserListing, "id" | "userId" | "status" | "createdAt">) =>
    request<{ listing: UserListing }>("/listings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteListing: (slug: string) =>
    request<{ ok: boolean }>(`/listings/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    }),

  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    accountType: "particulier" | "professionnel";
  }) =>
    request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (email: string, password: string) =>
    request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  googleLogin: (name: string, email: string) =>
    request<{ user: User; token: string }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    }),

  me: () => request<{ user: User }>("/auth/me"),

  updateProfile: (payload: {
    name: string;
    phone?: string;
    accountType: "particulier" | "professionnel";
  }) =>
    request<{ user: User }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),

  getFavorites: () => request<{ favorites: string[] }>("/favorites"),
  toggleFavorite: (slug: string) =>
    request<{ favorited: boolean }>(`/favorites/${encodeURIComponent(slug)}/toggle`, {
      method: "POST",
    }),

  getSavedSearches: () => request<{ savedSearches: SavedSearch[] }>("/saved-searches"),
  createSavedSearch: (label: string, filters: Filters) =>
    request<{ savedSearch: SavedSearch }>("/saved-searches", {
      method: "POST",
      body: JSON.stringify({ label, filters }),
    }),
  deleteSavedSearch: (id: string) =>
    request<{ ok: boolean }>(`/saved-searches/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  sendInquiry: (
    slug: string,
    payload: { name: string; email: string; phone?: string; message: string },
  ) =>
    request<{ id: number }>(`/listings/${encodeURIComponent(slug)}/inquiries`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSiteContent: () =>
    request<{
      articles: { id: number; tag: string; title: string; image: string; body: string }[];
      faqs: { id: number; q: string; a: string }[];
      heroSlides: { id: string; image: string; tag: string; title: string; location: string; price: string }[];
      stats: { value: string; label: string; suffix: string }[];
      settings: { yearsExperience: string; contactPhone: string; contactEmail: string };
    }>("/site-content"),
};
