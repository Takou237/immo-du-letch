/**
 * CompareProvider — IMMO DU LETCH Mobile
 * Principe S : gestion exclusive de la liste de comparaison (max 3 biens).
 * Règle métier : impossible de comparer un bien à vendre avec un bien à louer.
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
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useListingsContext } from './ListingsProvider';
import { useLang } from '../i18n/LangContext';

const STORAGE_COMPARE = 'immo:compare';
const STORAGE_COMPARE_ENABLED = 'immo:compareEnabled';
export const MAX_COMPARE = 3;

interface CompareContextValue {
  compareIds: string[];
  compareEnabled: boolean;
  setCompareEnabled: (enabled: boolean) => void;
  toggleCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const { listings } = useListingsContext();
  const { lang } = useLang();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareEnabled, setCompareEnabledState] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [raw, rawEnabled] = await Promise.all([
          AsyncStorage.getItem(STORAGE_COMPARE),
          AsyncStorage.getItem(STORAGE_COMPARE_ENABLED),
        ]);
        if (raw) setCompareIds(JSON.parse(raw));
        if (rawEnabled !== null) setCompareEnabledState(JSON.parse(rawEnabled));
      } catch {
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

  const setCompareEnabled = useCallback((enabled: boolean) => {
    setCompareEnabledState(enabled);
    AsyncStorage.setItem(STORAGE_COMPARE_ENABLED, JSON.stringify(enabled)).catch(() => {});
  }, []);

  /** Retourne true si ajouté/retiré, false si refusé (limite ou transaction différente) */
  const toggleCompare = useCallback((id: string): boolean => {
    if (compareIds.includes(id)) {
      setCompareIds(prev => prev.filter(item => item !== id));
      return true;
    }

    if (compareIds.length >= MAX_COMPARE) {
      Alert.alert(
        lang === 'fr' ? 'Comparateur plein' : 'Comparison full',
        lang === 'fr'
          ? `Vous pouvez comparer jusqu'à ${MAX_COMPARE} biens maximum.`
          : `You can compare up to ${MAX_COMPARE} properties.`,
      );
      return false;
    }

    if (compareIds.length > 0) {
      const target = listings.find(l => l.id === id);
      const first = listings.find(l => l.id === compareIds[0]);
      if (target && first && target.transaction !== first.transaction) {
        Alert.alert(
          lang === 'fr' ? 'Comparaison impossible' : 'Cannot compare',
          lang === 'fr'
            ? 'Vous ne pouvez pas comparer un bien à vendre avec un bien à louer.'
            : 'You cannot compare a property for sale with a property for rent.',
        );
        return false;
      }
    }

    setCompareIds(prev => [...prev, id]);
    return true;
  }, [compareIds, listings, lang]);

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
    compareEnabled,
    setCompareEnabled,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isComparing,
  }), [compareIds, compareEnabled, setCompareEnabled, toggleCompare, removeFromCompare, clearCompare, isComparing]);

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
