/**
 * PropertyTypeIcon — icône vectorielle Lucide selon le type de bien.
 * Remplace les emojis pour un rendu professionnel et cohérent.
 */
import React from 'react';
import { Home, Building2, Trees, BedDouble, Briefcase } from 'lucide-react-native';
import { PropertyType } from '../types/listing';

interface PropertyTypeIconProps {
  type: PropertyType;
  size?: number;
  color?: string;
}

export function PropertyTypeIcon({ type, size = 24, color = '#071F49' }: PropertyTypeIconProps) {
  switch (type) {
    case 'villa':
      return <Home size={size} color={color} strokeWidth={2} />;
    case 'appartement':
      return <Building2 size={size} color={color} strokeWidth={2} />;
    case 'terrain':
      return <Trees size={size} color={color} strokeWidth={2} />;
    case 'studio':
      return <BedDouble size={size} color={color} strokeWidth={2} />;
    case 'bureau':
      return <Briefcase size={size} color={color} strokeWidth={2} />;
  }
}
