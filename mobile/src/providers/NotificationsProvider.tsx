/**
 * NotificationsProvider — IMMO DU LETCH Mobile
 * Gestion partagée des notifications avec persistance AsyncStorage.
 * Lorsqu'une notification est lue, elle disparaît de la liste et décrémente
 * automatiquement le badge sur l'onglet Paramètres, les Paramètres et la cloche.
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

const STORAGE_NOTIFS = 'immo:notifications';
const STORAGE_NOTIFS_ENABLED = 'immo:notificationsEnabled';

export type NotifType = 'price' | 'favorite' | 'message' | 'new';

export interface NotifItem {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
}

const INITIAL_NOTIFS: NotifItem[] = [
  {
    id: '1',
    type: 'price',
    title: 'Baisse de prix',
    body: 'La Villa à Bastos a baissé de 25 000 000 FCFA',
    time: 'Il y a 2h',
  },
  {
    id: '2',
    type: 'new',
    title: 'Nouveau bien',
    body: '3 nouvelles annonces correspondent à votre alerte "Appartement Douala"',
    time: 'Il y a 5h',
  },
];

interface NotificationsContextValue {
  notifications: NotifItem[];
  unreadCount: number;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  markReadAndRemove: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotifItem[]>(INITIAL_NOTIFS);
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [raw, rawEnabled] = await Promise.all([
          AsyncStorage.getItem(STORAGE_NOTIFS),
          AsyncStorage.getItem(STORAGE_NOTIFS_ENABLED),
        ]);
        if (raw !== null) {
          setNotifications(JSON.parse(raw));
        }
        if (rawEnabled !== null) {
          setNotificationsEnabledState(JSON.parse(rawEnabled));
        }
      } catch {
        // Silencieux
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_NOTIFS, JSON.stringify(notifications)).catch(() => {});
  }, [notifications, hydrated]);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    AsyncStorage.setItem(STORAGE_NOTIFS_ENABLED, JSON.stringify(enabled)).catch(() => {});
  }, []);

  /** Lire une notification la fait disparaître de la liste */
  const markReadAndRemove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo<NotificationsContextValue>(() => ({
    notifications,
    unreadCount: notificationsEnabled ? notifications.length : 0,
    notificationsEnabled,
    setNotificationsEnabled,
    markReadAndRemove,
    clearAll,
  }), [notifications, notificationsEnabled, setNotificationsEnabled, markReadAndRemove, clearAll]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used inside <NotificationsProvider>');
  return ctx;
}
