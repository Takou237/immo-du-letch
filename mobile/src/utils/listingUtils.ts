/**
 * Utilitaires métier — IMMO DU LETCH Mobile
 * Principe S : logique de filtrage/tri découplée de l'UI.
 * Principe O : extensions possibles via nouveaux SortKey sans modifier l'existant.
 */
import { Listing, Filters, SortKey, PropertyType, Transaction } from '../types/listing';

/** Filtre les annonces selon les critères actifs */
export function filterListings(listings: Listing[], filters: Filters): Listing[] {
  return listings.filter(l => {
    if (filters.transaction && l.transaction !== filters.transaction) return false;
    if (filters.city && l.city !== filters.city) return false;
    if (filters.type && l.type !== filters.type) return false;
    if (filters.priceMax > 0 && l.price > filters.priceMax) return false;
    if (filters.priceMin > 0 && l.price < filters.priceMin) return false;
    if (filters.surfaceMin > 0 && l.surface < filters.surfaceMin) return false;
    if (filters.bedroomsMin > 0 && (l.bedrooms ?? 0) < filters.bedroomsMin) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${l.title} ${l.titleEn} ${l.city} ${l.neighborhood} ${l.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** Trie les annonces selon la clé choisie */
export function sortListings(listings: Listing[], sort: SortKey): Listing[] {
  return [...listings].sort((a, b) => {
    switch (sort) {
      case 'price_asc':  return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'newest':     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'views':      return b.views - a.views;
      case 'surface':    return b.surface - a.surface;
      default:           return b.views - a.views; // relevance = popularité
    }
  });
}

/** Retourne les N annonces les plus vues (deals en vedette) */
export function getFeaturedListings(listings: Listing[], n: number): Listing[] {
  return sortListings(listings, 'views').slice(0, n);
}

/** Nombre d'annonces par type */
export function countByType(listings: Listing[], type: PropertyType): number {
  return listings.filter(l => l.type === type).length;
}

/** Nombre d'annonces par transaction */
export function countByTransaction(listings: Listing[], transaction: Transaction): number {
  return listings.filter(l => l.transaction === transaction).length;
}

/** Évaluation du prix par rapport à la médiane du même type (vente uniquement) */
export function getPriceRating(listing: Listing, all: Listing[]): 'excellent' | 'tres_bon' | 'bon' | 'marche' | 'eleve' {
  const sameType = all.filter(l => l.type === listing.type && l.transaction === listing.transaction && l.surface > 0);
  if (sameType.length < 2) return 'marche';
  const ppms = sameType.map(l => l.price / l.surface).sort((a, b) => a - b);
  const median = ppms[Math.floor(ppms.length / 2)];
  const ppm = listing.price / listing.surface;
  const ratio = ppm / median;
  if (ratio < 0.75) return 'excellent';
  if (ratio < 0.90) return 'tres_bon';
  if (ratio < 1.10) return 'bon';
  if (ratio < 1.30) return 'marche';
  return 'eleve';
}
