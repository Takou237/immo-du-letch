/**
 * Utilitaires de formatage — IMMO DU LETCH Mobile
 * Principe S : fonctions pures de format, sans dépendance React.
 */

/**
 * Format court : 185_000_000 → "185M FCFA" / 350_000 → "350K FCFA" / 80_000 → "80 000 FCFA"
 */
export function formatFCFA(price: number): string {
  if (price >= 1_000_000) {
    const m = price / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M FCFA`;
  }
  if (price >= 100_000) {
    const k = price / 1_000;
    return `${Number.isInteger(k) ? k : k.toFixed(0)}K FCFA`;
  }
  return `${price.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Format long avec espaces : 185_000_000 → "185 000 000 FCFA"
 */
export function formatFullFCFA(price: number): string {
  return `${price.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Surface : 280 → "280 m²"
 */
export function formatSurface(surface: number): string {
  return `${surface} m²`;
}

/**
 * Prix par m² : "661K FCFA/m²"
 */
export function formatPricePerSqm(price: number, surface: number): string {
  if (!surface || surface === 0) return '';
  return `${formatFCFA(Math.round(price / surface))}/m²`;
}
