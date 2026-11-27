/**
 * AppProvider — IMMO DU LETCH Mobile
 * Principe S : composition unique de tous les providers.
 */
import React, { ReactNode } from 'react';
import { LangProvider } from '../i18n/LangContext';
import { ListingsProvider } from './ListingsProvider';
import { FavoritesProvider } from './FavoritesProvider';
import { SavedSearchesProvider } from './SavedSearchesProvider';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <ListingsProvider>
        <FavoritesProvider>
          <SavedSearchesProvider>
            {children}
          </SavedSearchesProvider>
        </FavoritesProvider>
      </ListingsProvider>
    </LangProvider>
  );
}
