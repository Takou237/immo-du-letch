/**
 * MessagesScreen — IMMO DU LETCH Mobile
 * Boîte de messages : vide par défaut, prête à brancher une API de messagerie.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  MessageSquare,
  Search,
  ChevronRight,
} from 'lucide-react-native';
import { colors, spacing } from '../theme';
import { useLang } from '../i18n/LangContext';

interface ConversationItem {
  id: string;
  senderName: string;
  listingTitle: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

/** Données de démo */
const DEMO_CONVERSATIONS: ConversationItem[] = [
  {
    id: '1',
    senderName: 'Paul Mbarga',
    listingTitle: 'Villa à Bastos',
    lastMessage: 'Bonjour, est-ce que le bien est toujours disponible ?',
    time: '10:32',
    unread: true,
  },
  {
    id: '2',
    senderName: 'Agence Immobilière Top',
    listingTitle: 'Appartement Bonapriso',
    lastMessage: "Oui, vous pouvez visiter demain à partir de 9h.",
    time: 'Hier',
    unread: false,
  },
  {
    id: '3',
    senderName: 'Marie Nkama',
    listingTitle: 'Terrain Omnisport',
    lastMessage: "Le prix est négociable, appelez-moi.",
    time: 'Lun.',
    unread: false,
  },
];

function ConversationRow({ item }: { item: ConversationItem }) {
  return (
    <TouchableOpacity style={styles.convRow} activeOpacity={0.75}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.senderName.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Contenu */}
      <View style={styles.convContent}>
        <View style={styles.convHeader}>
          <Text style={[styles.convName, item.unread && styles.convNameBold]} numberOfLines={1}>
            {item.senderName}
          </Text>
          <Text style={styles.convTime}>{item.time}</Text>
        </View>
        <Text style={styles.convListing} numberOfLines={1}>
          {item.listingTitle}
        </Text>
        <Text
          style={[styles.convPreview, item.unread && styles.convPreviewBold]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Badge non lu + chevron */}
      <View style={styles.convRight}>
        {item.unread && <View style={styles.unreadDot} />}
        <ChevronRight color={colors.textMuted} size={16} />
      </View>
    </TouchableOpacity>
  );
}

function EmptyInbox({ label }: { label: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <MessageSquare color={colors.gold} size={40} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>{label}</Text>
      <Text style={styles.emptySub}>
        Vos conversations avec les vendeurs et acheteurs apparaîtront ici.
      </Text>
    </View>
  );
}

const renderConversation = ({ item }: { item: ConversationItem }) => (
  <ConversationRow item={item} />
);

const SeparatorMsg = () => <View style={styles.separator} />;

export function MessagesScreen() {
  const { t } = useLang();
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const filtered = DEMO_CONVERSATIONS.filter(c =>
    c.senderName.toLowerCase().includes(query.toLowerCase()) ||
    c.listingTitle.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.header.messages}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchRow}>
        <Search color={colors.textMuted} size={16} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une conversation…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderConversation}
        ListEmptyComponent={<EmptyInbox label="Aucun message" />}
        contentContainerStyle={filtered.length === 0 ? styles.listEmpty : undefined}
        ItemSeparatorComponent={SeparatorMsg}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  headerSpacer: { width: 40 },

  // ── Search ──────────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { marginRight: 2 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.navy,
    padding: 0,
  },

  // ── Conversation row ────────────────────────────────────
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  convContent: { flex: 1 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  convName: { fontSize: 14, color: colors.navy, fontWeight: '500' },
  convNameBold: { fontWeight: '700' },
  convTime: { fontSize: 12, color: colors.textMuted },
  convListing: { fontSize: 11, color: colors.gold, fontWeight: '600', marginBottom: 2 },
  convPreview: { fontSize: 13, color: colors.textMuted },
  convPreviewBold: { color: colors.navy, fontWeight: '600' },
  convRight: { alignItems: 'center', gap: 4 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 70 },

  // ── Empty ───────────────────────────────────────────────
  listEmpty: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
