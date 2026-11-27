/**
 * ListingsProvider — IMMO DU LETCH Mobile
 * Principe S : gestion exclusive de l'état des annonces (catalogue + annonces locales).
 * Principe D : dépend de listingUtils (abstractions), pas de l'implémentation UI.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Listing,
  Filters,
  SortKey,
  PropertyType,
  Transaction,
  DEFAULT_FILTERS,
} from '../types/listing';
import { LISTINGS, LISTING_GRADIENTS } from '../data/listings';
import { fetchRemoteListings } from '../api/listingsApi';
import {
  filterListings,
  sortListings,
  getFeaturedListings,
  countByType,
  countByTransaction,
} from '../utils/listingUtils';

const STORAGE_LOCAL_LISTINGS = 'immo:localListings';

export interface LocalListing extends Listing {
  localStatus: 'pending' | 'validated';
}

export interface CreateLocalListingInput {
  title: string;
  transaction: Transaction;
  type: PropertyType;
  condition: Listing['condition'];
  price: number;
  surface: number;
  bedrooms?: number;
  bathrooms?: number;
  city: string;
  neighborhood: string;
  description: string;
  features: string[];
  sellerName: string;
  sellerPhone: string;
}

interface ListingsContextValue {
  listings: Listing[];
  localListings: LocalListing[];
  filteredListings: Listing[];
  filters: Filters;
  setFilters: (partial: Partial<Filters>) => void;
  resetFilters: () => void;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  getFeatured: (n?: number) => Listing[];
  getByType: (type: PropertyType) => Listing[];
  getByTransaction: (transaction: Transaction) => Listing[];
  countByTypeFn: (type: PropertyType) => number;
  countByTransactionFn: (transaction: Transaction) => number;
  addLocalListing: (input: CreateLocalListingInput) => LocalListing;
  deleteLocalListing: (id: string) => void;
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [baseListings, setBaseListings] = useState<Listing[]>(LISTINGS);
  const [localListings, setLocalListings] = useState<LocalListing[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>('relevance');

  useEffect(() => {
    let active = true;
    fetchRemoteListings().then(remote => {
      if (active && remote && remote.length > 0) {
        setBaseListings(remote);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_LOCAL_LISTINGS);
        if (raw) setLocalListings(JSON.parse(raw));
      } catch {
        // Silencieux si lecture échoue
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_LOCAL_LISTINGS, JSON.stringify(localListings)).catch(() => {});
  }, [localListings, hydrated]);

  const allListings = useMemo<Listing[]>(
    () => [...localListings, ...baseListings],
    [localListings, baseListings],
  );

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const addLocalListing = useCallback((input: CreateLocalListingInput): LocalListing => {
    const created: LocalListing = {
      id: `local_${Date.now()}`,
      title: input.title,
      titleEn: input.title,
      transaction: input.transaction,
      type: input.type,
      condition: input.condition,
      price: input.price,
      surface: input.surface,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      city: input.city,
      neighborhood: input.neighborhood,
      description: input.description,
      descriptionEn: input.description,
      features: input.features,
      featuresEn: input.features,
      seller: {
        id: 'local_user',
        name: input.sellerName,
        type: 'particulier',
        phone: input.sellerPhone,
        verified: false,
      },
      priceDropped: false,
      isNew: true,
      views: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      gradientColors: LISTING_GRADIENTS[input.type] ?? ['#071F49', '#0D2D66'],
      localStatus: 'pending',
    };
    setLocalListings(prev => [created, ...prev]);
    return created;
  }, []);

  const deleteLocalListing = useCallback((id: string) => {
    setLocalListings(prev => prev.filter(l => l.id !== id));
  }, []);

  const filteredListings = useMemo(
    () => sortListings(filterListings(allListings, filters), sortKey),
    [allListings, filters, sortKey],
  );

  const getFeatured = useCallback(
    (n = 6) => getFeaturedListings(allListings, n),
    [allListings],
  );

  const getByType = useCallback(
    (type: PropertyType) => allListings.filter(l => l.type === type),
    [allListings],
  );

  const getByTransaction = useCallback(
    (transaction: Transaction) => allListings.filter(l => l.transaction === transaction),
    [allListings],
  );

  const countByTypeFn = useCallback(
    (type: PropertyType) => countByType(allListings, type),
    [allListings],
  );

  const countByTransactionFn = useCallback(
    (transaction: Transaction) => countByTransaction(allListings, transaction),
    [allListings],
  );

  const value = useMemo<ListingsContextValue>(() => ({
    listings: allListings,
    localListings,
    filteredListings,
    filters,
    setFilters,
    resetFilters,
    sortKey,
    setSortKey,
    getFeatured,
    getByType,
    getByTransaction,
    countByTypeFn,
    countByTransactionFn,
    addLocalListing,
    deleteLocalListing,
  }), [
    allListings,
    localListings,
    filteredListings,
    filters,
    setFilters,
    resetFilters,
    sortKey,
    setSortKey,
    getFeatured,
    getByType,
    getByTransaction,
    countByTypeFn,
    countByTransactionFn,
    addLocalListing,
    deleteLocalListing,
  ]);

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}

/** Hook consommateur — lève une erreur claire hors Provider */
export function useListingsContext(): ListingsContextValue {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListingsContext must be used inside <ListingsProvider>');
  return ctx;
}
