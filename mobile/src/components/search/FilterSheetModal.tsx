/**
 * FilterSheetModal — modale de filtres avancés pour SearchScreen.
 * Thème officiel IMMO DU LETCH, traduction FR/EN complète, icônes Lucide.
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, RotateCcw } from 'lucide-react-native';
import { Filters, PropertyType, Transaction } from '../../types/listing';
import { CITY_OPTIONS } from '../../data/listings';
import { useLang } from '../../i18n/LangContext';
import { colors } from '../../theme';

interface FilterSheetModalProps {
  visible: boolean;
  filters: Filters;
  resultCount: number;
  onChangeFilters: (partial: Partial<Filters>) => void;
  onReset: () => void;
  onClose: () => void;
}

const PROPERTY_TYPES: PropertyType[] = ['villa', 'appartement', 'terrain', 'studio', 'bureau'];

const BUDGET_PRESETS = [
  { labelFr: 'Tout', labelEn: 'Any', value: 0 },
  { labelFr: '≤ 500K', labelEn: '≤ 500K', value: 500_000 },
  { labelFr: '≤ 20M', labelEn: '≤ 20M', value: 20_000_000 },
  { labelFr: '≤ 60M', labelEn: '≤ 60M', value: 60_000_000 },
  { labelFr: '≤ 150M', labelEn: '≤ 150M', value: 150_000_000 },
];

const ROOM_PRESETS = [0, 1, 2, 3, 4];

export function FilterSheetModal({
  visible,
  filters,
  resultCount,
  onChangeFilters,
  onReset,
  onClose,
}: FilterSheetModalProps) {
  const { lang, t } = useLang();

  const toggleTransaction = (val: Transaction | '') => {
    onChangeFilters({ transaction: filters.transaction === val ? '' : val });
  };

  const toggleCity = (city: string) => {
    onChangeFilters({ city: filters.city === city ? '' : city });
  };

  const toggleType = (type: PropertyType) => {
    onChangeFilters({ type: filters.type === type ? '' : type });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header modale */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t.search.filtersTitle}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
                <RotateCcw size={15} color={colors.textSecondary} />
                <Text style={styles.resetText}>{t.search.resetFilters}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <X size={20} color={colors.navy} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Transaction */}
            <Text style={styles.sectionLabel}>
              {lang === 'fr' ? 'Transaction' : 'Transaction'}
            </Text>
            <View style={styles.chipsWrap}>
              <TouchableOpacity
                style={[styles.chip, filters.transaction === '' && styles.chipActive]}
                onPress={() => onChangeFilters({ transaction: '' })}
              >
                <Text style={[styles.chipText, filters.transaction === '' && styles.chipTextActive]}>
                  {lang === 'fr' ? 'Tout' : 'All'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, filters.transaction === 'vente' && styles.chipActive]}
                onPress={() => toggleTransaction('vente')}
              >
                <Text style={[styles.chipText, filters.transaction === 'vente' && styles.chipTextActive]}>
                  {t.home.buyTab}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, filters.transaction === 'location' && styles.chipActive]}
                onPress={() => toggleTransaction('location')}
              >
                <Text style={[styles.chipText, filters.transaction === 'location' && styles.chipTextActive]}>
                  {t.home.rentTab}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Ville */}
            <Text style={styles.sectionLabel}>{t.home.cityLabel}</Text>
            <View style={styles.chipsWrap}>
              <TouchableOpacity
                style={[styles.chip, filters.city === '' && styles.chipActive]}
                onPress={() => onChangeFilters({ city: '' })}
              >
                <Text style={[styles.chipText, filters.city === '' && styles.chipTextActive]}>
                  {t.home.cityPlaceholder}
                </Text>
              </TouchableOpacity>
              {CITY_OPTIONS.map(city => {
                const active = filters.city === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleCity(city)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Type de bien */}
            <Text style={styles.sectionLabel}>{t.home.typeLabel}</Text>
            <View style={styles.chipsWrap}>
              {PROPERTY_TYPES.map(type => {
                const active = filters.type === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleType(type)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {t.propertyTypeSingular[type]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Budget max */}
            <Text style={styles.sectionLabel}>{t.home.budgetLabel}</Text>
            <View style={styles.chipsWrap}>
              {BUDGET_PRESETS.map(preset => {
                const active = filters.priceMax === preset.value;
                return (
                  <TouchableOpacity
                    key={preset.value}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => onChangeFilters({ priceMax: preset.value })}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {lang === 'fr' ? preset.labelFr : preset.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Chambres min */}
            <Text style={styles.sectionLabel}>{t.home.roomsLabel}</Text>
            <View style={styles.chipsWrap}>
              {ROOM_PRESETS.map(count => {
                const active = filters.bedroomsMin === count;
                return (
                  <TouchableOpacity
                    key={count}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => onChangeFilters({ bedroomsMin: count })}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {count === 0 ? t.home.roomsAny : `${count}+`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Bouton Appliquer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.applyText}>{t.search.applyFilters(resultCount)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 16, 26, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  closeBtn: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 20,
    padding: 6,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.gold,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyBtn: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyText: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '800',
  },
});
