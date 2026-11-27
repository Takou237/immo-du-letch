/**
 * SellScreen — Estimation gratuite, dépôt d'annonce en 4 étapes & annonces locales.
 * Thème officiel IMMO DU LETCH, icônes Lucide, bilingue FR/EN.
 */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  PlusCircle,
  Calculator,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Clock,
  Info,
  Building2,
} from 'lucide-react-native';

import { AppHeader } from '../components/AppHeader';
import { PropertyTypeIcon } from '../components/PropertyTypeIcon';
import { useListings } from '../hooks/useListings';
import { useLang } from '../i18n/LangContext';
import { CITY_OPTIONS } from '../data/listings';
import { Condition, PropertyType, Transaction } from '../types/listing';
import { formatFullFCFA, formatSurface } from '../utils/formatPrice';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const PROPERTY_TYPES: PropertyType[] = ['villa', 'appartement', 'terrain', 'studio', 'bureau'];
const CONDITIONS: Condition[] = ['neuf', 'ancien', 'a_renover'];

const FEATURE_OPTIONS = [
  { fr: 'Titre foncier (déclaré)', en: 'Title deed (declared)' },
  { fr: 'Piscine', en: 'Swimming pool' },
  { fr: 'Jardin', en: 'Garden' },
  { fr: 'Parking', en: 'Parking' },
  { fr: 'Gardien 24h/24', en: '24/7 Guard' },
  { fr: 'Climatisation', en: 'Air conditioning' },
  { fr: 'Meublé', en: 'Furnished' },
  { fr: 'Groupe électrogène', en: 'Generator' },
];

/** Prix indicatif moyen au m² (FCFA) pour l'estimateur local */
const BASE_PPM_BY_CITY: Record<string, number> = {
  Douala: 650_000,
  Yaoundé: 580_000,
  Kribi: 520_000,
};

const TYPE_MULTIPLIER: Record<PropertyType, number> = {
  villa: 1.15,
  appartement: 0.95,
  terrain: 0.12,
  studio: 0.85,
  bureau: 1.05,
};

export function SellScreen() {
  const navigation = useNavigation<NavProp>();
  const { lang, t } = useLang();
  const { localListings, addLocalListing, deleteLocalListing } = useListings();

  const [activeTab, setActiveTab] = useState<'create' | 'estimate' | 'mine'>('create');

  // ── Formulaire en 4 étapes ──
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [transaction, setTransaction] = useState<Transaction>('vente');
  const [type, setType] = useState<PropertyType>('villa');
  const [city, setCity] = useState<string>('Douala');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [priceStr, setPriceStr] = useState<string>('');
  const [surfaceStr, setSurfaceStr] = useState<string>('');
  const [bedroomsStr, setBedroomsStr] = useState<string>('3');
  const [bathroomsStr, setBathroomsStr] = useState<string>('2');
  const [condition, setCondition] = useState<Condition>('neuf');
  const [description, setDescription] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerPhone, setSellerPhone] = useState<string>('+237 ');

  // ── Estimateur ──
  const [estCity, setEstCity] = useState<string>('Douala');
  const [estType, setEstType] = useState<PropertyType>('villa');
  const [estSurfaceStr, setEstSurfaceStr] = useState<string>('200');

  const estimate = useMemo(() => {
    const s = Math.max(0, Number(estSurfaceStr) || 0);
    const base = (BASE_PPM_BY_CITY[estCity] ?? 550_000) * (TYPE_MULTIPLIER[estType] ?? 1);
    const mid = Math.round(base * s);
    return {
      min: Math.round(mid * 0.85),
      max: Math.round(mid * 1.15),
      ppm: Math.round(base),
    };
  }, [estCity, estType, estSurfaceStr]);

  const toggleFeature = (label: string) => {
    setSelectedFeatures(prev =>
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label],
    );
  };

  const resetForm = () => {
    setStep(1);
    setTransaction('vente');
    setType('villa');
    setCity('Douala');
    setNeighborhood('');
    setTitle('');
    setPriceStr('');
    setSurfaceStr('');
    setBedroomsStr('3');
    setBathroomsStr('2');
    setCondition('neuf');
    setDescription('');
    setSelectedFeatures([]);
    setSellerName('');
    setSellerPhone('+237 ');
  };

  const handleNext = () => {
    if (step === 1 && !neighborhood.trim()) {
      Alert.alert(
        lang === 'fr' ? 'Champ requis' : 'Required field',
        lang === 'fr' ? 'Veuillez saisir le quartier.' : 'Please enter the neighborhood.',
      );
      return;
    }
    if (step === 2) {
      if (!title.trim() || !(Number(priceStr) > 0) || !(Number(surfaceStr) > 0)) {
        Alert.alert(
          lang === 'fr' ? 'Champs requis' : 'Required fields',
          lang === 'fr'
            ? 'Veuillez renseigner un titre, un prix et une surface valides.'
            : 'Please enter a valid title, price, and area.',
        );
        return;
      }
    }
    if (step < 4) setStep((step + 1) as 1 | 2 | 3 | 4);
  };

  const handlePublish = () => {
    if (!sellerName.trim() || sellerPhone.trim().length < 8) {
      Alert.alert(
        lang === 'fr' ? 'Coordonnées requises' : 'Contact required',
        lang === 'fr'
          ? 'Veuillez indiquer votre nom et votre numéro (+237).'
          : 'Please provide your name and phone number (+237).',
      );
      return;
    }

    addLocalListing({
      title: title.trim(),
      transaction,
      type,
      condition,
      price: Number(priceStr),
      surface: Number(surfaceStr),
      bedrooms: type === 'terrain' || type === 'bureau' ? undefined : Number(bedroomsStr) || 1,
      bathrooms: type === 'terrain' ? undefined : Number(bathroomsStr) || 1,
      city,
      neighborhood: neighborhood.trim(),
      description:
        description.trim() ||
        `${t.propertyTypeSingular[type]} — ${neighborhood.trim()}, ${city}`,
      features: selectedFeatures,
      sellerName: sellerName.trim(),
      sellerPhone: sellerPhone.trim(),
    });

    resetForm();
    setActiveTab('mine');
    Alert.alert(
      lang === 'fr' ? 'Annonce enregistrée localement' : 'Listing saved locally',
      lang === 'fr'
        ? 'Votre annonce a été ajoutée sur cet appareil avec le statut "En attente".'
        : 'Your listing has been saved on this device with "Pending" status.',
    );
  };

  const stepLabels = [t.sell.step1, t.sell.step2, t.sell.step3, t.sell.step4];

  return (
    <View style={styles.root}>
      <AppHeader />

      {/* Onglets principaux */}
      <View style={styles.topSection}>
        <Text style={styles.pageTitle}>{t.sell.title}</Text>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'create' && styles.tabBtnActive]}
            onPress={() => setActiveTab('create')}
          >
            <PlusCircle size={14} color={activeTab === 'create' ? colors.gold : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>
              {t.nav.sell}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'estimate' && styles.tabBtnActive]}
            onPress={() => setActiveTab('estimate')}
          >
            <Calculator size={14} color={activeTab === 'estimate' ? colors.gold : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'estimate' && styles.tabTextActive]}>
              {lang === 'fr' ? 'Estimer' : 'Estimate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'mine' && styles.tabBtnActive]}
            onPress={() => setActiveTab('mine')}
          >
            <FileText size={14} color={activeTab === 'mine' ? colors.gold : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'mine' && styles.tabTextActive]}>
              {t.sell.myListings} ({localListings.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── ONGLET 1 : DÉPÔT 4 ÉTAPES ── */}
        {activeTab === 'create' && (
          <View>
            {/* Barre de progression */}
            <View style={styles.stepperCard}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(step / 4) * 100}%` }]} />
              </View>
              <Text style={styles.stepTitle}>
                {lang === 'fr' ? `Étape ${step}/4` : `Step ${step}/4`} — {stepLabels[step - 1]}
              </Text>
            </View>

            {/* Étape 1 : Localisation & Type */}
            {step === 1 && (
              <View style={styles.formCard}>
                <Text style={styles.label}>{lang === 'fr' ? 'Transaction' : 'Transaction'}</Text>
                <View style={styles.chipsWrap}>
                  {(['vente', 'location'] as Transaction[]).map(tr => (
                    <TouchableOpacity
                      key={tr}
                      style={[styles.chip, transaction === tr && styles.chipActive]}
                      onPress={() => setTransaction(tr)}
                    >
                      <Text style={[styles.chipText, transaction === tr && styles.chipTextActive]}>
                        {tr === 'vente' ? t.home.buyTab : t.home.rentTab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>{t.home.typeLabel}</Text>
                <View style={styles.chipsWrap}>
                  {PROPERTY_TYPES.map(pt => (
                    <TouchableOpacity
                      key={pt}
                      style={[styles.chip, type === pt && styles.chipActive]}
                      onPress={() => setType(pt)}
                    >
                      <PropertyTypeIcon
                        type={pt}
                        size={14}
                        color={type === pt ? colors.gold : colors.textSecondary}
                      />
                      <Text style={[styles.chipText, type === pt && styles.chipTextActive]}>
                        {t.propertyTypeSingular[pt]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>{t.home.cityLabel}</Text>
                <View style={styles.chipsWrap}>
                  {CITY_OPTIONS.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.chip, city === c && styles.chipActive]}
                      onPress={() => setCity(c)}
                    >
                      <Text style={[styles.chipText, city === c && styles.chipTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>{t.home.neighborhoodLabel} *</Text>
                <TextInput
                  style={styles.input}
                  value={neighborhood}
                  onChangeText={setNeighborhood}
                  placeholder={t.home.neighborhoodPlaceholder}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}

            {/* Étape 2 : Caractéristiques */}
            {step === 2 && (
              <View style={styles.formCard}>
                <Text style={styles.label}>{lang === 'fr' ? "Titre de l'annonce *" : 'Listing title *'}</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder={lang === 'fr' ? 'Ex: Villa moderne F4 — Bonapriso' : 'E.g. Modern F4 Villa — Bonapriso'}
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.row2}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{lang === 'fr' ? 'Prix (FCFA) *' : 'Price (XAF) *'}</Text>
                    <TextInput
                      style={styles.input}
                      value={priceStr}
                      onChangeText={setPriceStr}
                      keyboardType="numeric"
                      placeholder="45000000"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{lang === 'fr' ? 'Surface (m²) *' : 'Area (m²) *'}</Text>
                    <TextInput
                      style={styles.input}
                      value={surfaceStr}
                      onChangeText={setSurfaceStr}
                      keyboardType="numeric"
                      placeholder="180"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                {type !== 'terrain' && type !== 'bureau' && (
                  <View style={styles.row2}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>{t.home.roomsLabel}</Text>
                      <TextInput
                        style={styles.input}
                        value={bedroomsStr}
                        onChangeText={setBedroomsStr}
                        keyboardType="numeric"
                        placeholder="3"
                        placeholderTextColor={colors.textMuted}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>{lang === 'fr' ? 'Salles de bain' : 'Bathrooms'}</Text>
                      <TextInput
                        style={styles.input}
                        value={bathroomsStr}
                        onChangeText={setBathroomsStr}
                        keyboardType="numeric"
                        placeholder="2"
                        placeholderTextColor={colors.textMuted}
                      />
                    </View>
                  </View>
                )}

                <Text style={styles.label}>{lang === 'fr' ? 'État du bien' : 'Condition'}</Text>
                <View style={styles.chipsWrap}>
                  {CONDITIONS.map(cond => (
                    <TouchableOpacity
                      key={cond}
                      style={[styles.chip, condition === cond && styles.chipActive]}
                      onPress={() => setCondition(cond)}
                    >
                      <Text style={[styles.chipText, condition === cond && styles.chipTextActive]}>
                        {t.conditions[cond]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  placeholder={lang === 'fr' ? 'Décrivez votre bien...' : 'Describe your property...'}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}

            {/* Étape 3 : Équipements & Documents déclarés */}
            {step === 3 && (
              <View style={styles.formCard}>
                <Text style={styles.label}>{t.detail.features} & {t.detail.documents}</Text>
                <View style={styles.chipsWrap}>
                  {FEATURE_OPTIONS.map(opt => {
                    const label = lang === 'fr' ? opt.fr : opt.en;
                    const active = selectedFeatures.includes(label);
                    return (
                      <TouchableOpacity
                        key={opt.fr}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => toggleFeature(label)}
                      >
                        {active && <Check size={13} color={colors.gold} />}
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.infoNote}>
                  <Info size={15} color={colors.textSecondary} />
                  <Text style={styles.infoNoteText}>
                    {lang === 'fr'
                      ? 'Les documents sélectionnés restent déclaratifs et seront stockés localement sans vérification serveur.'
                      : 'Selected documents remain declarative and are stored locally without server verification.'}
                  </Text>
                </View>
              </View>
            )}

            {/* Étape 4 : Récapitulatif & Contact */}
            {step === 4 && (
              <View style={styles.formCard}>
                <View style={styles.recapBox}>
                  <Text style={styles.recapTitle}>{title}</Text>
                  <Text style={styles.recapPrice}>{formatFullFCFA(Number(priceStr) || 0)}</Text>
                  <Text style={styles.recapMeta}>
                    {t.propertyTypeSingular[type]} • {neighborhood}, {city} • {formatSurface(Number(surfaceStr) || 0)}
                  </Text>
                </View>

                <Text style={styles.label}>{lang === 'fr' ? 'Votre nom / agence *' : 'Your name / agency *'}</Text>
                <TextInput
                  style={styles.input}
                  value={sellerName}
                  onChangeText={setSellerName}
                  placeholder={lang === 'fr' ? 'Ex: Jean Dupont' : 'E.g. John Doe'}
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.label}>{lang === 'fr' ? 'Téléphone / WhatsApp *' : 'Phone / WhatsApp *'}</Text>
                <TextInput
                  style={styles.input}
                  value={sellerPhone}
                  onChangeText={setSellerPhone}
                  keyboardType="phone-pad"
                  placeholder="+237 6XX XXX XXX"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}

            {/* Boutons navigation formulaire */}
            <View style={styles.navActions}>
              {step > 1 && (
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                >
                  <ChevronLeft size={16} color={colors.navy} />
                  <Text style={styles.backBtnText}>{t.sell.back}</Text>
                </TouchableOpacity>
              )}

              {step < 4 ? (
                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>{t.sell.next}</Text>
                  <ChevronRight size={16} color={colors.navy} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.nextBtn} onPress={handlePublish}>
                  <Check size={16} color={colors.navy} />
                  <Text style={styles.nextBtnText}>{t.sell.submit}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ── ONGLET 2 : ESTIMATEUR ── */}
        {activeTab === 'estimate' && (
          <View style={styles.formCard}>
            <Text style={styles.estTitle}>{t.sell.estimateTitle}</Text>
            <Text style={styles.estSub}>{t.sell.estimateSub}</Text>

            <Text style={styles.label}>{t.home.cityLabel}</Text>
            <View style={styles.chipsWrap}>
              {CITY_OPTIONS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, estCity === c && styles.chipActive]}
                  onPress={() => setEstCity(c)}
                >
                  <Text style={[styles.chipText, estCity === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>{t.home.typeLabel}</Text>
            <View style={styles.chipsWrap}>
              {PROPERTY_TYPES.map(pt => (
                <TouchableOpacity
                  key={pt}
                  style={[styles.chip, estType === pt && styles.chipActive]}
                  onPress={() => setEstType(pt)}
                >
                  <Text style={[styles.chipText, estType === pt && styles.chipTextActive]}>
                    {t.propertyTypeSingular[pt]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>{lang === 'fr' ? 'Surface (m²)' : 'Area (m²)'}</Text>
            <TextInput
              style={styles.input}
              value={estSurfaceStr}
              onChangeText={setEstSurfaceStr}
              keyboardType="numeric"
              placeholder="200"
              placeholderTextColor={colors.textMuted}
            />

            <View style={styles.estResultBox}>
              <Text style={styles.estResultLabel}>
                {lang === 'fr' ? 'Fourchette indicative estimée' : 'Estimated indicative range'}
              </Text>
              <Text style={styles.estResultRange}>
                {formatFullFCFA(estimate.min)} – {formatFullFCFA(estimate.max)}
              </Text>
              <Text style={styles.estResultPpm}>
                {lang === 'fr' ? 'Moyenne secteur :' : 'Area average:'} {formatFullFCFA(estimate.ppm)} / m²
              </Text>
            </View>
          </View>
        )}

        {/* ── ONGLET 3 : MES ANNONCES LOCALES ── */}
        {activeTab === 'mine' && (
          <View>
            {localListings.length === 0 ? (
              <View style={styles.emptyBox}>
                <View style={styles.emptyIconWrap}>
                  <Building2 size={32} color={colors.navy} />
                </View>
                <Text style={styles.emptyTitle}>
                  {lang === 'fr' ? 'Aucune annonce déposée' : 'No listings posted yet'}
                </Text>
                <TouchableOpacity style={styles.nextBtn} onPress={() => setActiveTab('create')}>
                  <Text style={styles.nextBtnText}>{t.sell.title}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              localListings.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.mineCard}
                  onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
                  activeOpacity={0.85}
                >
                  <View style={styles.mineTop}>
                    <View style={styles.pendingBadge}>
                      <Clock size={12} color={colors.warning} />
                      <Text style={styles.pendingText}>{t.sell.statusPending} (local)</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteLocalListing(item.id)} hitSlop={8}>
                      <Trash2 size={16} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.mineTitle}>{item.title}</Text>
                  <Text style={styles.minePrice}>{formatFullFCFA(item.price)}</Text>
                  <Text style={styles.mineMeta}>
                    {item.neighborhood}, {item.city} • {formatSurface(item.surface)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  tabBtnActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.gold,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  stepperCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row2: {
    flexDirection: 'row',
    gap: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.gold,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  recapBox: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  recapTitle: {
    color: colors.textOnNavy,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  recapPrice: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  recapMeta: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  navActions: {
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  estTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  estSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  estResultBox: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    padding: 16,
    marginTop: 18,
    alignItems: 'center',
  },
  estResultLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    marginBottom: 6,
  },
  estResultRange: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  estResultPpm: {
    color: colors.textOnNavy,
    fontSize: 12,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mineCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  mineTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warningSoft,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
  mineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  minePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 4,
  },
  mineMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
