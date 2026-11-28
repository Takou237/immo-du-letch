/**
 * SplashOverlay — Écran d'animation au lancement d'IMMO DU LETCH Mobile.
 * Affiche le logo avec une animation fluide (zoom + fondu + barre dorée),
 * puis disparaît en fondu vers la page d'accueil.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export function SplashOverlay() {
  const [visible, setVisible] = useState(true);

  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.78)).current;
  const barScaleX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(barScaleX, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.delay(250),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [barScaleX, containerOpacity, logoOpacity, logoScale]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, { opacity: containerOpacity }]}
    >
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../../immo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            { transform: [{ scaleX: barScaleX }] },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 150,
  },
  barTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 22,
  },
  barFill: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
});
