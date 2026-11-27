/**
 * FeaturedCategoriesSection — Grille 2x3 "Que recherchez-vous ?" alignée sur le web.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Home,
  Building2,
  Map as MapIcon,
  KeyRound,
  Briefcase,
  BedDouble,
} from 'lucide-react-native';
import { PropertyType } from '../../types/listing';
import { colors } from '../../theme';

interface QuickCategory {
  id: string;
  labelFr: string;
  labelEn: string;
  type?: PropertyType;
  furnishedRental?: boolean;
  icon: React.ReactNode;
}

const CATEGORIES: QuickCategory[] = [
  {
    id: 'villa',
    labelFr: 'Maisons & villas',
    labelEn: 'Houses & villas',
    type: 'villa',
    icon: <Home size={20} color={colors.navy} strokeWidth={1.8} />,
  },
  {
    id: 'appartement',
    labelFr: 'Appartements',
    labelEn: 'Apartments',
    type: 'appartement',
    icon: <Building2 size={20} color={colors.navy} strokeWidth={1.8} />,
  },
  {
    id: 'terrain',
    labelFr: 'Terrains',
    labelEn: 'Land',
    type: 'terrain',
    icon: <MapIcon size={20} color={colors.navy} strokeWidth={1.8} />,
  },
  {
    id: 'studio',
    labelFr: 'Studios & chambres',
    labelEn: 'Studios & rooms',
    type: 'studio',
    icon: <KeyRound size={20} color={colors.navy} strokeWidth={1.8} />,
  },
  {
    id: 'bureau',
    labelFr: 'Bureaux & commerces',
    labelEn: 'Offices & commercial',
    type: 'bureau',
    icon: <Briefcase size={20} color={colors.navy} strokeWidth={1.8} />,
  },
  {
    id: 'furnished',
    labelFr: 'Locations meublées',
    labelEn: 'Furnished rentals',
    furnishedRental: true,
    icon: <BedDouble size={20} color={colors.navy} strokeWidth={1.8} />,
  },
];

interface FeaturedCategoriesSectionProps {
  title: string;
  lang: 'fr' | 'en';
  onSelectType: (type: PropertyType) => void;
  onSelectFurnished: () => void;
}

export function FeaturedCategoriesSection({
  title,
  lang,
  onSelectType,
  onSelectFurnished,
}: FeaturedCategoriesSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.grid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
              if (cat.furnishedRental) {
                onSelectFurnished();
              } else if (cat.type) {
                onSelectType(cat.type);
              }
            }}
          >
            <View style={styles.iconWrap}>{cat.icon}</View>
            <Text style={styles.cardText} numberOfLines={2}>
              {lang === 'fr' ? cat.labelFr : cat.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48.4%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 58,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
    lineHeight: 17,
  },
});
