/**
 * FloatingCompareBubble — Bulle flottante qui apparaît dès qu'au moins 1 bien
 * est sélectionné pour la comparaison, et redirige vers l'écran Compare au clic.
 */
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Scale } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCompare } from '../hooks/useCompare';
import { useLang } from '../i18n/LangContext';
import { colors } from '../theme';

interface Props {
  currentRouteName?: string;
  onPress: () => void;
}

export function FloatingCompareBubble({ currentRouteName, onPress }: Props) {
  const { compareIds } = useCompare();
  const { lang } = useLang();
  const insets = useSafeAreaInsets();

  // Masquée si aucun bien sélectionné ou déjà sur la page Compare
  if (compareIds.length === 0 || currentRouteName === 'Compare') {
    return null;
  }

  // Remonter suffisamment au-dessus de la barre du bas / footer
  const bottomOffset = (currentRouteName === 'ListingDetail' ? 88 : 84) + Math.max(insets.bottom, 8);

  return (
    <TouchableOpacity
      style={[styles.bubble, { bottom: bottomOffset }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.iconWrap}>
        <Scale size={16} color={colors.navy} strokeWidth={2.4} />
      </View>
      <Text style={styles.label}>
        {lang === 'fr' ? 'Comparer' : 'Compare'}
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{compareIds.length}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.navy,
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: 999,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: colors.navy,
    fontSize: 11,
    fontWeight: '800',
  },
});
