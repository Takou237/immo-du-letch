/**
 * Hook usePageGuide — gère l'affichage automatique au premier passage sur une page
 * et la réouverture manuelle via le bouton (?) en haut à droite.
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'immo:guideSeen:';

export function usePageGuide(pageKey: string, initialDelayMs = 250) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        const seen = await AsyncStorage.getItem(`${PREFIX}${pageKey}`);
        if (active && seen !== '1') {
          timer = setTimeout(() => {
            if (active) setVisible(true);
          }, initialDelayMs);
        }
      } catch {
        // Silencieux
      }
    })();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [pageKey, initialDelayMs]);

  const closeGuide = useCallback(() => {
    setVisible(false);
    AsyncStorage.setItem(`${PREFIX}${pageKey}`, '1').catch(() => {});
  }, [pageKey]);

  const openGuide = useCallback(() => {
    setVisible(true);
  }, []);

  return { visible, openGuide, closeGuide };
}
