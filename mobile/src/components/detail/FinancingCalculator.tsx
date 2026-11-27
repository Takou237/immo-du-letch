/**
 * FinancingCalculator — Simulateur de mensualité (aligné sur src/components/FinancingCalculator.tsx).
 * Formule identique au web : taux indicatif 9% / an, apport 10-50%, durée 12-60 mois.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calculator } from 'lucide-react-native';
import { formatFullFCFA } from '../../utils/formatPrice';
import { useLang } from '../../i18n/LangContext';
import { colors } from '../../theme';

interface FinancingCalculatorProps {
  price: number;
}

const DOWN_PERCENTS = [10, 20, 30, 40, 50];
const DURATIONS = [12, 24, 36, 60];
const ANNUAL_RATE = 0.09;

export function FinancingCalculator({ price }: FinancingCalculatorProps) {
  const { lang, t } = useLang();
  const [downPercent, setDownPercent] = useState(20);
  const [months, setMonths] = useState(36);

  const downPayment = Math.round((price * downPercent) / 100);
  const principal = Math.max(0, price - downPayment);
  const monthlyRate = ANNUAL_RATE / 12;
  const monthlyPayment =
    principal === 0
      ? 0
      : Math.round(
          (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1),
        );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Calculator size={18} color={colors.navy} />
          <Text style={styles.title}>{t.detail.financingTitle}</Text>
        </View>
        <View style={styles.monthlyBox}>
          <Text style={styles.monthlyLabel}>{t.detail.monthly}</Text>
          <Text style={styles.monthlyValue}>
            {formatFullFCFA(monthlyPayment)} {t.common.perMonth}
          </Text>
        </View>
      </View>

      <Text style={styles.subLabel}>
        {lang === 'fr' ? `Apport personnel (${downPercent}%)` : `Down payment (${downPercent}%)`} :{' '}
        <Text style={styles.boldVal}>{formatFullFCFA(downPayment)}</Text>
      </Text>
      <View style={styles.chipsRow}>
        {DOWN_PERCENTS.map(pct => (
          <TouchableOpacity
            key={pct}
            style={[styles.chip, downPercent === pct && styles.chipActive]}
            onPress={() => setDownPercent(pct)}
          >
            <Text style={[styles.chipText, downPercent === pct && styles.chipTextActive]}>
              {pct}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subLabel}>
        {lang === 'fr' ? 'Durée du financement' : 'Financing duration'}
      </Text>
      <View style={styles.chipsRow}>
        {DURATIONS.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, months === d && styles.chipActive]}
            onPress={() => setMonths(d)}
          >
            <Text style={[styles.chipText, months === d && styles.chipTextActive]}>
              {d} {lang === 'fr' ? 'mois' : 'mo'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        {lang === 'fr'
          ? `Simulation indicative basée sur un taux annuel de 9 % pour un montant financé de ${formatFullFCFA(principal)}.`
          : `Indicative simulation based on a 9% annual rate for a financed amount of ${formatFullFCFA(principal)}.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  headerRow: {
    gap: 10,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  monthlyBox: {
    backgroundColor: colors.infoSoft,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  monthlyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthlyValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
    marginTop: 2,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 8,
  },
  boldVal: {
    fontWeight: '800',
    color: colors.navy,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.gold,
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 12,
  },
});
