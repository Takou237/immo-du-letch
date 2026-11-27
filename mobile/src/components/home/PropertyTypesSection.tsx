/**
 * PropertyTypesSection — grille 2×N des types de biens avec icônes Lucide (sans emoji).
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PropertyType } from '../../types/listing';
import { PropertyTypeIcon } from '../PropertyTypeIcon';
import { colors } from '../../theme';

interface TypeItem {
  type: PropertyType;
  label: string;
  count: number;
}

interface PropertyTypesSectionProps {
  title: string;
  listingsWord: string;
  items: TypeItem[];
  onPress: (type: PropertyType) => void;
}

export function PropertyTypesSection({ title, listingsWord, items, onPress }: PropertyTypesSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.grid}>
        {items.map(item => (
          <TouchableOpacity
            key={item.type}
            style={styles.cell}
            onPress={() => onPress(item.type)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>
              <PropertyTypeIcon type={item.type} size={22} color={colors.navy} />
            </View>
            <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
            <Text style={styles.count}>{item.count} {listingsWord}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 28,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {
    width: '48%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
    textAlign: 'center',
  },
  count: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
});
