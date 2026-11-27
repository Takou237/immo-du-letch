/**
 * PromoBanner — bannière hero de l'accueil, thème officiel IMMO DU LETCH (Navy + Or).
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { colors } from '../../theme';

interface PromoBannerProps {
  badgeLabel: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPressCta: () => void;
}

export function PromoBanner({
  badgeLabel,
  title,
  subtitle,
  ctaLabel,
  onPressCta,
}: PromoBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <ShieldCheck size={12} color={colors.navy} strokeWidth={2.5} />
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
        <View style={styles.iconCircle}>
          <Building2 size={22} color={colors.gold} strokeWidth={1.8} />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <TouchableOpacity style={styles.cta} onPress={onPressCta} activeOpacity={0.85}>
        <Text style={styles.ctaText}>{ctaLabel}</Text>
        <ArrowRight size={15} color={colors.navy} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: colors.navy,
    padding: 20,
    overflow: 'hidden',
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.gold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textOnNavy,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 6,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  cta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctaText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
