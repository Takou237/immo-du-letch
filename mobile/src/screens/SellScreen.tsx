/**
 * SellScreen — IMMO DU LETCH Mobile
 * Formulaire "Déposer une annonce" aligné sur le design web.
 * 1 page, sans étapes multiples, bouton "Soumettre pour validation".
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Upload,
  Check,
  ChevronDown,
  Plus,
  Minus,
  HelpCircle,
  Home,
  SlidersHorizontal,
} from 'lucide-react-native';

import { PageGuideModal, GuideStep } from '../components/PageGuideModal';
import { useListings } from '../hooks/useListings';
import { usePageGuide } from '../hooks/usePageGuide';
import { useLang } from '../i18n/LangContext';
import { useAuthContext } from '../providers/AuthProvider';
import { CITY_OPTIONS } from '../data/listings';
import { PropertyType, Transaction } from '../types/listing';
import { colors, spacing } from '../theme';

// ─── Constantes ────────────────────────────────────────────────────────────────

const TRANSACTION_OPTIONS: { key: Transaction; fr: string; en: string }[] = [
  { key: 'vente', fr: 'Vente', en: 'Sale' },
  { key: 'location', fr: 'Location', en: 'Rent' },
];

const TYPE_OPTIONS: { key: PropertyType; fr: string; en: string }[] = [
  { key: 'villa', fr: 'Maison / villa', en: 'House / villa' },
  { key: 'appartement', fr: 'Appartement', en: 'Apartment' },
  { key: 'studio', fr: 'Studio', en: 'Studio' },
  { key: 'terrain', fr: 'Terrain', en: 'Land' },
  { key: 'bureau', fr: 'Bureau / commerce', en: 'Office / shop' },
];

const EQUIPMENT_OPTIONS = [
  { key: 'jardin', fr: 'Jardin', en: 'Garden' },
  { key: 'parking', fr: 'Parking', en: 'Parking' },
  { key: 'terrasse', fr: 'Terrasse', en: 'Terrace' },
  { key: 'piscine', fr: 'Piscine', en: 'Pool' },
  { key: 'clim', fr: 'Climatisation', en: 'Air conditioning' },
  { key: 'groupe', fr: 'Groupe électrogène', en: 'Generator' },
  { key: 'meuble', fr: 'Meublé', en: 'Furnished' },
];

const MAX_PHOTOS = 6;

// ─── Sous-composants ────────────────────────────────────────────────────────────

/** Bouton segment Transaction */
function TransactionBtn({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.transBtn, active && styles.transBtnActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.transBtnText, active && styles.transBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/** Dropdown simple (modal inline) */
function DropdownSelect<T extends string>({
  value,
  options,
  onSelect,
  placeholder,
}: {
  value: T;
  options: { key: T; label: string }[];
  onSelect: (key: T) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.key === value);

  return (
    <View>
      <TouchableOpacity
        style={styles.select}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectText}>
          {current?.label ?? placeholder ?? '—'}
        </Text>
        <ChevronDown
          color={colors.textMuted}
          size={16}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.dropdownItem, opt.key === value && styles.dropdownItemActive]}
              onPress={() => { onSelect(opt.key); setOpen(false); }}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  opt.key === value && styles.dropdownItemTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {opt.key === value && (
                <Check color={colors.gold} size={14} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

/** Stepper numérique */
function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.max(min, value - 1))}
        activeOpacity={0.75}
      >
        <Minus color={colors.navy} size={14} strokeWidth={2.5} />
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.min(max, value + 1))}
        activeOpacity={0.75}
      >
        <Plus color={colors.navy} size={14} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Écran principal ────────────────────────────────────────────────────────────

export function SellScreen() {
  const { lang } = useLang();
  const { addLocalListing } = useListings();
  const { user } = useAuthContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFr = lang === 'fr';

  // Guard : non connecté → page de connexion
  useEffect(() => {
    if (!user) {
      navigation.navigate('Profile');
    }
  }, [user, navigation]);

  if (!user) {
    return null;
  }

  // Champs du formulaire
  const [transaction, setTransaction] = useState<Transaction>('vente');
  const [type, setType] = useState<PropertyType>('villa');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Douala');
  const [neighborhood, setNeighborhood] = useState('');
  const [price, setPrice] = useState('');
  const [surface, setSurface] = useState('');
  const [pieces, setPieces] = useState(4);
  const [equipments, setEquipments] = useState<string[]>([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { visible: guideVisible, openGuide, closeGuide } = usePageGuide('sell');

  const guideSteps: GuideStep[] = useMemo(() => [
    {
      title: isFr ? 'Transaction & Type de bien' : 'Transaction & Type',
      description: isFr
        ? 'Choisissez si vous vendez ou louez, puis sélectionnez le type de bien (maison, appartement, studio, terrain ou bureau).'
        : 'Choose Sale or Rent, then select the property type.',
      icon: <Home size={26} color={colors.navy} />,
    },
    {
      title: isFr ? 'Localisation, Prix & Équipements' : 'Location, Price & Amenities',
      description: isFr
        ? 'Indiquez la ville, le quartier, le prix en FCFA, la surface en m², le nombre de pièces et cochez les équipements disponibles.'
        : 'Enter city, district, price in FCFA, surface, rooms, and select available amenities.',
      icon: <SlidersHorizontal size={26} color={colors.navy} />,
    },
    {
      title: isFr ? 'Photos & Soumission' : 'Photos & Submission',
      description: isFr
        ? 'Ajoutez des photos et une description, puis touchez "Soumettre pour validation" pour enregistrer votre annonce.'
        : 'Add photos and description, then tap "Submit for review" to save your listing.',
      icon: <Upload size={26} color={colors.navy} />,
    },
  ], [isFr]);

  const toggleEquipment = (key: string) => {
    setEquipments(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  const handleSubmit = () => {
    if (!neighborhood.trim()) {
      Alert.alert(
        isFr ? 'Champ requis' : 'Required field',
        isFr ? 'Veuillez saisir le quartier.' : 'Please enter the neighborhood.',
      );
      return;
    }
    if (!price.trim() || Number(price) <= 0) {
      Alert.alert(
        isFr ? 'Champ requis' : 'Required field',
        isFr ? 'Veuillez saisir un prix valide.' : 'Please enter a valid price.',
      );
      return;
    }

    addLocalListing({
      title: title.trim() ||
        `${TYPE_OPTIONS.find(t => t.key === type)?.[isFr ? 'fr' : 'en'] ?? ''} — ${city}`,
      transaction,
      type,
      condition: 'neuf',
      price: Number(price),
      surface: Number(surface) || 0,
      bedrooms: pieces,
      city,
      neighborhood: neighborhood.trim(),
      description: description.trim(),
      features: equipments.map(k =>
        EQUIPMENT_OPTIONS.find(e => e.key === k)?.[isFr ? 'fr' : 'en'] ?? k,
      ),
      sellerName: 'Moi',
      sellerPhone: '+237 ',
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setTransaction('vente');
    setType('villa');
    setTitle('');
    setCity('Douala');
    setNeighborhood('');
    setPrice('');
    setSurface('');
    setPieces(4);
    setEquipments([]);
    setPhotoCount(0);
    setDescription('');
    setSubmitted(false);
  };

  // ── Succès ──
  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Check color="#fff" size={36} strokeWidth={3} />
          </View>
          <Text style={styles.successTitle}>
            {isFr ? 'Annonce soumise !' : 'Listing submitted!'}
          </Text>
          <Text style={styles.successSub}>
            {isFr
              ? 'Votre annonce a été envoyée pour validation. Elle sera publiée sous 24–48h.'
              : 'Your listing has been sent for validation and will be published within 24–48h.'}
          </Text>
          <TouchableOpacity style={styles.newBtn} onPress={handleReset} activeOpacity={0.8}>
            <Text style={styles.newBtnText}>
              {isFr ? '+ Déposer une autre annonce' : '+ Submit another listing'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const cityOptions = CITY_OPTIONS.map(c => ({ key: c, label: c }));
  const typeOptions = TYPE_OPTIONS.map(o => ({ key: o.key, label: isFr ? o.fr : o.en }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.scroll}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
        {/* ── Titre page ── */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            {isFr ? 'Déposer une annonce' : 'Post a listing'}
          </Text>
          <TouchableOpacity style={styles.helpBtn} onPress={openGuide} hitSlop={8}>
            <HelpCircle size={18} color={colors.navy} />
          </TouchableOpacity>
        </View>
        <Text style={styles.pageSub}>
          {isFr
            ? 'Votre annonce sera soumise à validation avant publication.'
            : 'Your listing will be reviewed before being published.'}
        </Text>

        {/* ── TRANSACTION ── */}
        <View style={styles.row2}>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>
              {isFr ? 'TRANSACTION' : 'TRANSACTION'}
            </Text>
            <View style={styles.segmentGroup}>
              {TRANSACTION_OPTIONS.map(opt => (
                <TransactionBtn
                  key={opt.key}
                  label={isFr ? opt.fr : opt.en}
                  active={transaction === opt.key}
                  onPress={() => setTransaction(opt.key)}
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>
              {isFr ? 'TYPE DE BIEN' : 'PROPERTY TYPE'}
            </Text>
            <DropdownSelect
              value={type}
              options={typeOptions}
              onSelect={v => setType(v)}
            />
          </View>
        </View>

        {/* ── TITRE (facultatif) ── */}
        <Text style={styles.fieldLabel}>
          {isFr ? 'TITRE (FACULTATIF)' : 'TITLE (OPTIONAL)'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={isFr ? 'Ex. Villa 4 chambres avec jardin' : 'Ex. 4-bedroom villa with garden'}
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />

        {/* ── VILLE + QUARTIER ── */}
        <View style={styles.row2}>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>{isFr ? 'VILLE' : 'CITY'}</Text>
            <DropdownSelect
              value={city}
              options={cityOptions}
              onSelect={v => setCity(v)}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>{isFr ? 'QUARTIER' : 'DISTRICT'}</Text>
            <TextInput
              style={styles.input}
              placeholder={isFr ? 'Ex. Bonapriso' : 'Ex. Bonapriso'}
              placeholderTextColor={colors.textMuted}
              value={neighborhood}
              onChangeText={setNeighborhood}
            />
          </View>
        </View>

        {/* ── PRIX + SURFACE + PIÈCES ── */}
        <View style={styles.row3}>
          <View style={styles.fieldThird}>
            <Text style={styles.fieldLabel}>{isFr ? 'PRIX' : 'PRICE'}</Text>
            <View style={styles.inputWithUnit}>
              <Text style={styles.unit}>FCFA</Text>
              <TextInput
                style={styles.inputUnit}
                placeholder="—"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          <View style={styles.fieldThird}>
            <Text style={styles.fieldLabel}>{isFr ? 'SURFACE' : 'SURFACE'}</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.inputUnit}
                placeholder="—"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={surface}
                onChangeText={setSurface}
              />
              <Text style={styles.unit}>m²</Text>
            </View>
          </View>

          <View style={styles.fieldThird}>
            <Text style={styles.fieldLabel}>{isFr ? 'PIÈCES' : 'ROOMS'}</Text>
            <Stepper value={pieces} min={1} max={20} onChange={setPieces} />
          </View>
        </View>

        {/* ── ÉQUIPEMENTS ── */}
        <Text style={styles.fieldLabel}>{isFr ? 'ÉQUIPEMENTS' : 'AMENITIES'}</Text>
        <View style={styles.pillsRow}>
          {EQUIPMENT_OPTIONS.map(opt => {
            const active = equipments.includes(opt.key);
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => toggleEquipment(opt.key)}
                activeOpacity={0.75}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {isFr ? opt.fr : opt.en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── PHOTOS ── */}
        <View style={styles.photosHeader}>
          <Text style={styles.photosTitle}>
            {isFr ? 'Photos du bien' : 'Property photos'}
          </Text>
          <Text style={styles.photosCount}>{photoCount} / {MAX_PHOTOS}</Text>
        </View>
        <TouchableOpacity
          style={styles.photoUpload}
          activeOpacity={0.8}
          onPress={() => {
            if (photoCount < MAX_PHOTOS) setPhotoCount(c => c + 1);
          }}
        >
          <Upload color={colors.textMuted} size={22} strokeWidth={1.8} />
          <Text style={styles.photoUploadTitle}>
            {isFr ? '+ Importer des images' : '+ Import images'}
          </Text>
          <Text style={styles.photoUploadSub}>
            {isFr
              ? `JPG, PNG ou WebP · jusqu'à ${MAX_PHOTOS} photos`
              : `JPG, PNG or WebP · up to ${MAX_PHOTOS} photos`}
          </Text>
        </TouchableOpacity>

        {/* ── DESCRIPTION ── */}
        <Text style={styles.fieldLabel}>
          {isFr ? 'DESCRIPTION (FACULTATIF)' : 'DESCRIPTION (OPTIONAL)'}
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={
            isFr
              ? 'Décrivez les atouts du bien, les documents disponibles…'
              : 'Describe the property highlights and available documents…'
          }
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* ── BOUTON SUBMIT ── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>
            {isFr ? 'Soumettre pour validation' : 'Submit for review'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>

      <PageGuideModal
        visible={guideVisible}
        pageTitle={isFr ? 'Déposer' : 'List'}
        steps={guideSteps}
        onClose={closeGuide}
      />
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 20,
  },

  // ── Page title ───────────────────────────────────────────
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 20,
    lineHeight: 18,
  },

  // ── Layouts ──────────────────────────────────────────────
  row2: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  row3: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  fieldHalf: { flex: 1 },
  fieldThird: { flex: 1 },

  // ── Label ────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  // ── Segment Transaction ──────────────────────────────────
  segmentGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  transBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  transBtnActive: { backgroundColor: colors.navy },
  transBtnText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  transBtnTextActive: { color: '#fff', fontWeight: '700' },

  // ── Select ───────────────────────────────────────────────
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  selectText: { fontSize: 13, color: colors.navy, flex: 1 },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: 2,
    zIndex: 100,
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  dropdownItemActive: { backgroundColor: '#F0F4FF' },
  dropdownItemText: { fontSize: 13, color: colors.navy },
  dropdownItemTextActive: { color: colors.navy, fontWeight: '700' },

  // ── Input simple ─────────────────────────────────────────
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.navy,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // ── Input avec unité ─────────────────────────────────────
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    gap: 4,
  },
  unit: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  inputUnit: {
    flex: 1,
    fontSize: 13,
    color: colors.navy,
    paddingVertical: 9,
    textAlign: 'center',
  },

  // ── Stepper ──────────────────────────────────────────────
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },

  // ── Pills équipements ────────────────────────────────────
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  pillText: {
    fontSize: 13,
    color: colors.navy,
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // ── Photos ───────────────────────────────────────────────
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  photosTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  photosCount: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  photoUpload: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  photoUploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  photoUploadSub: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // ── Bouton submit ────────────────────────────────────────
  submitBtn: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },

  bottomPad: { height: 20 },

  // ── Succès ───────────────────────────────────────────────
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 10,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  newBtn: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  newBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  helpBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
