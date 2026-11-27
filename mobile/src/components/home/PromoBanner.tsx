/**
 * PromoBanner — bannière hero de l'accueil, inspirée mobile.de.
 * Adapté immobilier camerounais : gradient navy + or.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPressCta: () => void;
}

export function PromoBanner({ title, subtitle, ctaLabel, onPressCta }: PromoBannerProps) {
  return (
    <View style={styles.container}>
      {/* Badge info */}
      <TouchableOpacity style={styles.infoBtn} hitSlop={8}>
        <Info size={14} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Badge plateforme */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>IMMO DU LETCH</Text>
      </View>

      {/* Icône déco */}
      <Text style={styles.emoji}>🏠</Text>

      {/* Titre */}
      <Text style={styles.title}>{title}</Text>

      {/* Sous-titre */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* CTA */}
      <TouchableOpacity style={styles.cta} onPress={onPressCta} activeOpacity={0.85}>
        <Text style={styles.ctaText}>{ctaLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#0B1B2B',
    borderWidth: 1,
    borderColor: '#1E3A5F',
    padding: 20,
    minHeight: 190,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  infoBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  badgeText: {
    color: '#0B1B2B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 6,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  cta: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  ctaText: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
