/**
 * SearchBar — pill de recherche cliquable, thème officiel IMMO DU LETCH.
 * Principe O : onPress est extensible sans modifier ce composant.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '../../theme';

interface SearchBarProps {
  placeholder: string;
  onPress: () => void;
}

export function SearchBar({ placeholder, onPress }: SearchBarProps) {
  return (
    <TouchableOpacity style={styles.pill} onPress={onPress} activeOpacity={0.8}>
      <Search size={18} color={colors.navy} strokeWidth={2.2} />
      <Text style={styles.text} numberOfLines={1}>{placeholder}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 15,
    flex: 1,
  },
});
