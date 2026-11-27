/**
 * AppProvider — IMMO DU LETCH Mobile
 * Principe S : composition unique de tous les providers.
 */
import React, { ReactNode } from 'react';
import { LangProvider } from '../i18n/LangContext';
import { AuthProvider } from './AuthProvider';
import { ListingsProvider } from './ListingsProvider';
import { FavoritesProvider } from './FavoritesProvider';
import { SavedSearchesProvider } from './SavedSearchesProvider';
import { CompareProvider } from './CompareProvider';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <AuthProvider>
        <ListingsProvider>
          <FavoritesProvider>
            <SavedSearchesProvider>
              <CompareProvider>
                {children}
              </CompareProvider>
            </SavedSearchesProvider>
          </FavoritesProvider>
        </ListingsProvider>
      </AuthProvider>
    </LangProvider>
  );
}
