/**
 * AuthProvider — IMMO DU LETCH Mobile
 * Connecté à l'API Laravel (/auth/login, /auth/register, /auth/google, /auth/me,
 * /auth/profile, /auth/logout) avec repli hors-ligne sur AsyncStorage.
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
import { api, ApiError, ApiUser, getApiToken, setApiToken } from '../api/client';

const STORAGE_USER = 'immo:user';

export type AccountType = 'particulier' | 'agence' | 'agent_independant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: AccountType;
  agencyName?: string;
  createdAt: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  accountType: AccountType;
  agencyName?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (input: RegisterInput) => Promise<void>;
  loginWithDemo: (name: string, email: string, accountType?: AccountType) => Promise<void>;
  updateProfile: (partial: Partial<Pick<UserProfile, 'name' | 'phone' | 'accountType' | 'agencyName'>>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapApiUser(raw: ApiUser, preferredAccountType?: AccountType): UserProfile {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    phone: raw.phone ?? '',
    accountType:
      preferredAccountType ??
      (raw.accountType === 'professionnel' ? 'agence' : 'particulier'),
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

function toApiAccountType(at: AccountType): 'particulier' | 'professionnel' {
  return at === 'particulier' ? 'particulier' : 'professionnel';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_USER);
        if (raw) setUser(JSON.parse(raw));
        const token = await getApiToken();
        if (token) {
          const res = await api.me().catch(() => null);
          if (res?.user) {
            setUser(mapApiUser(res.user));
          }
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
    if (user) {
      AsyncStorage.setItem(STORAGE_USER, JSON.stringify(user)).catch(() => {});
    } else {
      AsyncStorage.removeItem(STORAGE_USER).catch(() => {});
    }
  }, [user, hydrated]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await api.login(cleanEmail, password);
      await setApiToken(res.token);
      setUser(mapApiUser(res.user));
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.status) {
        // Erreur explicite serveur (ex: mot de passe incorrect) -> remonter à l'UI
        throw err;
      }
      // Pas de réseau -> repli hors-ligne
      const fallbackName = cleanEmail.split('@')[0] || 'Utilisateur';
      setUser({
        id: `user_${Date.now()}`,
        name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
        email: cleanEmail,
        phone: '+237 699 000 000',
        accountType: 'particulier',
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  const registerWithEmail = useCallback(async (input: RegisterInput) => {
    const cleanEmail = input.email.trim().toLowerCase();
    try {
      const res = await api.register({
        name: input.name.trim(),
        email: cleanEmail,
        password: input.password,
        phone: input.phone.trim() || undefined,
        accountType: toApiAccountType(input.accountType),
      });
      await setApiToken(res.token);
      setUser(mapApiUser(res.user, input.accountType));
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.status) {
        throw err;
      }
      // Hors-ligne -> création locale
      setUser({
        id: `user_${Date.now()}`,
        name: input.name.trim(),
        email: cleanEmail,
        phone: input.phone.trim(),
        accountType: input.accountType,
        agencyName: input.agencyName?.trim() || undefined,
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  const loginWithDemo = useCallback(
    async (name: string, email: string, accountType: AccountType = 'particulier') => {
      try {
        const res = await api.googleLogin(name, email);
        await setApiToken(res.token);
        setUser(mapApiUser(res.user, accountType));
      } catch {
        setUser({
          id: `demo_${Date.now()}`,
          name,
          email,
          phone: '+237 699 123 456',
          accountType,
          createdAt: new Date().toISOString(),
        });
      }
    },
    [],
  );

  const updateProfile = useCallback(
    async (partial: Partial<Pick<UserProfile, 'name' | 'phone' | 'accountType' | 'agencyName'>>) => {
      setUser(prev => (prev ? { ...prev, ...partial } : prev));
      const token = await getApiToken();
      if (token && user) {
        api
          .updateProfile({
            name: partial.name ?? user.name,
            phone: partial.phone ?? user.phone,
            accountType: toApiAccountType(partial.accountType ?? user.accountType),
          })
          .catch(() => {});
      }
    },
    [user],
  );

  const logout = useCallback(() => {
    api.logout().catch(() => {});
    setApiToken(null).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loginWithEmail,
    registerWithEmail,
    loginWithDemo,
    updateProfile,
    logout,
  }), [user, loginWithEmail, registerWithEmail, loginWithDemo, updateProfile, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
