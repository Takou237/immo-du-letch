/**
 * CompareProvider — IMMO DU LETCH Mobile
 * Principe S : gestion exclusive de la liste de comparaison (max 3 biens).
 * Aligné sur src/store/AppStore.tsx du web.
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

const STORAGE_COMPARE = 'immo:compare';
export const MAX_COMPARE = 3;

interface CompareContextValue {
  compareIds: string[];
  toggleCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_COMPARE);
        if (raw) setCompareIds(JSON.parse(raw));
      } catch (_) {
        // Silencieux
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_COMPARE, JSON.stringify(compareIds)).catch(() => {});
  }, [compareIds, hydrated]);

  /** Retourne true si ajouté/retiré, false si limite MAX_COMPARE atteinte */
  const toggleCompare = useCallback((id: string): boolean => {
    let ok = true;
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        ok = false;
        return prev;
      }
      return [...prev, id];
    });
    return ok;
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareIds(prev => prev.filter(item => item !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const isComparing = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds],
  );

  const value = useMemo<CompareContextValue>(() => ({
    compareIds,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isComparing,
  }), [compareIds, toggleCompare, removeFromCompare, clearCompare, isComparing]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompareContext(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompareContext must be used inside <CompareProvider>');
  return ctx;
}
