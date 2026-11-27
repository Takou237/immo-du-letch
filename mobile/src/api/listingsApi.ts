/**
 * listingsApi — Client API Laravel (Railway) avec résolution des URLs d'images Vercel.
 * Principe S : responsabilité unique de récupération et mapping des annonces distantes.
 */
import { Listing, PropertyType, Transaction, Condition } from '../types/listing';
import { LISTING_GRADIENTS } from '../data/listings';

const API_URL = 'https://laravel-backend-production-7438ec96.up.railway.app/api/listings';
const WEB_ASSET_BASE = 'https://immo-du-letch-eosin.vercel.app';
const TIMEOUT_MS = 6000;

interface ApiListingRaw {
  id: string | number;
  title?: string;
  price?: number;
  transaction?: string;
  type?: string;
  city?: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  surface?: number;
  image?: string;
  gallery?: string[];
  description?: string;
  features?: string[];
  documents?: string[];
  condition?: string;
  sellerType?: string;
  seller?: string;
  sellerRating?: number;
  sellerReviews?: number;
  sellerPhone?: string;
  isNew?: boolean;
  publishedAt?: string;
  views?: number;
  priceDropped?: boolean;
  originalPrice?: number;
}

export function resolveImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${WEB_ASSET_BASE}${clean}`;
}

function mapApiListing(raw: ApiListingRaw): Listing {
  const type = (['villa', 'appartement', 'terrain', 'studio', 'bureau'].includes(raw.type ?? '')
    ? raw.type
    : 'villa') as PropertyType;
  const transaction = (raw.transaction === 'location' ? 'location' : 'vente') as Transaction;
  const condition = (['neuf', 'ancien', 'a_renover'].includes(raw.condition ?? '')
    ? raw.condition
    : 'neuf') as Condition;

  const price = Number(raw.price) || 0;
  const originalPrice = Number(raw.originalPrice) || 0;
  const priceDropPercent =
    raw.priceDropped && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  const mergedFeatures = Array.from(
    new Set([...(raw.features ?? []), ...(raw.documents ?? [])]),
  );

  const mainImg = resolveImageUrl(raw.image);
  const gallery = (raw.gallery ?? [])
    .map(g => resolveImageUrl(g))
    .filter((u): u is string => Boolean(u));

  return {
    id: String(raw.id),
    title: raw.title ?? 'Bien immobilier',
    titleEn: raw.title ?? 'Property listing',
    transaction,
    type,
    condition,
    price,
    surface: Number(raw.surface) || 0,
    bedrooms: raw.bedrooms != null ? Number(raw.bedrooms) : undefined,
    bathrooms: raw.bathrooms != null ? Number(raw.bathrooms) : undefined,
    city: raw.city ?? 'Douala',
    neighborhood: raw.neighborhood ?? '',
    description: raw.description ?? '',
    descriptionEn: raw.description ?? '',
    features: mergedFeatures,
    featuresEn: mergedFeatures,
    seller: {
      id: `api_seller_${raw.id}`,
      name: raw.seller ?? 'Annonceur IMMO DU LETCH',
      type: raw.sellerType === 'particulier' ? 'particulier' : 'professionnel',
      phone: raw.sellerPhone ?? '+237 6 55 00 00 00',
      verified: raw.sellerType !== 'particulier',
    },
    priceDropped: Boolean(raw.priceDropped),
    priceDropPercent,
    isNew: Boolean(raw.isNew),
    views: Number(raw.views) || 0,
    rating: raw.sellerRating != null ? Number(raw.sellerRating) : undefined,
    ratingCount: raw.sellerReviews != null ? Number(raw.sellerReviews) : undefined,
    createdAt: raw.publishedAt ?? '2026-11-01',
    image: mainImg,
    gallery: gallery.length > 0 ? gallery : mainImg ? [mainImg] : undefined,
    gradientColors: LISTING_GRADIENTS[type] ?? ['#071F49', '#0D2D66'],
  };
}

export async function fetchRemoteListings(): Promise<Listing[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(API_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { listings?: ApiListingRaw[] };
    if (!Array.isArray(json.listings) || json.listings.length === 0) return null;
    return json.listings.map(mapApiListing);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
