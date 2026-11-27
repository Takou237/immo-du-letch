/**
 * AppProvider — IMMO DU LETCH Mobile
 * Principe S : composition unique de tous les providers.
 */
import React, { ReactNode } from 'react';
import { LangProvider } from '../i18n/LangContext';
import { AuthProvider } from './AuthProvider';
import { ListingsProvider } from './ListingsProvider';
import { FavoritesProvider } from './FavoritesProvider';
import { CompareProvider } from './CompareProvider';
import { NotificationsProvider } from './NotificationsProvider';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <AuthProvider>
        <ListingsProvider>
          <FavoritesProvider>
            <CompareProvider>
              <NotificationsProvider>
                {children}
              </NotificationsProvider>
            </CompareProvider>
          </FavoritesProvider>
        </ListingsProvider>
      </AuthProvider>
    </LangProvider>
  );
}
