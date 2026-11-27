/**
 * Types métier — IMMO DU LETCH Mobile
 * Principe S (Single Responsibility) : ce fichier ne contient que les types.
 */

export type Transaction = 'vente' | 'location';
export type PropertyType = 'villa' | 'appartement' | 'terrain' | 'studio' | 'bureau';
export type Condition = 'neuf' | 'ancien' | 'a_renover';
export type SellerType = 'professionnel' | 'particulier';
export type PriceRating = 'excellent' | 'tres_bon' | 'bon' | 'marche' | 'eleve';
export type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'views' | 'surface';

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  phone: string;
  verified: boolean;
  responseTime?: string;
}

export interface Listing {
  id: string;
  title: string;
  titleEn: string;
  transaction: Transaction;
  type: PropertyType;
  condition: Condition;
  price: number;           // FCFA
  surface: number;         // m²
  bedrooms?: number;
  bathrooms?: number;
  city: string;
  neighborhood: string;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  seller: Seller;
  priceDropped: boolean;
  priceDropPercent?: number;
  isNew: boolean;
  views: number;
  rating?: number;
  ratingCount?: number;
  createdAt: string;       // ISO date
  priceHistory?: { date: string; price: number }[];
  /** URL de l'image principale et galerie */
  image?: string;
  gallery?: string[];
  /** Gradient colors used as image placeholder [start, end] */
  gradientColors: [string, string];
}

export interface Filters {
  transaction: Transaction | '';
  city: string;
  type: PropertyType | '';
  priceMin: number;
  priceMax: number;
  surfaceMin: number;
  bedroomsMin: number;
  features: string[];
  documents: string[];
  query: string;
}

export const DEFAULT_FILTERS: Filters = {
  transaction: '',
  city: '',
  type: '',
  priceMin: 0,
  priceMax: 0,
  surfaceMin: 0,
  bedroomsMin: 0,
  features: [],
  documents: [],
  query: '',
};
