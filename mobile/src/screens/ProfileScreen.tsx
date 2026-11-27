/**
 * ProfileScreen — Connexion / Inscription & Espace personnel (aligné sur AuthModal + MobileProfilePage du web).
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  LogOut,
  Check,
  Heart,
  Bookmark,
  FileText,
  Shield,
} from 'lucide-react-native';

import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';
import { AccountType } from '../providers/AuthProvider';
import { useFavorites } from '../hooks/useFavorites';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { useListings } from '../hooks/useListings';
import { useLang } from '../i18n/LangContext';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { lang, t } = useLang();
  const { user, loginWithEmail, registerWithEmail, loginWithDemo, updateProfile, logout } = useAuth();
  const { favorites } = useFavorites();
  const { savedSearches } = useSavedSearches();
  const { localListings } = useListings();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+237 ');
  const [regAccountType, setRegAccountType] = useState<AccountType>('particulier');
  const [regAgencyName, setRegAgencyName] = useState('');

  // Édition profil connecté
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editPhone, setEditPhone] = useState(user?.phone ?? '');
  const [editType, setEditType] = useState<AccountType>(user?.accountType ?? 'particulier');

  const accountTypeLabels: Record<AccountType, { fr: string; en: string }> = {
    particulier:       { fr: 'Particulier',         en: 'Individual' },
    agence:            { fr: 'Agence immobilière',  en: 'Real estate agency' },
    agent_independant: { fr: 'Agent indépendant',   en: 'Independent agent' },
  };

  const handleLogin = () => {
    if (!email.includes('@') || password.length < 6) {
      Alert.alert(
        lang === 'fr' ? 'Connexion invalide' : 'Invalid login',
        lang === 'fr'
          ? 'Saisissez un e-mail valide et un mot de passe (min. 6 caractères).'
          : 'Enter a valid email and password (min. 6 characters).',
      );
      return;
    }
    loginWithEmail(email);
  };

  const handleRegister = () => {
    if (!regName.trim() || !email.includes('@') || password.length < 6) {
      Alert.alert(
        lang === 'fr' ? 'Champs requis' : 'Required fields',
        lang === 'fr'
          ? 'Nom complet, e-mail valide et mot de passe (min. 6 caractères) requis.'
          : 'Full name, valid email and password (min. 6 characters) required.',
      );
      return;
    }
    registerWithEmail({
      name: regName,
      email,
      phone: regPhone,
      accountType: regAccountType,
      agencyName: regAccountType === 'agence' ? regAgencyName : undefined,
    });
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      accountType: editType,
    });
    Alert.alert(
      lang === 'fr' ? 'Profil mis à jour' : 'Profile updated',
      lang === 'fr'
        ? 'Vos informations locales ont été enregistrées.'
        : 'Your local information has been saved.',
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {user ? t.header.profile : t.header.login}
        </Text>
        {user ? (
          <TouchableOpacity style={styles.logoutIconBtn} onPress={logout}>
            <LogOut size={18} color={colors.danger} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!user ? (
          <View>
            <View style={styles.introCard}>
              <Shield size={32} color={colors.gold} />
              <Text style={styles.introTitle}>
                {lang === 'fr' ? 'Espace personnel IMMO DU LETCH' : 'IMMO DU LETCH Personal Space'}
              </Text>
              <Text style={styles.introSub}>
                {lang === 'fr'
                  ? 'Mode local hors-ligne : gérez votre profil, votre type de compte et vos annonces.'
                  : 'Local offline mode: manage your profile, account type, and listings.'}
              </Text>
            </View>

            {/* Onglets Connexion / Inscription */}
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.modeTabText, mode === 'login' && styles.modeTabTextActive]}>
                  {lang === 'fr' ? 'Se connecter' : 'Sign in'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'register' && styles.modeTabActive]}
                onPress={() => setMode('register')}
              >
                <Text style={[styles.modeTabText, mode === 'register' && styles.modeTabTextActive]}>
                  {lang === 'fr' ? 'Créer un compte' : 'Sign up'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formCard}>
              {mode === 'register' && (
                <>
                  <Text style={styles.label}>{lang === 'fr' ? 'Nom complet *' : 'Full name *'}</Text>
                  <TextInput
                    style={styles.input}
                    value={regName}
                    onChangeText={setRegName}
                    placeholder="Ken Daniel"
                    placeholderTextColor={colors.textMuted}
                  />

                  <Text style={styles.label}>{lang === 'fr' ? 'Type de compte' : 'Account type'}</Text>
                  <View style={styles.typeGrid}>
                    {(['particulier', 'agence', 'agent_independant'] as AccountType[]).map(at => (
                      <TouchableOpacity
                        key={at}
                        style={[styles.typeChip, regAccountType === at && styles.typeChipActive]}
                        onPress={() => setRegAccountType(at)}
                      >
                        {at === 'particulier' && (
                          <User size={13} color={regAccountType === at ? colors.gold : colors.textSecondary} />
                        )}
                        {at === 'agence' && (
                          <Building2 size={13} color={regAccountType === at ? colors.gold : colors.textSecondary} />
                        )}
                        {at === 'agent_independant' && (
                          <Briefcase size={13} color={regAccountType === at ? colors.gold : colors.textSecondary} />
                        )}
                        <Text
                          style={[
                            styles.typeChipText,
                            regAccountType === at && styles.typeChipTextActive,
                          ]}
                        >
                          {lang === 'fr' ? accountTypeLabels[at].fr : accountTypeLabels[at].en}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {regAccountType === 'agence' && (
                    <>
                      <Text style={styles.label}>{lang === 'fr' ? "Nom de l'agence" : 'Agency name'}</Text>
                      <TextInput
                        style={styles.input}
                        value={regAgencyName}
                        onChangeText={setRegAgencyName}
                        placeholder="Prestige Immo Cameroun"
                        placeholderTextColor={colors.textMuted}
                      />
                    </>
                  )}

                  <Text style={styles.label}>{lang === 'fr' ? 'Téléphone' : 'Phone'}</Text>
                  <TextInput
                    style={styles.input}
                    value={regPhone}
                    onChangeText={setRegPhone}
                    keyboardType="phone-pad"
                    placeholder="+237 6XX XXX XXX"
                    placeholderTextColor={colors.textMuted}
                  />
                </>
              )}

              <Text style={styles.label}>E-mail *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="nom@exemple.cm"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.label}>{lang === 'fr' ? 'Mot de passe *' : 'Password *'}</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••"
                placeholderTextColor={colors.textMuted}
              />

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={mode === 'login' ? handleLogin : handleRegister}
              >
                <Text style={styles.primaryBtnText}>
                  {mode === 'login'
                    ? (lang === 'fr' ? 'Se connecter' : 'Sign in')
                    : (lang === 'fr' ? 'Créer mon compte' : 'Create account')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => loginWithDemo('Ken Daniel', 'ken.daniel@gmail.com', 'agence')}
              >
                <Text style={styles.demoBtnText}>
                  {lang === 'fr' ? 'Accès démo rapide (Ken Daniel)' : 'Quick demo login (Ken Daniel)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {/* Carte utilisateur */}
            <View style={styles.profileBanner}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.accountBadge}>
                  <Text style={styles.accountBadgeText}>
                    {lang === 'fr'
                      ? accountTypeLabels[user.accountType].fr
                      : accountTypeLabels[user.accountType].en}
                  </Text>
                </View>
              </View>
            </View>

            {/* Statistiques */}
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
                onPress={() => navigation.navigate('MainTabs', { screen: 'MySearches' })}
              >
                <Bookmark size={18} color={colors.navy} />
                <Text style={styles.statVal}>{savedSearches.length}</Text>
                <Text style={styles.statLbl}>{t.nav.mySearches}</Text>
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

            {/* Édition */}
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>
                {lang === 'fr' ? 'Informations du compte' : 'Account details'}
              </Text>

              <Text style={styles.label}>{lang === 'fr' ? 'Nom' : 'Name'}</Text>
              <TextInput
                style={styles.input}
                value={editName || user.name}
                onChangeText={setEditName}
              />

              <Text style={styles.label}>{lang === 'fr' ? 'Téléphone' : 'Phone'}</Text>
              <TextInput
                style={styles.input}
                value={editPhone || user.phone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>{lang === 'fr' ? 'Type de compte' : 'Account type'}</Text>
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
                      {lang === 'fr' ? accountTypeLabels[at].fr : accountTypeLabels[at].en}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveProfile}>
                <Check size={16} color={colors.navy} />
                <Text style={styles.primaryBtnText}>{t.common.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  introCard: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  introTitle: {
    color: colors.textOnNavy,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  introSub: {
    color: '#CBD5E1',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modeTab: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeTabTextActive: {
    color: colors.gold,
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
  label: {
    fontSize: 12,
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 18,
  },
  primaryBtnText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '800',
  },
  demoBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 10,
  },
  demoBtnText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '700',
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
});
