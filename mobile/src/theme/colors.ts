/**
 * Palette officielle du site web IMMO DU LETCH
 * (Bleu royal #071f49 / #0d2d66, Or #f3ad19, Blanc #FFFFFF)
 */
export const colors = {
  // Identité principale (identique au site web)
  navy: '#071F49',
  navyLight: '#0D2D66',
  navyDark: '#051636',
  gold: '#F3AD19',
  goldBright: '#FFBE33',
  goldSoft: '#FFF7E6',

  // Surfaces & fonds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F6',
  border: '#DCE2E9',
  borderLight: '#EEF2F6',

  // Textes
  textPrimary: '#071F49',
  textSecondary: '#637084',
  textMuted: '#8A95A5',
  textOnNavy: '#FFFFFF',
  textOnGold: '#071F49',

  // États
  success: '#1F7A3D',
  successSoft: '#E7F6EC',
  warning: '#D97706',
  warningSoft: '#FFF7E6',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  info: '#2563EB',
  infoSoft: '#EAF0F8',
} as const;
