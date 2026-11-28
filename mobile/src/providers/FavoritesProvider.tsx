/**
 * FavoritesProvider — IMMO DU LETCH Mobile
 * Principe S : gestion exclusive des favoris et consultations récentes.
 * Persistance via AsyncStorage.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, getApiToken } from '../api/client';

const STORAGE_FAV  = 'immo:favorites';
const STORAGE_REC  = 'immo:recent';
const MAX_RECENT   = 10;

interface FavoritesContextValue {
  favorites: string[];
  recentlyViewed: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToRecent: (id: string) => void;
  clearRecent: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites]       = useState<string[]>([]);
  const [recentlyViewed, setRecent]     = useState<string[]>([]);
  const [hydrated, setHydrated]         = useState(false);

  /* ── Hydratation depuis AsyncStorage ── */
  useEffect(() => {
    (async () => {
      try {
        const [rawFav, rawRec] = await Promise.all([
          AsyncStorage.getItem(STORAGE_FAV),
          AsyncStorage.getItem(STORAGE_REC),
        ]);
        if (rawFav) setFavorites(JSON.parse(rawFav));
        if (rawRec) setRecent(JSON.parse(rawRec));

        const token = await getApiToken();
        if (token) {
          const remote = await api.getFavorites().catch(() => null);
          if (remote?.favorites) {
            setFavorites(prev => Array.from(new Set([...remote.favorites, ...prev])));
          }
        }
      } catch {
        // Silencieux : si lecture échoue, on part de zéro
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  /* ── Persist favoris ── */
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_FAV, JSON.stringify(favorites)).catch(() => {});
  }, [favorites, hydrated]);

  /* ── Persist récents ── */
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_REC, JSON.stringify(recentlyViewed)).catch(() => {});
  }, [recentlyViewed, hydrated]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [id, ...prev],
    );
    getApiToken()
      .then(token => {
        if (token) return api.toggleFavorite(id);
        return null;
      })
      .catch(() => {});
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const addToRecent = useCallback((id: string) => {
    setRecent(prev => {
      const without = prev.filter(r => r !== id);
      return [id, ...without].slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
  }, []);

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    recentlyViewed,
    toggleFavorite,
    isFavorite,
    addToRecent,
    clearRecent,
  }), [favorites, recentlyViewed, toggleFavorite, isFavorite, addToRecent, clearRecent]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used inside <FavoritesProvider>');
  return ctx;
}
