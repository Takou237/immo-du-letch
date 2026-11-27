/**
 * SearchBar — pill de recherche cliquable, style mobile.de dark.
 * Principe O : onPress est extensible sans modifier ce composant.
 */
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  placeholder: string;
  onPress: () => void;
}

export function SearchBar({ placeholder, onPress }: SearchBarProps) {
  return (
    <TouchableOpacity style={styles.pill} onPress={onPress} activeOpacity={0.8}>
      <Search size={18} color="#9CA3AF" strokeWidth={2} />
      <Text style={styles.text} numberOfLines={1}>{placeholder}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  text: {
    color: '#9CA3AF',
    fontSize: 15,
    flex: 1,
  },
});
