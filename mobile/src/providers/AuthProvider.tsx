/**
 * AuthProvider — IMMO DU LETCH Mobile
 * Principe S : gestion exclusive du profil utilisateur local (sans serveur).
 * Supporte les 3 types de comptes : particulier, agence, agent_independant.
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
  phone: string;
  accountType: AccountType;
  agencyName?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loginWithEmail: (email: string) => void;
  registerWithEmail: (input: RegisterInput) => void;
  loginWithDemo: (name: string, email: string, accountType?: AccountType) => void;
  updateProfile: (partial: Partial<Pick<UserProfile, 'name' | 'phone' | 'accountType' | 'agencyName'>>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_USER);
        if (raw) setUser(JSON.parse(raw));
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

  const loginWithEmail = useCallback((email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const fallbackName = cleanEmail.split('@')[0] || 'Utilisateur';
    setUser({
      id: `user_${Date.now()}`,
      name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
      email: cleanEmail,
      phone: '+237 699 000 000',
      accountType: 'particulier',
      createdAt: new Date().toISOString(),
    });
  }, []);

  const registerWithEmail = useCallback((input: RegisterInput) => {
    setUser({
      id: `user_${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      accountType: input.accountType,
      agencyName: input.agencyName?.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const loginWithDemo = useCallback(
    (name: string, email: string, accountType: AccountType = 'particulier') => {
      setUser({
        id: `demo_${Date.now()}`,
        name,
        email,
        phone: '+237 699 123 456',
        accountType,
        createdAt: new Date().toISOString(),
      });
    },
    [],
  );

  const updateProfile = useCallback(
    (partial: Partial<Pick<UserProfile, 'name' | 'phone' | 'accountType' | 'agencyName'>>) => {
      setUser(prev => (prev ? { ...prev, ...partial } : prev));
    },
    [],
  );

  const logout = useCallback(() => {
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
