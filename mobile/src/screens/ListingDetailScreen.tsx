/**
 * ListingDetailScreen — Fiche détaillée d'une annonce IMMO DU LETCH Mobile.
 * Aligné sur le design web (galerie, carte prix, grille 2x2, tableau caractéristiques,
 * grille "Les petits plus au quotidien", encadré bons réflexes, encadré localisation,
 * barre bas "Appeler" + "Envoyer un message" avec popup modal sans barre d'appel).
 * Boutons Favori / Comparer / Partager conservés en haut à droite.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Share,
  Alert,
  Modal,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Eye,
  ShieldCheck,
  Phone,
  MessageCircle,
  Check,
  TrendingDown,
  Scale,
  X,
  Mail,
} from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';
import { useListings } from '../hooks/useListings';
import { useFavorites } from '../hooks/useFavorites';
import { useCompare } from '../hooks/useCompare';
import { useAuth } from '../hooks/useAuth';
import { FinancingCalculator } from '../components/detail/FinancingCalculator';
import { ListingImage } from '../components/ListingImage';
import { ListingCard } from '../components/home/ListingCard';
import { useLang } from '../i18n/LangContext';
import { formatFullFCFA, formatPricePerSqm, formatSurface } from '../utils/formatPrice';
import { getPriceRating } from '../utils/listingUtils';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ListingDetail'>;

export function ListingDetailScreen({ route, navigation }: Props) {
  const { listingId } = route.params;
  const { lang, t } = useLang();
  const isFr = lang === 'fr';
  const { listings } = useListings();
  const { isFavorite, toggleFavorite, addToRecent, favorites } = useFavorites();
  const { isComparing, toggleCompare } = useCompare();
  const { user } = useAuth();

  const listing = useMemo(
    () => listings.find(l => l.id === listingId),
    [listings, listingId],
  );

  // Popup "Envoyer un message"
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [senderName, setSenderName] = useState(user?.name ?? '');
  const [senderEmail, setSenderEmail] = useState(user?.email ?? '');
  const [messageBody, setMessageBody] = useState('');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  useEffect(() => {
    if (listing) {
      addToRecent(listing.id);
      const refCode = listing.id.toUpperCase();
      const lTitle = isFr ? listing.title : listing.titleEn;
      setMessageBody(
        isFr
          ? `Bonjour, je souhaite visiter « ${lTitle} » (réf. ${refCode}). Merci de me recontacter.`
          : `Hello, I would like to visit "${lTitle}" (ref. ${refCode}). Please contact me back.`,
      );
    }
  }, [listing, addToRecent, isFr]);

  const similarListings = useMemo(() => {
    if (!listing) return [];
    return listings
      .filter(l => l.id !== listing.id && (l.type === listing.type || l.city === listing.city))
      .slice(0, 5);
  }, [listings, listing]);

  if (!listing) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color={colors.navy} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t.common.error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fav = isFavorite(listing.id);
  const title = isFr ? listing.title : listing.titleEn;
  const description = isFr ? listing.description : listing.descriptionEn;
  const features = isFr ? listing.features : listing.featuresEn;
  const priceRating = getPriceRating(listing, listings);
  const ppm = formatPricePerSqm(listing.price, listing.surface);

  const photos: (string | undefined)[] =
    listing.gallery && listing.gallery.length > 0
      ? listing.gallery
      : [listing.image];
  const activePhotoUri = photos[selectedPhotoIdx] ?? listing.image;

  const priceRatingLabels: Record<string, { fr: string; en: string; bg: string; fg: string }> = {
    excellent: { fr: 'Excellent prix',   en: 'Great price',     bg: colors.successSoft, fg: colors.success },
    tres_bon:  { fr: 'Très bon prix',    en: 'Very good price', bg: colors.successSoft, fg: colors.success },
    bon:       { fr: 'Bon prix',         en: 'Fair price',      bg: colors.infoSoft,    fg: colors.info },
    marche:    { fr: 'Prix du marché',   en: 'Market price',    bg: colors.surfaceAlt,  fg: colors.textSecondary },
    eleve:     { fr: 'Au-dessus marché', en: 'Above market',    bg: colors.warningSoft, fg: colors.warning },
  };
  const ratingBadge = priceRatingLabels[priceRating];

  const handleCall = () => {
    const cleanPhone = listing.seller.phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {});
  };

  const handleSendMessage = () => {
    if (!senderName.trim() || !senderEmail.trim() || !messageBody.trim()) {
      Alert.alert(
        isFr ? 'Champs requis' : 'Required fields',
        isFr
          ? 'Veuillez renseigner votre nom, votre e-mail et votre message.'
          : 'Please enter your name, email, and message.',
      );
      return;
    }
    setMsgModalOpen(false);
    Alert.alert(
      isFr ? 'Message envoyé' : 'Message sent',
      isFr
        ? `Votre message a bien été transmis à ${listing.seller.name}.`
        : `Your message has been sent to ${listing.seller.name}.`,
    );
  };

  const handleShare = () => {
    Share.share({
      message: `${title} — ${formatFullFCFA(listing.price)} (${listing.neighborhood}, ${listing.city}) | IMMO DU LETCH`,
    }).catch(() => {});
  };

  const typeLabel = t.propertyTypes[listing.type];
  const typeSingular = t.propertyTypeSingular[listing.type];
  const transLabel = t.transactions[listing.transaction];

  const characteristicRows: { label: string; value: string }[] = [
    { label: isFr ? 'Type de bien' : 'Property type', value: typeSingular },
    { label: isFr ? 'Transaction' : 'Transaction', value: listing.transaction === 'vente' ? (isFr ? 'Vente' : 'Sale') : (isFr ? 'Location' : 'Rent') },
    { label: isFr ? 'Surface habitable' : 'Living area', value: formatSurface(listing.surface) },
    ...(listing.bedrooms != null
      ? [{ label: isFr ? 'Chambres' : 'Bedrooms', value: String(listing.bedrooms) }]
      : []),
    ...(listing.bathrooms != null
      ? [{ label: isFr ? 'Salles de bains' : 'Bathrooms', value: String(listing.bathrooms) }]
      : []),
    { label: isFr ? 'État du bien' : 'Condition', value: t.conditions[listing.condition] },
    { label: isFr ? 'Ville' : 'City', value: listing.city },
    { label: isFr ? 'Quartier' : 'District', value: listing.neighborhood },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Barre supérieure avec disposition conservée des boutons Favori / Comparer / Partager */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {typeSingular} • {listing.city}
        </Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              isComparing(listing.id) && styles.navBtnGold,
            ]}
            onPress={() => toggleCompare(listing.id)}
          >
            <Scale size={18} color={colors.navy} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleShare}>
            <Share2 size={18} color={colors.navy} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => toggleFavorite(listing.id)}>
            <Heart
              size={19}
              color={fav ? colors.danger : colors.navy}
              fill={fav ? colors.danger : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Réf + Galerie photo */}
        <View style={styles.galleryContainer}>
          <View style={styles.refRow}>
            <Text style={styles.refText}>
              {isFr ? 'Réf.' : 'Ref.'} {listing.id.toUpperCase()}
            </Text>
          </View>

          <View style={styles.heroWrap}>
            <ListingImage
              uri={activePhotoUri}
              type={listing.type}
              fallbackColor={listing.gradientColors[0]}
              style={styles.heroImage}
              iconSize={56}
            />
            {listing.priceDropped && listing.priceDropPercent && (
              <View style={styles.dropBadge}>
                <TrendingDown size={12} color="#fff" />
                <Text style={styles.dropText}>-{listing.priceDropPercent}%</Text>
              </View>
            )}
          </View>

          {/* Miniatures sous la photo principale */}
          <View style={styles.thumbsRow}>
            {photos.slice(0, 3).map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.thumbBox, selectedPhotoIdx === idx && styles.thumbBoxActive]}
                onPress={() => setSelectedPhotoIdx(idx)}
                activeOpacity={0.8}
              >
                <ListingImage
                  uri={uri}
                  type={listing.type}
                  fallbackColor={listing.gradientColors[0]}
                  style={styles.thumbImg}
                  iconSize={22}
                />
              </TouchableOpacity>
            ))}
            <View style={styles.photoCountBox}>
              <Text style={styles.photoCountText}>
                {photos.length} {photos.length > 1 ? 'photos' : 'photo'}
              </Text>
            </View>
          </View>
        </View>

        {/* Badges + Titre + Localisation + Vues */}
        <View style={styles.headerBlock}>
          <View style={styles.badgesRow}>
            <View style={styles.badgePrimary}>
              <Text style={styles.badgePrimaryText}>{transLabel}</Text>
            </View>
            <View style={styles.badgeNeutral}>
              <Text style={styles.badgeNeutralText}>{typeLabel}</Text>
            </View>
            {listing.isNew && (
              <View style={styles.badgeSuccess}>
                <Text style={styles.badgeSuccessText}>{t.home.new}</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.locationRow}>
            <MapPin size={15} color={colors.textSecondary} />
            <Text style={styles.locationText}>
              {listing.neighborhood}, {listing.city}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Eye size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>
                {listing.views} {t.detail.views}
              </Text>
            </View>
            <Text style={styles.metaText}>
              {isFr ? `Publié le ${listing.createdAt}` : `Published ${listing.createdAt}`}
            </Text>
          </View>
        </View>

        {/* Grande carte Prix encadrée */}
        <View style={styles.priceCard}>
          <View style={styles.priceCardTop}>
            <Text style={styles.priceCardOverline}>
              {typeSingular.toUpperCase()} {transLabel.toUpperCase()}
            </Text>
            <View style={[styles.ratingScaleBadge, { backgroundColor: ratingBadge.bg }]}>
              <Text style={[styles.ratingScaleText, { color: ratingBadge.fg }]}>
                {isFr ? ratingBadge.fr : ratingBadge.en}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>
            {formatFullFCFA(listing.price)}
            {listing.transaction === 'location' ? (
              <Text style={styles.perMonth}> {t.common.perMonth}</Text>
            ) : null}
          </Text>
          <Text style={styles.priceSub}>
            {listing.transaction === 'location'
              ? (isFr ? 'Loyer mensuel, charges à préciser' : 'Monthly rent, utilities to confirm')
              : ppm || (isFr ? 'Prix de vente' : 'Sale price')}
          </Text>
        </View>

        {/* Grille 2x2 des 4 tuiles clés */}
        <View style={styles.specsGrid}>
          <View style={styles.specCard}>
            <Text style={styles.specVal}>{formatSurface(listing.surface)}</Text>
            <Text style={styles.specLbl}>{isFr ? 'Surface habitable' : 'Living area'}</Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specVal}>
              {listing.bedrooms != null
                ? `${listing.bedrooms} ${isFr ? (listing.bedrooms > 1 ? 'chambres' : 'chambre') : (listing.bedrooms > 1 ? 'bedrooms' : 'bedroom')}`
                : t.conditions[listing.condition]}
            </Text>
            <Text style={styles.specLbl}>
              {listing.bedrooms != null ? (isFr ? 'Couchages' : 'Rooms') : (isFr ? 'État' : 'Condition')}
            </Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specVal}>
              {listing.bathrooms != null
                ? `${listing.bathrooms} ${isFr ? 'sdb' : 'bath'}`
                : t.conditions[listing.condition]}
            </Text>
            <Text style={styles.specLbl}>{isFr ? 'Salles de bains' : 'Bathrooms'}</Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specVal}>{transLabel}</Text>
            <Text style={styles.specLbl}>{typeLabel}</Text>
          </View>
        </View>

        {/* Le bien en détail */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isFr ? 'Le bien en détail' : 'Property details'}
          </Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Les caractéristiques (tableau encadré) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isFr ? 'Les caractéristiques' : 'Specifications'}
          </Text>
          <View style={styles.tableCard}>
            {characteristicRows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.tableRow,
                  index < characteristicRows.length - 1 && styles.tableRowBorder,
                ]}
              >
                <Text style={styles.tableLabel}>{row.label}</Text>
                <Text style={styles.tableValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Les petits plus au quotidien (grille 2 colonnes) */}
        {features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isFr ? 'Les petits plus au quotidien' : 'Everyday extras'}
            </Text>
            <View style={styles.extrasGrid}>
              {features.map((feat, idx) => (
                <View key={idx} style={styles.extraCard}>
                  <Check size={14} color={colors.success} strokeWidth={2.5} />
                  <Text style={styles.extraText} numberOfLines={2}>
                    {feat}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Simulateur de mensualité (vente uniquement) */}
        {listing.transaction === 'vente' && (
          <View style={styles.calculatorWrap}>
            <FinancingCalculator price={listing.price} />
          </View>
        )}

        {/* Encadré jaune : Les bons réflexes avant de vous engager */}
        <View style={styles.reflexCard}>
          <View style={styles.reflexTitleRow}>
            <ShieldCheck size={18} color={colors.navy} />
            <Text style={styles.reflexTitle}>
              {isFr ? 'Les bons réflexes avant de vous engager' : 'Good practices before committing'}
            </Text>
          </View>
          <Text style={styles.reflexBody}>
            {isFr
              ? 'Demandez une copie des documents annoncés (titre foncier, permis, plan cadastral) et faites vérifier leur authenticité auprès des services compétents.'
              : 'Ask for a copy of the declared documents and verify their authenticity with the competent authorities before any transaction.'}
          </Text>
        </View>

        {/* Encadré localisation */}
        <View style={styles.locationCard}>
          <MapPin size={18} color={colors.navy} style={styles.locationCardIcon} />
          <View style={styles.locationCardBody}>
            <Text style={styles.locationCardTitle}>
              {listing.neighborhood}, {listing.city}
            </Text>
            <Text style={styles.locationCardSub}>
              {isFr
                ? "L'adresse exacte est communiquée par l'annonceur lors de la prise de rendez-vous."
                : 'The exact address is shared by the advertiser when scheduling a visit.'}
            </Text>
          </View>
        </View>

        {/* Biens similaires */}
        {similarListings.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>{t.detail.similar}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similarListings.map(sim => (
                <ListingCard
                  key={sim.id}
                  listing={sim}
                  isFav={favorites.includes(sim.id)}
                  lang={lang}
                  onPress={() => navigation.push('ListingDetail', { listingId: sim.id })}
                  onToggleFav={() => toggleFavorite(sim.id)}
                  dealLabel={isFr ? 'OPPORTUNITÉ' : 'DEAL'}
                  newLabel={t.home.new.toUpperCase()}
                  perMonthLabel={t.common.perMonth}
                />
              ))}
              <View style={styles.similarSpacer} />
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Barre d'action fixe en bas : Appeler + Envoyer un message */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.85}>
          <Phone size={18} color={colors.gold} />
          <Text style={styles.callBtnText}>{t.detail.contact}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.msgBtn}
          onPress={() => setMsgModalOpen(true)}
          activeOpacity={0.85}
        >
          <MessageCircle size={18} color="#fff" />
          <Text style={styles.msgBtnText}>
            {isFr ? 'Envoyer un message' : 'Send a message'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Popup Modal "Envoyer un message" (sans barre d'appel) */}
      <Modal
        visible={msgModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMsgModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalOverline}>
                {isFr ? 'VOTRE INTERLOCUTEUR' : 'YOUR CONTACT'}
              </Text>
              <TouchableOpacity
                onPress={() => setMsgModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* En-tête interlocuteur (sans bouton/barre d'appel) */}
            <View style={styles.interlocutorRow}>
              <View style={styles.interlocutorLogoBox}>
                <Image
                  source={require('../../immo.png')}
                  style={styles.interlocutorLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.interlocutorInfo}>
                <Text style={styles.interlocutorName}>{listing.seller.name}</Text>
                <View style={styles.interlocutorRating}>
                  <Star size={13} color={colors.gold} fill={colors.gold} />
                  <Text style={styles.interlocutorRatingText}>
                    {(listing.rating ?? 4.8).toFixed(1)} ({listing.ratingCount ?? 47}{' '}
                    {isFr ? 'avis' : 'reviews'})
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.modalHeading}>
              {isFr
                ? 'Demandez une visite ou plus de détails.'
                : 'Request a visit or more details.'}
            </Text>

            <Text style={styles.inputLabel}>{isFr ? 'Votre nom' : 'Your name'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={isFr ? 'Ex. Paul Mbarga' : 'Ex. Paul Mbarga'}
              placeholderTextColor={colors.textMuted}
              value={senderName}
              onChangeText={setSenderName}
            />

            <Text style={styles.inputLabel}>{isFr ? 'Votre e-mail' : 'Your e-mail'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="exemple@gmail.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={senderEmail}
              onChangeText={setSenderEmail}
            />

            <Text style={styles.inputLabel}>{isFr ? 'Votre message' : 'Your message'}</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={messageBody}
              onChangeText={setMessageBody}
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleSendMessage}
              activeOpacity={0.85}
            >
              <Mail size={16} color={colors.navy} strokeWidth={2.2} />
              <Text style={styles.modalSubmitText}>
                {isFr ? 'Envoyer mon message' : 'Send my message'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.modalFooterNote}>
              {isFr
                ? "Vos coordonnées sont transmises à l'annonceur pour répondre à votre demande."
                : 'Your contact details are shared with the advertiser to reply to your request.'}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginHorizontal: 8,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnGold: {
    backgroundColor: colors.gold,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scroll: {
    flex: 1,
  },

  // ── Galerie ──
  galleryContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  refText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  heroWrap: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  dropBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  dropText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  thumbsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  thumbBox: {
    width: 72,
    height: 54,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  thumbBoxActive: {
    borderColor: colors.navy,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  photoCountBox: {
    width: 72,
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  photoCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },

  // ── En-tête bien ──
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  badgePrimary: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePrimaryText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeNeutral: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeNeutralText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccessText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.navy,
    lineHeight: 28,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // ── Carte Prix ──
  priceCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  priceCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceCardOverline: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  ratingScaleBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingScaleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  price: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.navy,
  },
  perMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.navy,
  },
  priceSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },

  // ── Grille 2x2 ──
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  specCard: {
    width: '48.4%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  specVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 3,
  },
  specLbl: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // ── Sections ──
  section: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  // ── Tableau caractéristiques ──
  tableCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  tableValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },

  // ── Les petits plus au quotidien ──
  extrasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  extraCard: {
    width: '48.6%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  extraText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },

  calculatorWrap: {
    paddingHorizontal: 16,
    marginTop: 18,
  },

  // ── Encadré bons réflexes ──
  reflexCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEF9E7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reflexTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reflexTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  reflexBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#78350F',
  },

  // ── Encadré localisation ──
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  locationCardIcon: {
    marginTop: 2,
  },
  locationCardBody: {
    flex: 1,
  },
  locationCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 4,
  },
  locationCardSub: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },

  // ── Similaires ──
  similarSection: {
    marginTop: 22,
    paddingLeft: 16,
  },
  similarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 12,
  },
  similarSpacer: {
    width: 16,
  },
  bottomSpacer: {
    height: 24,
  },

  // ── Barre du bas ──
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.navy,
    paddingVertical: 14,
    borderRadius: 12,
  },
  callBtnText: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '800',
  },
  msgBtn: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
  },
  msgBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },

  // ── Modal Envoyer un message ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 31, 73, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalOverline: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.7,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interlocutorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  interlocutorLogoBox: {
    width: 56,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  interlocutorLogo: {
    width: '100%',
    height: '100%',
  },
  interlocutorInfo: {
    flex: 1,
  },
  interlocutorName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 3,
  },
  interlocutorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  interlocutorRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginTop: 8,
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.navy,
    backgroundColor: '#FFFFFF',
  },
  modalTextArea: {
    minHeight: 88,
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
  },
  modalSubmitText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
  },
  modalFooterNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
});
