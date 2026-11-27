/**
 * FilterSheetModal — modale de filtres avancés calquée sur le design mobile du site web.
 * Thème officiel IMMO DU LETCH, traduction FR/EN complète, icônes Lucide.
 */
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { X, ChevronDown, ChevronRight } from 'lucide-react-native';
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
const ROOM_OPTIONS = [0, 1, 2, 3, 4, 5];

const EQUIPMENT_OPTIONS = [
  { value: 'Jardin', fr: 'Jardin', en: 'Garden' },
  { value: 'Parking', fr: 'Parking', en: 'Parking' },
  { value: 'Terrasse', fr: 'Terrasse', en: 'Terrace' },
  { value: 'Piscine', fr: 'Piscine', en: 'Pool' },
  { value: 'Climatisation', fr: 'Climatisation', en: 'Air conditioning' },
  { value: 'Groupe électrogène', fr: 'Groupe électrogène', en: 'Generator' },
  { value: 'Meublé', fr: 'Meublé', en: 'Furnished' },
];

const DOCUMENT_OPTIONS = [
  { value: 'Titre foncier', fr: 'Titre foncier', en: 'Title deed' },
  { value: 'Permis de bâtir', fr: 'Permis de bâtir', en: 'Building permit' },
  { value: 'Plan cadastral', fr: 'Plan cadastral', en: 'Cadastral plan' },
];

export function FilterSheetModal({
  visible,
  filters,
  resultCount,
  onChangeFilters,
  onReset,
  onClose,
}: FilterSheetModalProps) {
  const { lang, t } = useLang();
  const [openDropdown, setOpenDropdown] = useState<'city' | 'type' | 'rooms' | null>(null);

  const toggleTransaction = (val: Transaction) => {
    onChangeFilters({ transaction: filters.transaction === val ? '' : val });
  };

  const toggleArrayItem = (key: 'features' | 'documents', value: string) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChangeFilters({ [key]: next });
  };

  const toggleDropdown = (name: 'city' | 'type' | 'rooms') => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const selectedCityLabel = filters.city || t.home.cityPlaceholder;
  const selectedTypeLabel = filters.type
    ? t.propertyTypeSingular[filters.type]
    : (lang === 'fr' ? 'Tous les biens' : 'All properties');
  const selectedRoomsLabel =
    filters.bedroomsMin > 0
      ? `${filters.bedroomsMin}+`
      : (lang === 'fr' ? 'Toutes' : 'Any');

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'android' ? 12 : 0}
      >
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header : Filtres + bouton X circulaire */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {lang === 'fr' ? 'Filtres' : 'Filters'}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <X size={18} color={colors.navy} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* TRANSACTION */}
            <Text style={styles.upperLabel}>
              {lang === 'fr' ? 'TRANSACTION' : 'TRANSACTION'}
            </Text>
            <View style={styles.row2}>
              <TouchableOpacity
                style={[
                  styles.transBtn,
                  filters.transaction === 'vente' && styles.transBtnActive,
                ]}
                onPress={() => toggleTransaction('vente')}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.transBtnText,
                    filters.transaction === 'vente' && styles.transBtnTextActive,
                  ]}
                >
                  {t.home.buyTab}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.transBtn,
                  filters.transaction === 'location' && styles.transBtnActive,
                ]}
                onPress={() => toggleTransaction('location')}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.transBtnText,
                    filters.transaction === 'location' && styles.transBtnTextActive,
                  ]}
                >
                  {t.home.rentTab}
                </Text>
              </TouchableOpacity>
            </View>

            {/* VILLE + TYPE DE BIEN */}
            <View style={styles.row2}>
              <View style={styles.col}>
                <Text style={styles.upperLabel}>
                  {lang === 'fr' ? 'VILLE' : 'CITY'}
                </Text>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => toggleDropdown('city')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.selectText} numberOfLines={1}>
                    {selectedCityLabel}
                  </Text>
                  <ChevronDown size={16} color={colors.navy} />
                </TouchableOpacity>
              </View>

              <View style={styles.col}>
                <Text style={styles.upperLabel}>
                  {lang === 'fr' ? 'TYPE DE BIEN' : 'PROPERTY TYPE'}
                </Text>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => toggleDropdown('type')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.selectText} numberOfLines={1}>
                    {selectedTypeLabel}
                  </Text>
                  <ChevronDown size={16} color={colors.navy} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Dropdown inline Ville */}
            {openDropdown === 'city' && (
              <View style={styles.dropdownPanel}>
                <TouchableOpacity
                  style={[styles.dropdownChip, filters.city === '' && styles.dropdownChipActive]}
                  onPress={() => {
                    onChangeFilters({ city: '' });
                    setOpenDropdown(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownChipText,
                      filters.city === '' && styles.dropdownChipTextActive,
                    ]}
                  >
                    {t.home.cityPlaceholder}
                  </Text>
                </TouchableOpacity>
                {CITY_OPTIONS.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.dropdownChip, filters.city === c && styles.dropdownChipActive]}
                    onPress={() => {
                      onChangeFilters({ city: c });
                      setOpenDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownChipText,
                        filters.city === c && styles.dropdownChipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Dropdown inline Type */}
            {openDropdown === 'type' && (
              <View style={styles.dropdownPanel}>
                <TouchableOpacity
                  style={[styles.dropdownChip, filters.type === '' && styles.dropdownChipActive]}
                  onPress={() => {
                    onChangeFilters({ type: '' });
                    setOpenDropdown(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownChipText,
                      filters.type === '' && styles.dropdownChipTextActive,
                    ]}
                  >
                    {lang === 'fr' ? 'Tous les biens' : 'All properties'}
                  </Text>
                </TouchableOpacity>
                {PROPERTY_TYPES.map(pt => (
                  <TouchableOpacity
                    key={pt}
                    style={[styles.dropdownChip, filters.type === pt && styles.dropdownChipActive]}
                    onPress={() => {
                      onChangeFilters({ type: pt });
                      setOpenDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownChipText,
                        filters.type === pt && styles.dropdownChipTextActive,
                      ]}
                    >
                      {t.propertyTypeSingular[pt]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* PRIX MIN + PRIX MAX */}
            <View style={styles.row2}>
              <View style={styles.col}>
                <Text style={styles.upperLabel}>
                  {lang === 'fr' ? 'PRIX MIN' : 'MIN PRICE'}
                </Text>
                <TextInput
                  style={styles.inputBox}
                  value={filters.priceMin > 0 ? String(filters.priceMin) : ''}
                  onChangeText={val =>
                    onChangeFilters({ priceMin: Number(val.replace(/\D/g, '')) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.upperLabel}>
                  {lang === 'fr' ? 'PRIX MAX' : 'MAX PRICE'}
                </Text>
                <TextInput
                  style={styles.inputBox}
                  value={filters.priceMax > 0 ? String(filters.priceMax) : ''}
                  onChangeText={val =>
                    onChangeFilters({ priceMax: Number(val.replace(/\D/g, '')) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* SURFACE MIN (M²) + CHAMBRES MIN */}
            <View style={styles.row2}>
              <View style={styles.col}>
                <Text style={styles.upperLabel}>
                  {lang === 'fr' ? 'SURFACE MIN (M²)' : 'MIN AREA (M²)'}
                </Text>
                <TextInput
                  style={styles.inputBox}
                  value={filters.surfaceMin > 0 ? String(filters.surfaceMin) : ''}
                  onChangeText={val =>
                    onChangeFilters({ surfaceMin: Number(val.replace(/\D/g, '')) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.upperLabel}>
                  {lang === 'fr' ? 'CHAMBRES MIN' : 'MIN BEDROOMS'}
                </Text>
                <TouchableOpacity
                  style={styles.selectBox}
                  onPress={() => toggleDropdown('rooms')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.selectText}>{selectedRoomsLabel}</Text>
                  <ChevronDown size={16} color={colors.navy} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Dropdown inline Chambres */}
            {openDropdown === 'rooms' && (
              <View style={styles.dropdownPanel}>
                {ROOM_OPTIONS.map(count => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.dropdownChip,
                      filters.bedroomsMin === count && styles.dropdownChipActive,
                    ]}
                    onPress={() => {
                      onChangeFilters({ bedroomsMin: count });
                      setOpenDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownChipText,
                        filters.bedroomsMin === count && styles.dropdownChipTextActive,
                      ]}
                    >
                      {count === 0 ? (lang === 'fr' ? 'Toutes' : 'Any') : `${count}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* ÉQUIPEMENTS */}
            <Text style={styles.upperLabel}>
              {lang === 'fr' ? 'ÉQUIPEMENTS' : 'AMENITIES'}
            </Text>
            <View style={styles.pillWrap}>
              {EQUIPMENT_OPTIONS.map(item => {
                const active = filters.features.includes(item.value);
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => toggleArrayItem('features', item.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>
                      {lang === 'fr' ? item.fr : item.en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* DOCUMENTS */}
            <Text style={styles.upperLabel}>
              {lang === 'fr' ? 'DOCUMENTS' : 'DOCUMENTS'}
            </Text>
            <View style={styles.pillWrap}>
              {DOCUMENT_OPTIONS.map(doc => {
                const active = filters.documents.includes(doc.value);
                return (
                  <TouchableOpacity
                    key={doc.value}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => toggleArrayItem('documents', doc.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>
                      {lang === 'fr' ? doc.fr : doc.en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Footer 2 boutons : Réinitialiser | Voir X biens > */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.8}>
              <Text style={styles.resetBtnText}>{t.search.resetFilters}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>
                {lang === 'fr'
                  ? `Voir ${resultCount} bien${resultCount > 1 ? 's' : ''}`
                  : `View ${resultCount} propert${resultCount > 1 ? 'ies' : 'y'}`}
              </Text>
              <ChevronRight size={16} color={colors.navy} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 31, 73, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.navy,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
  },
  upperLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textMuted,
    marginTop: 14,
    marginBottom: 8,
  },
  row2: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  transBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transBtnActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  transBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  transBtnTextActive: {
    color: colors.textOnNavy,
  },
  selectBox: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.navy,
    flex: 1,
    marginRight: 6,
  },
  inputBox: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.navy,
  },
  dropdownPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  dropdownChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dropdownChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  dropdownChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  dropdownChipTextActive: {
    color: colors.gold,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.textOnNavy,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  applyBtn: {
    flex: 1.35,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
});
