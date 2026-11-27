/**
 * SupportScreen — Page complète Support & Accompagnement / Aide & Contact
 * Récupérée du site web IMMO DU LETCH : contacts directs, sécurité des transactions,
 * 6 articles de conseils immobiliers et 8 questions fréquentes (FAQ).
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Phone,
  Mail,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  ChevronDown,
  MapPin,
} from 'lucide-react-native';
import { colors, spacing } from '../theme';
import { useLang } from '../i18n/LangContext';

interface Article {
  tag: string;
  title: string;
  body: string[];
}

interface FaqItem {
  q: string;
  a: string;
}

const ARTICLES_FR: Article[] = [
  {
    tag: 'ACHETER',
    title: "Titre foncier : les vérifications à faire avant d'acheter",
    body: [
      "Avant toute signature, demandez une copie du titre foncier et vérifiez son authenticité auprès des services compétents. Le nom du propriétaire doit correspondre à celui qui vend.",
      "Faites contrôler les limites du terrain, l'absence d'hypothèque ou de litige, et l'état réel du bien lors d'une visite. Un accompagnement juridique reste la meilleure protection.",
    ],
  },
  {
    tag: 'LOUER',
    title: 'Visiter un logement : les bonnes questions à poser',
    body: [
      "Demandez le montant du loyer, des charges et de la caution, ainsi que la durée du bail. Vérifiez l'état des équipements, l'arrivée d'eau, l'électricité et la sécurité de l'immeuble.",
      "Précisez par écrit ce qui est inclus dans le loyer et ce qui reste à votre charge. Ne versez jamais de somme avant d'avoir visité et signé un document clair.",
    ],
  },
  {
    tag: 'INVESTIR',
    title: 'Terrain ou appartement : quel bien pour votre projet ?',
    body: [
      "Un terrain demande du temps et un budget de construction, mais offre une grande liberté d'aménagement. Un appartement se loue plus vite et demande moins d'entretien.",
      "Comparez le prix au m², la demande locative du quartier et les documents disponibles. Le bon choix dépend de votre horizon d'investissement et de votre trésorerie.",
    ],
  },
  {
    tag: 'CONSTRUIRE',
    title: 'Construire ou acheter : que choisir au Cameroun ?',
    body: [
      "Construire permet de personnaliser chaque détail de votre futur logement, mais implique de gérer un chantier sur plusieurs mois. L'achat d'un bien existant offre une installation immédiate.",
      "Dans les deux cas, vérifiez la validité du titre foncier, le respect des règles d'urbanisme et faites appel à un architecte agréé pour sécuriser votre projet.",
    ],
  },
  {
    tag: 'INVESTIR',
    title: 'Immobilier locatif : comment calculer votre rendement ?',
    body: [
      "Le rendement locatif brut se calcule en divisant le loyer annuel par le prix d'achat, multiplié par 100. À Douala et Yaoundé, les bons rendements se situent entre 6 % et 10 %.",
      "Pensez aussi aux charges (entretien, taxes, vacance locative) pour obtenir le rendement net réel. Un quartier en développement peut offrir une meilleure plus-value à long terme.",
    ],
  },
  {
    tag: 'JURIDIQUE',
    title: "Les étapes légales d'une transaction immobilière au Cameroun",
    body: [
      "Une vente immobilière au Cameroun passe par la promesse de vente, la vérification du titre foncier, le paiement des droits de mutation (environ 15 % du prix) et la signature de l'acte notarié.",
      "Ne signez jamais sans avoir fait appel à un notaire ou un avocat spécialisé. Les frais de notaire et taxes sont à intégrer dans votre budget total dès le départ.",
    ],
  },
];

const FAQS_FR: FaqItem[] = [
  {
    q: 'Comment rechercher un bien au Cameroun ?',
    a: 'Utilisez la recherche par transaction, ville, type de bien, budget, surface et nombre de pièces. Les filtres avancés permettent aussi de vérifier les documents annoncés et les équipements.',
  },
  {
    q: 'Comment publier une annonce immobilière ?',
    a: 'Rendez-vous dans l’onglet « Déposer » pour renseigner les caractéristiques de votre bien. Préparez les photos, le prix et les documents disponibles. IMMO DU LETCH vous accompagne dans la mise en ligne.',
  },
  {
    q: 'Quels documents vérifier avant un achat ?',
    a: "Titre foncier, plan cadastral, permis de bâtir et pièces d'identité du vendeur. Faites toujours confirmer leur authenticité et la situation du bien auprès des services compétents.",
  },
  {
    q: "Comment organiser une visite avec l'annonceur ?",
    a: "Depuis la fiche d'un bien, utilisez le bouton « Appeler » ou « Envoyer un message ». Convenez d'un rendez-vous et vérifiez le bien sur place avant tout engagement.",
  },
  {
    q: 'Peut-on acheter un bien sans titre foncier ?',
    a: 'Il est fortement déconseillé d’acheter sans titre foncier. Ce document est la seule preuve légale de propriété reconnue au Cameroun. Exigez-le systématiquement et faites-le vérifier auprès du cadastre.',
  },
  {
    q: "Quelles sont les taxes à payer lors d'une vente ?",
    a: "Les principaux frais incluent les droits de mutation (environ 15 % du prix de vente), les frais de notaire, et éventuellement la taxe foncière. Prévoyez un budget total supérieur d'environ 18-20 % au prix affiché.",
  },
  {
    q: "Comment estimer le prix d'un bien au Cameroun ?",
    a: 'Le prix dépend de la ville, du quartier, de la superficie, de l’état et des documents disponibles. À Douala, les prix varient de 300 000 à plus de 1 000 000 FCFA/m² selon le secteur. Comparez plusieurs annonces similaires avant de décider.',
  },
  {
    q: "Est-il possible d'obtenir un crédit immobilier ?",
    a: "Oui, plusieurs banques camerounaises proposent des crédits immobiliers, généralement sur 10 à 20 ans avec un apport minimum de 20-30 %. Le taux d'intérêt varie entre 7 % et 12 % selon l'établissement.",
  },
];

export function SupportScreen() {
  const navigation = useNavigation();
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [openArticleIdx, setOpenArticleIdx] = useState<number | null>(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isFr ? 'Aide & Contact' : 'Help & Contact'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section Aide & Contact ── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroOverline}>
            {isFr ? 'SUPPORT & ACCOMPAGNEMENT' : 'SUPPORT & GUIDANCE'}
          </Text>
          <Text style={styles.heroTitle}>
            {isFr ? 'Besoin d’aide pour votre projet immobilier ?' : 'Need help with your real estate project?'}
          </Text>
          <Text style={styles.heroSub}>
            {isFr
              ? 'Notre équipe vous accompagne pour acheter, louer, estimer ou publier un bien en toute confiance au Cameroun.'
              : 'Our team assists you to buy, rent, or publish a property with confidence in Cameroon.'}
          </Text>

          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactBtnNavy}
              onPress={() => Linking.openURL('tel:+237655000000').catch(() => {})}
              activeOpacity={0.85}
            >
              <Phone size={16} color={colors.gold} />
              <Text style={styles.contactBtnNavyText}>+237 6 55 00 00 00</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactBtnLight}
              onPress={() => Linking.openURL('mailto:contact@immoduletch.cm').catch(() => {})}
              activeOpacity={0.85}
            >
              <Mail size={16} color={colors.navy} />
              <Text style={styles.contactBtnLightText}>contact@immoduletch.cm</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.citiesRow}>
            <MapPin size={14} color={colors.textMuted} />
            <Text style={styles.citiesText}>Douala · Yaoundé · Kribi</Text>
          </View>
        </View>

        {/* ── Sécurité des transactions ── */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyTitleRow}>
            <ShieldCheck size={18} color={colors.navy} />
            <Text style={styles.safetyTitle}>
              {isFr ? 'Sécurité des transactions' : 'Transaction safety'}
            </Text>
          </View>
          <Text style={styles.safetyBody}>
            {isFr
              ? 'Ne versez jamais d’acompte sans visite physique et sans vérification des documents originaux (titre foncier, permis de bâtir, plan cadastral) auprès des services compétents.'
              : 'Never pay a deposit without an in-person visit and verification of original documents with the competent authorities.'}
          </Text>
        </View>

        {/* ── Conseils immobiliers (6 articles du web) ── */}
        <View style={styles.sectionHeader}>
          <BookOpen size={18} color={colors.navy} />
          <Text style={styles.sectionTitle}>
            {isFr ? 'Conseils immobiliers' : 'Real estate advice'}
          </Text>
        </View>

        <View style={styles.listCard}>
          {ARTICLES_FR.map((article, idx) => {
            const expanded = openArticleIdx === idx;
            return (
              <View
                key={article.title}
                style={[styles.accordionItem, idx < ARTICLES_FR.length - 1 && styles.itemBorder]}
              >
                <TouchableOpacity
                  style={styles.accordionTrigger}
                  onPress={() => setOpenArticleIdx(expanded ? null : idx)}
                  activeOpacity={0.75}
                >
                  <View style={styles.articleTriggerLeft}>
                    <View style={styles.articleTag}>
                      <Text style={styles.articleTagText}>{article.tag}</Text>
                    </View>
                    <Text style={styles.accordionTitle}>{article.title}</Text>
                  </View>
                  <ChevronDown
                    size={18}
                    color={colors.textMuted}
                    style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
                {expanded && (
                  <View style={styles.articleBody}>
                    {article.body.map((para, pIdx) => (
                      <Text key={pIdx} style={styles.accordionBodyText}>
                        {para}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── FAQ (8 questions du web) ── */}
        <View style={styles.sectionHeader}>
          <HelpCircle size={18} color={colors.navy} />
          <Text style={styles.sectionTitle}>
            {isFr ? 'Questions fréquentes (FAQ)' : 'Frequently asked questions'}
          </Text>
        </View>

        <View style={styles.listCard}>
          {FAQS_FR.map((faq, idx) => {
            const expanded = openFaqIdx === idx;
            return (
              <View
                key={faq.q}
                style={[styles.accordionItem, idx < FAQS_FR.length - 1 && styles.itemBorder]}
              >
                <TouchableOpacity
                  style={styles.accordionTrigger}
                  onPress={() => setOpenFaqIdx(expanded ? null : idx)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.accordionTitle, styles.faqQuestionText]}>{faq.q}</Text>
                  <ChevronDown
                    size={18}
                    color={colors.textMuted}
                    style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
                {expanded && (
                  <View style={styles.articleBody}>
                    <Text style={styles.accordionBodyText}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  scroll: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: spacing.md, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  headerSpacer: { width: 40 },

  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  heroOverline: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.navy,
    marginBottom: 6,
    lineHeight: 25,
  },
  heroSub: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
    marginBottom: 14,
  },
  contactButtons: {
    gap: 10,
    marginBottom: 12,
  },
  contactBtnNavy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.navy,
    borderRadius: 10,
    paddingVertical: 12,
  },
  contactBtnNavyText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  contactBtnLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
  },
  contactBtnLightText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '700',
  },
  citiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  citiesText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },

  safetyCard: {
    backgroundColor: '#FEF9E7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  safetyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
  safetyBody: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.navy,
  },

  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  accordionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  accordionTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  articleTriggerLeft: {
    flex: 1,
    gap: 5,
  },
  articleTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  articleTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: 0.5,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
    lineHeight: 19,
  },
  faqQuestionText: {
    flex: 1,
  },
  articleBody: {
    marginTop: 10,
    gap: 8,
  },
  accordionBodyText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
});
