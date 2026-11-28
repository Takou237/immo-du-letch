/**
 * ProfileScreen — Connexion / Inscription & Espace personnel.
 * Design calqué sur les captures du site web (AuthModal + MobileProfilePage).
 * Supporte les 3 types de comptes : Particulier, Agence immobilière, Agent indépendant.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft,
  X,
  Eye,
  EyeOff,
  LogOut,
  Check,
  Heart,
  FileText,
  ShieldCheck,
  Clock,
  Phone,
  User as UserIcon,
  PlusCircle,
  Trash2,
  MapPin,
} from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { AccountType } from '../providers/AuthProvider';
import { useFavorites } from '../hooks/useFavorites';
import { useListings } from '../hooks/useListings';
import { useLang } from '../i18n/LangContext';
import { formatFullFCFA } from '../utils/formatPrice';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function GoogleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <Path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <Path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <Path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </Svg>
  );
}

const DEMO_GMAIL_ACCOUNTS: { name: string; email: string; accountType: AccountType }[] = [
  { name: 'Ken Daniel', email: 'ken.daniel@gmail.com', accountType: 'particulier' },
  { name: 'IMMO DU LETCH Pro', email: 'contact.immoduletch@gmail.com', accountType: 'agence' },
];

export function ProfileScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const { user, loginWithEmail, registerWithEmail, loginWithDemo, updateProfile, logout } = useAuth();
  const { favorites, recentlyViewed } = useFavorites();
  const { localListings, deleteLocalListing } = useListings();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [googleStep, setGoogleStep] = useState(false);

  // Connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Inscription
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+237 6');
  const [regAccountType, setRegAccountType] = useState<AccountType>('particulier');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Édition profil connecté
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editPhone, setEditPhone] = useState(user?.phone ?? '');
  const [editType, setEditType] = useState<AccountType>(user?.accountType ?? 'particulier');

  const accountTypeLabels: Record<AccountType, { fr: string; en: string }> = {
    particulier:       { fr: 'Particulier',         en: 'Individual' },
    agence:            { fr: 'Agence immobilière',  en: 'Real estate agency' },
    agent_independant: { fr: 'Agent indépendant',   en: 'Independent agent' },
  };

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleLogin = () => {
    if (!isEmailValid(email)) {
      Alert.alert(
        lang === 'fr' ? 'E-mail invalide' : 'Invalid email',
        lang === 'fr'
          ? 'Veuillez saisir une adresse e-mail valide.'
          : 'Please enter a valid email address.',
      );
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        lang === 'fr' ? 'Mot de passe invalide' : 'Invalid password',
        lang === 'fr'
          ? 'Le mot de passe doit contenir au moins 6 caractères.'
          : 'Password must be at least 6 characters.',
      );
      return;
    }
    loginWithEmail(email);
  };

  const handleRegister = () => {
    if (!regName.trim()) {
      Alert.alert(
        lang === 'fr' ? 'Nom requis' : 'Name required',
        lang === 'fr' ? 'Veuillez renseigner votre nom complet ou agence.' : 'Please enter your full name or agency.',
      );
      return;
    }
    if (!isEmailValid(regEmail)) {
      Alert.alert(
        lang === 'fr' ? 'E-mail invalide' : 'Invalid email',
        lang === 'fr' ? 'Veuillez saisir une adresse e-mail valide.' : 'Please enter a valid email address.',
      );
      return;
    }
    if (regPassword.length < 6) {
      Alert.alert(
        lang === 'fr' ? 'Mot de passe trop court' : 'Password too short',
        lang === 'fr' ? 'Minimum 6 caractères requis.' : 'Minimum 6 characters required.',
      );
      return;
    }
    if (regPassword !== regConfirm) {
      Alert.alert(
        lang === 'fr' ? 'Confirmation incorrecte' : 'Passwords do not match',
        lang === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'The passwords do not match.',
      );
      return;
    }
    registerWithEmail({
      name: regName,
      email: regEmail,
      phone: regPhone,
      accountType: regAccountType,
    });
  };

  const handleForgotPassword = () => {
    Alert.alert(
      lang === 'fr' ? 'Mot de passe oublié' : 'Forgot password',
      lang === 'fr'
        ? 'En mode local hors-ligne, utilisez un e-mail valide ou « Continuer avec Google (Gmail) ».'
        : 'In local offline mode, use any valid email or "Continue with Google (Gmail)".',
    );
  };

  const handleSaveProfile = () => {
    const finalName = (editName || user?.name || '').trim();
    if (!finalName) return;
    updateProfile({
      name: finalName,
      phone: (editPhone || user?.phone || '').trim(),
      accountType: editType,
    });
    Alert.alert(
      lang === 'fr' ? 'Profil mis à jour' : 'Profile updated',
      lang === 'fr'
        ? 'Vos informations locales ont été enregistrées.'
        : 'Your local information has been saved.',
    );
  };

  // ── ÉCRAN NON CONNECTÉ (CALQUÉ SUR LES CAPTURES WEB) ──
  if (!user) {
    return (
      <SafeAreaView style={styles.authBackdrop} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.scroll}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.authScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
          <View style={styles.authCard}>
            {/* Header carte */}
            <View style={styles.authHeaderRow}>
              <Text style={styles.authTitle}>
                {mode === 'login'
                  ? (lang === 'fr' ? 'Se connecter' : 'Sign in')
                  : (lang === 'fr' ? 'Créer un compte' : 'Create an account')}
              </Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <X size={18} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.authSubtitle}>
              {lang === 'fr'
                ? 'Retrouvez vos favoris, alertes et annonces sur IMMO DU LETCH.'
                : 'Access your favorites, alerts and listings on IMMO DU LETCH.'}
            </Text>

            {/* Switch Connexion / Inscription */}
            <View style={styles.segmentWrap}>
              <TouchableOpacity
                style={[styles.segmentBtn, mode === 'login' && styles.segmentBtnActive]}
                onPress={() => {
                  setMode('login');
                  setGoogleStep(false);
                }}
              >
                <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
                  {lang === 'fr' ? 'Connexion' : 'Sign in'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentBtn, mode === 'register' && styles.segmentBtnActive]}
                onPress={() => {
                  setMode('register');
                  setGoogleStep(false);
                }}
              >
                <Text style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}>
                  {lang === 'fr' ? 'Inscription' : 'Sign up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bouton Google */}
            <TouchableOpacity
              style={[styles.googleBtn, googleStep && styles.googleBtnActive]}
              onPress={() => setGoogleStep(prev => !prev)}
              activeOpacity={0.85}
            >
              <GoogleLogo />
              <Text style={styles.googleBtnText}>
                {lang === 'fr'
                  ? 'Continuer avec Google (Gmail)'
                  : 'Continue with Google (Gmail)'}
              </Text>
            </TouchableOpacity>

            {/* Sélecteur rapide compte Gmail démo */}
            {googleStep && (
              <View style={styles.googleList}>
                {DEMO_GMAIL_ACCOUNTS.map(acc => (
                  <TouchableOpacity
                    key={acc.email}
                    style={styles.googleAccountItem}
                    onPress={() => loginWithDemo(acc.name, acc.email, acc.accountType)}
                  >
                    <View style={styles.googleAvatar}>
                      <Text style={styles.googleAvatarText}>{acc.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.googleAccName}>{acc.name}</Text>
                      <Text style={styles.googleAccEmail}>{acc.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Séparateur OU PAR E-MAIL */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>
                {lang === 'fr' ? 'OU PAR E-MAIL' : 'OR BY EMAIL'}
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Formulaire Connexion */}
            {mode === 'login' ? (
              <View>
                <Text style={styles.fieldLabel}>
                  {lang === 'fr' ? 'Adresse e-mail' : 'Email address'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="exemple@domaine.cm"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.passwordHeader}>
                  <Text style={styles.fieldLabel}>
                    {lang === 'fr' ? 'Mot de passe' : 'Password'}
                  </Text>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotLink}>
                      {lang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.passwordWrap}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textMuted}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(p => !p)}
                    hitSlop={8}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color={colors.textSecondary} />
                    ) : (
                      <Eye size={18} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitGoldBtn} onPress={handleLogin} activeOpacity={0.85}>
                  <Text style={styles.submitGoldText}>
                    {lang === 'fr' ? 'Se connecter' : 'Sign in'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Formulaire Inscription */
              <View>
                <Text style={styles.fieldLabel}>
                  {lang === 'fr' ? 'Nom complet ou agence *' : 'Full name or agency *'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={regName}
                  onChangeText={setRegName}
                  placeholder={lang === 'fr' ? 'Ex: Paul Mbarga' : 'E.g. Paul Mbarga'}
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.row2}>
                  <View style={styles.col}>
                    <Text style={styles.fieldLabel}>E-mail *</Text>
                    <TextInput
                      style={styles.input}
                      value={regEmail}
                      onChangeText={setRegEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="nom@exemple.cm"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.fieldLabel}>
                      {lang === 'fr' ? 'Téléphone' : 'Phone'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={regPhone}
                      onChangeText={setRegPhone}
                      keyboardType="phone-pad"
                      placeholder="+237 6..."
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>
                  {lang === 'fr' ? 'Type de compte' : 'Account type'}
                </Text>
                <View style={styles.row2}>
                  <TouchableOpacity
                    style={[
                      styles.accountBtn,
                      regAccountType === 'particulier' && styles.accountBtnActive,
                    ]}
                    onPress={() => setRegAccountType('particulier')}
                  >
                    <Text
                      style={[
                        styles.accountBtnText,
                        regAccountType === 'particulier' && styles.accountBtnTextActive,
                      ]}
                    >
                      {lang === 'fr' ? 'Particulier' : 'Individual'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.accountBtn,
                      regAccountType !== 'particulier' && styles.accountBtnActive,
                    ]}
                    onPress={() => setRegAccountType('agence')}
                  >
                    <Text
                      style={[
                        styles.accountBtnText,
                        regAccountType !== 'particulier' && styles.accountBtnTextActive,
                      ]}
                    >
                      {lang === 'fr' ? 'Agence / Pro' : 'Agency / Pro'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {regAccountType !== 'particulier' && (
                  <View style={styles.proSubRow}>
                    <TouchableOpacity
                      style={[
                        styles.proSubChip,
                        regAccountType === 'agence' && styles.proSubChipActive,
                      ]}
                      onPress={() => setRegAccountType('agence')}
                    >
                      <Text
                        style={[
                          styles.proSubText,
                          regAccountType === 'agence' && styles.proSubTextActive,
                        ]}
                      >
                        {accountTypeLabels.agence[lang]}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.proSubChip,
                        regAccountType === 'agent_independant' && styles.proSubChipActive,
                      ]}
                      onPress={() => setRegAccountType('agent_independant')}
                    >
                      <Text
                        style={[
                          styles.proSubText,
                          regAccountType === 'agent_independant' && styles.proSubTextActive,
                        ]}
                      >
                        {accountTypeLabels.agent_independant[lang]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.row2}>
                  <View style={styles.col}>
                    <Text style={styles.fieldLabel}>
                      {lang === 'fr' ? 'Mot de passe *' : 'Password *'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={regPassword}
                      onChangeText={setRegPassword}
                      secureTextEntry
                      placeholder={lang === 'fr' ? 'Min. 6 caractères' : 'Min. 6 chars'}
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.fieldLabel}>
                      {lang === 'fr' ? 'Confirmer *' : 'Confirm *'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={regConfirm}
                      onChangeText={setRegConfirm}
                      secureTextEntry
                      placeholder={lang === 'fr' ? 'Répétez' : 'Repeat'}
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.submitGoldBtn}
                  onPress={handleRegister}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitGoldText}>
                    {lang === 'fr' ? 'Créer mon compte' : 'Create my account'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── ÉCRAN CONNECTÉ (ESPACE PERSONNEL PRO) ──
  const handleConfirmLogout = () => {
    Alert.alert(
      lang === 'fr' ? 'Déconnexion' : 'Sign out',
      lang === 'fr'
        ? 'Voulez-vous vraiment vous déconnecter de votre compte ?'
        : 'Do you really want to sign out?',
      [
        { text: lang === 'fr' ? 'Annuler' : 'Cancel', style: 'cancel' },
        { text: lang === 'fr' ? 'Se déconnecter' : 'Sign out', style: 'destructive', onPress: logout },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {lang === 'fr' ? 'Mon compte' : 'My account'}
        </Text>
        <TouchableOpacity style={styles.logoutIconBtn} onPress={handleConfirmLogout}>
          <LogOut size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.scroll}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {/* Carte Profil Premium */}
          <View style={styles.profileBanner}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.slice(0, 2).toUpperCase()}</Text>
                </View>
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                  <ShieldCheck size={17} color={colors.gold} />
                </View>
                <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
                {!!user.phone && (
                  <Text style={styles.userPhone}>{user.phone}</Text>
                )}
              </View>
            </View>

            <View style={styles.profileFooterRow}>
              <View style={styles.accountBadge}>
                <Text style={styles.accountBadgeText}>
                  {accountTypeLabels[user.accountType][lang]}
                </Text>
              </View>
              <Text style={styles.memberLabel}>
                {lang === 'fr' ? 'Compte vérifié · IMMO DU LETCH' : 'Verified · IMMO DU LETCH'}
              </Text>
            </View>
          </View>

          {/* Tableau de bord KPI (3 tuiles) */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statBox}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Favorites' })}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconWrap, styles.statIconFav]}>
                <Heart size={16} color="#DC2626" />
              </View>
              <Text style={styles.statVal}>{favorites.length}</Text>
              <Text style={styles.statLbl}>{t.nav.favorites}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statBox}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Sell' })}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconWrap, styles.statIconListings]}>
                <FileText size={16} color={colors.navy} />
              </View>
              <Text style={styles.statVal}>{localListings.length}</Text>
              <Text style={styles.statLbl}>{t.sell.myListings}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statBox}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Favorites' })}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconWrap, styles.statIconRecent]}>
                <Clock size={16} color="#B45309" />
              </View>
              <Text style={styles.statVal}>{recentlyViewed.length}</Text>
              <Text style={styles.statLbl}>
                {lang === 'fr' ? 'Consultés' : 'Viewed'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mes annonces déposées */}
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>
                {lang === 'fr' ? 'Mes annonces déposées' : 'My posted listings'}
              </Text>
              <TouchableOpacity
                style={styles.addMiniBtn}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Sell' })}
              >
                <PlusCircle size={14} color={colors.navy} />
                <Text style={styles.addMiniBtnText}>
                  {lang === 'fr' ? 'Déposer' : 'Post'}
                </Text>
              </TouchableOpacity>
            </View>

            {localListings.length === 0 ? (
              <View style={styles.emptyListingsBox}>
                <Text style={styles.emptyListingsText}>
                  {lang === 'fr'
                    ? 'Vous n’avez pas encore publié d’annonce depuis cet appareil.'
                    : 'You have not posted any listing from this device yet.'}
                </Text>
              </View>
            ) : (
              localListings.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.myListingRow}
                  onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.myListingInfo}>
                    <Text style={styles.myListingTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.myListingMetaRow}>
                      <MapPin size={12} color={colors.textMuted} />
                      <Text style={styles.myListingMeta}>
                        {item.neighborhood}, {item.city} · {formatFullFCFA(item.price)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.myListingRight}>
                    <View style={styles.pendingPill}>
                      <Text style={styles.pendingPillText}>
                        {lang === 'fr' ? 'En attente' : 'Pending'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteLocalListing(item.id)}
                      hitSlop={8}
                    >
                      <Trash2 size={16} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Carte Informations du compte */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              {lang === 'fr' ? 'Informations personnelles' : 'Personal information'}
            </Text>

            <Text style={styles.fieldLabel}>
              {lang === 'fr' ? 'Nom complet ou agence' : 'Full name or agency'}
            </Text>
            <View style={styles.iconInputWrap}>
              <UserIcon size={16} color={colors.textMuted} />
              <TextInput
                style={styles.iconInputField}
                value={editName || user.name}
                onChangeText={setEditName}
              />
            </View>

            <Text style={styles.fieldLabel}>{lang === 'fr' ? 'Téléphone' : 'Phone'}</Text>
            <View style={styles.iconInputWrap}>
              <Phone size={16} color={colors.textMuted} />
              <TextInput
                style={styles.iconInputField}
                value={editPhone || user.phone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.fieldLabel}>{lang === 'fr' ? 'Statut du compte' : 'Account status'}</Text>
            <View style={styles.typeGrid}>
              {(['particulier', 'agence', 'agent_independant'] as AccountType[]).map(at => (
                <TouchableOpacity
                  key={at}
                  style={[styles.typeChip, editType === at && styles.typeChipActive]}
                  onPress={() => setEditType(at)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      editType === at && styles.typeChipTextActive,
                    ]}
                  >
                    {accountTypeLabels[at][lang]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submitGoldBtn} onPress={handleSaveProfile} activeOpacity={0.85}>
              <Check size={16} color={colors.navy} />
              <Text style={styles.submitGoldText}>
                {lang === 'fr' ? 'Enregistrer les modifications' : 'Save changes'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bouton Se déconnecter */}
          <TouchableOpacity
            style={styles.logoutFullBtn}
            onPress={handleConfirmLogout}
            activeOpacity={0.8}
          >
            <LogOut size={16} color={colors.danger} />
            <Text style={styles.logoutFullText}>
              {lang === 'fr' ? 'Se déconnecter' : 'Sign out'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 31, 73, 0.25)',
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 18,
  },
  authCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  authHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.navy,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 16,
  },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.navy,
    fontWeight: '700',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  googleBtnActive: {
    borderColor: colors.info,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },
  googleList: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  googleAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  googleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleAvatarText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '800',
  },
  googleAccName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  googleAccEmail: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.navy,
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgotLink: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: colors.navy,
    paddingVertical: 0,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  row2: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  accountBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBtnActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  accountBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  accountBtnTextActive: {
    color: colors.textOnNavy,
  },
  proSubRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  proSubChip: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 7,
    alignItems: 'center',
  },
  proSubChipActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  proSubText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  proSubTextActive: {
    color: colors.navy,
    fontWeight: '700',
  },
  submitGoldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.gold,
    marginTop: 18,
  },
  submitGoldText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
  },

  // Styles espace connecté
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileBanner: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: colors.navy,
  },
  avatarText: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: colors.textOnNavy,
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  userEmail: {
    color: '#CBD5E1',
    fontSize: 12.5,
    marginTop: 2,
  },
  userPhone: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  profileFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  accountBadge: {
    backgroundColor: colors.navyLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  accountBadgeText: {
    color: colors.gold,
    fontSize: 11.5,
    fontWeight: '700',
  },
  memberLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 5,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconFav: { backgroundColor: '#FEE2E2' },
  statIconListings: { backgroundColor: '#EFF6FF' },
  statIconRecent: { backgroundColor: '#FEF3C7' },
  statVal: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.navy,
  },
  statLbl: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addMiniBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  emptyListingsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyListingsText: {
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  myListingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  myListingInfo: { flex: 1 },
  myListingTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 3,
  },
  myListingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  myListingMeta: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  myListingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pendingPill: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pendingPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E',
  },
  iconInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  iconInputField: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.navy,
  },
  logoutFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  logoutFullText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.danger,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  typeChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeChipTextActive: {
    color: colors.gold,
  },
});
