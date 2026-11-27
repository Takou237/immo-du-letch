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
} from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { AccountType } from '../providers/AuthProvider';
import { useFavorites } from '../hooks/useFavorites';
import { useListings } from '../hooks/useListings';
import { useLang } from '../i18n/LangContext';
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
  const { favorites } = useFavorites();
  const { localListings } = useListings();

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

  // ── ÉCRAN CONNECTÉ (ESPACE PERSONNEL) ──
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>{t.header.profile}</Text>
        <TouchableOpacity style={styles.logoutIconBtn} onPress={logout}>
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
        <View style={styles.profileBanner}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.accountBadge}>
              <Text style={styles.accountBadgeText}>
                {accountTypeLabels[user.accountType][lang]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Favorites' })}
          >
            <Heart size={18} color={colors.navy} />
            <Text style={styles.statVal}>{favorites.length}</Text>
            <Text style={styles.statLbl}>{t.nav.favorites}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Sell' })}
          >
            <FileText size={18} color={colors.navy} />
            <Text style={styles.statVal}>{localListings.length}</Text>
            <Text style={styles.statLbl}>{t.sell.myListings}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            {lang === 'fr' ? 'Informations du compte' : 'Account details'}
          </Text>

          <Text style={styles.fieldLabel}>{lang === 'fr' ? 'Nom' : 'Name'}</Text>
          <TextInput
            style={styles.input}
            value={editName || user.name}
            onChangeText={setEditName}
          />

          <Text style={styles.fieldLabel}>{lang === 'fr' ? 'Téléphone' : 'Phone'}</Text>
          <TextInput
            style={styles.input}
            value={editPhone || user.phone}
            onChangeText={setEditPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.fieldLabel}>{lang === 'fr' ? 'Type de compte' : 'Account type'}</Text>
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

          <TouchableOpacity style={styles.submitGoldBtn} onPress={handleSaveProfile}>
            <Check size={16} color={colors.navy} />
            <Text style={styles.submitGoldText}>{t.common.save}</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: colors.textOnNavy,
    fontSize: 18,
    fontWeight: '800',
  },
  userEmail: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
  },
  accountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.navyLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  accountBadgeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
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
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  statLbl: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
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
