/**
 * SavedSearchesProvider — IMMO DU LETCH Mobile
 * Principe S : gestion exclusive des recherches sauvegardées et annonceurs suivis.
 * Persistance via AsyncStorage.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Filters } from '../types/listing';

const STORAGE_SEARCHES = 'immo:savedSearches';
const STORAGE_SELLERS  = 'immo:followedSellers';

export interface SavedSearch {
  id: string;
  filters: Filters;
  createdAt: string;
}

interface SavedSearchesContextValue {
  savedSearches: SavedSearch[];
  followedSellerIds: string[];
  saveSearch: (filters: Filters) => void;
  deleteSearch: (id: string) => void;
  toggleFollowSeller: (sellerId: string) => void;
  isFollowingSeller: (sellerId: string) => boolean;
}

const SavedSearchesContext = createContext<SavedSearchesContextValue | null>(null);

export function SavedSearchesProvider({ children }: { children: ReactNode }) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [followedSellerIds, setFollowedSellerIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [rawSearches, rawSellers] = await Promise.all([
          AsyncStorage.getItem(STORAGE_SEARCHES),
          AsyncStorage.getItem(STORAGE_SELLERS),
        ]);
        if (rawSearches) setSavedSearches(JSON.parse(rawSearches));
        if (rawSellers) setFollowedSellerIds(JSON.parse(rawSellers));
      } catch {
        // Silencieux si lecture échoue
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_SEARCHES, JSON.stringify(savedSearches)).catch(() => {});
  }, [savedSearches, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_SELLERS, JSON.stringify(followedSellerIds)).catch(() => {});
  }, [followedSellerIds, hydrated]);

  const saveSearch = useCallback((filters: Filters) => {
    const newItem: SavedSearch = {
      id: `srch_${Date.now()}`,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };
    setSavedSearches(prev => [newItem, ...prev]);
  }, []);

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  }, []);

  const toggleFollowSeller = useCallback((sellerId: string) => {
    setFollowedSellerIds(prev =>
      prev.includes(sellerId)
        ? prev.filter(id => id !== sellerId)
        : [sellerId, ...prev],
    );
  }, []);

  const isFollowingSeller = useCallback(
    (sellerId: string) => followedSellerIds.includes(sellerId),
    [followedSellerIds],
  );

  const value = useMemo<SavedSearchesContextValue>(() => ({
    savedSearches,
    followedSellerIds,
    saveSearch,
    deleteSearch,
    toggleFollowSeller,
    isFollowingSeller,
  }), [
    savedSearches,
    followedSellerIds,
    saveSearch,
    deleteSearch,
    toggleFollowSeller,
    isFollowingSeller,
  ]);

  return (
    <SavedSearchesContext.Provider value={value}>
      {children}
    </SavedSearchesContext.Provider>
  );
}

export function useSavedSearchesContext(): SavedSearchesContextValue {
  const ctx = useContext(SavedSearchesContext);
  if (!ctx) {
    throw new Error('useSavedSearchesContext must be used inside <SavedSearchesProvider>');
  }
  return ctx;
}
