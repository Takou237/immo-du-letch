import React, { createContext, useContext, useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lang, Translations, translations } from './translations';

const STORAGE_LANG = 'immo:lang';

function detectDeviceLang(): Lang {
  try {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
        : NativeModules.I18nManager?.localeIdentifier;
    if (typeof locale === 'string' && locale.toLowerCase().startsWith('en')) {
      return 'en';
    }
    const intlLocale = Intl?.DateTimeFormat?.().resolvedOptions?.().locale;
    if (typeof intlLocale === 'string' && intlLocale.toLowerCase().startsWith('en')) {
      return 'en';
    }
  } catch {
    // Fallback sur fr
  }
  return 'fr';
}

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  t: translations.fr,
  toggleLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectDeviceLang);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_LANG);
        if (saved === 'fr' || saved === 'en') {
          setLang(saved);
        }
      } catch {
        // Silencieux
      }
    })();
  }, []);

  const toggleLang = () => {
    setLang(prev => {
      const next: Lang = prev === 'fr' ? 'en' : 'fr';
      AsyncStorage.setItem(STORAGE_LANG, next).catch(() => {});
      return next;
    });
  };

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
