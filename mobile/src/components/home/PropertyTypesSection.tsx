/**
 * PropertyTypesSection — grille 2×N des types de biens avec compteurs.
 * Style "Vehicle types" de mobile.de adapté immobilier.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PropertyType } from '../../types/listing';

interface TypeItem {
  type: PropertyType;
  emoji: string;
  labelFr: string;
  labelEn: string;
  count: number;
}

interface PropertyTypesSectionProps {
  lang: 'fr' | 'en';
  items: TypeItem[];
  onPress: (type: PropertyType) => void;
}

export function PropertyTypesSection({ lang, items, onPress }: PropertyTypesSectionProps) {
  const title    = lang === 'fr' ? 'Types de biens' : 'Property types';
  const listings = lang === 'fr' ? 'annonces'       : 'listings';

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
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{lang === 'fr' ? item.labelFr : item.labelEn}</Text>
            <Text style={styles.count}>{item.count} {listings}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {
    width: '47%',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  label: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  count: {
    color: '#6B7280',
    fontSize: 11,
    textAlign: 'center',
  },
});
