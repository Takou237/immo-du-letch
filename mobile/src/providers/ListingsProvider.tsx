/**
 * ListingsProvider — IMMO DU LETCH Mobile
 * Principe S : gestion exclusive de l'état des annonces.
 * Principe D : dépend de listingUtils (abstractions), pas de l'implémentation UI.
 */
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { Listing, Filters, SortKey, PropertyType, Transaction, DEFAULT_FILTERS } from '../types/listing';
import { LISTINGS } from '../data/listings';
import {
  filterListings,
  sortListings,
  getFeaturedListings,
  countByType,
  countByTransaction,
} from '../utils/listingUtils';

interface ListingsContextValue {
  listings: Listing[];
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
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>('relevance');

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const filteredListings = useMemo(
    () => sortListings(filterListings(LISTINGS, filters), sortKey),
    [filters, sortKey],
  );

  const getFeatured = useCallback(
    (n = 6) => getFeaturedListings(LISTINGS, n),
    [],
  );

  const getByType = useCallback(
    (type: PropertyType) => LISTINGS.filter(l => l.type === type),
    [],
  );

  const getByTransaction = useCallback(
    (transaction: Transaction) => LISTINGS.filter(l => l.transaction === transaction),
    [],
  );

  const countByTypeFn = useCallback(
    (type: PropertyType) => countByType(LISTINGS, type),
    [],
  );

  const countByTransactionFn = useCallback(
    (transaction: Transaction) => countByTransaction(LISTINGS, transaction),
    [],
  );

  const value = useMemo<ListingsContextValue>(() => ({
    listings: LISTINGS,
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
  }), [filteredListings, filters, setFilters, resetFilters, sortKey, setSortKey, getFeatured, getByType, getByTransaction, countByTypeFn, countByTransactionFn]);

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
