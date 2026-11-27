/**
 * NotificationsScreen — IMMO DU LETCH Mobile
 * Centre de notifications : alertes prix, nouveaux biens, messages.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Bell,
  Tag,
  Heart,
  MessageSquare,
  Home,
} from 'lucide-react-native';
import { colors, spacing } from '../theme';
import { useLang } from '../i18n/LangContext';

type NotifType = 'price' | 'favorite' | 'message' | 'new';

interface NotifItem {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const DEMO_NOTIFS: NotifItem[] = [
  {
    id: '1',
    type: 'price',
    title: 'Baisse de prix',
    body: 'La Villa à Bastos a baissé de 25 000 000 FCFA',
    time: "Il y a 2h",
    read: false,
  },
  {
    id: '2',
    type: 'new',
    title: 'Nouveau bien',
    body: '3 nouvelles annonces correspondent à votre alerte "Appartement Douala"',
    time: "Il y a 5h",
    read: false,
  },
  {
    id: '3',
    type: 'favorite',
    title: 'Favori consulté',
    body: 'Votre annonce favorite "Terrain à Omnisport" a été vue 42 fois',
    time: "Hier",
    read: true,
  },
  {
    id: '4',
    type: 'message',
    title: 'Nouveau message',
    body: 'Paul Mbarga vous a envoyé un message concernant "Villa Bastos"',
    time: "Hier",
    read: true,
  },
  {
    id: '5',
    type: 'price',
    title: 'Alerte prix',
    body: 'Un bien dans votre zone de recherche correspond à votre budget',
    time: "Lun.",
    read: true,
  },
];

function notifIcon(type: NotifType) {
  switch (type) {
    case 'price':
      return <Tag color={colors.gold} size={18} strokeWidth={2} />;
    case 'favorite':
      return <Heart color="#EF4444" size={18} strokeWidth={2} />;
    case 'message':
      return <MessageSquare color={colors.navy} size={18} strokeWidth={2} />;
    case 'new':
      return <Home color="#10B981" size={18} strokeWidth={2} />;
  }
}

function notifIconBg(type: NotifType): string {
  switch (type) {
    case 'price':     return '#FEF3C7';
    case 'favorite':  return '#FEE2E2';
    case 'message':   return '#EFF6FF';
    case 'new':       return '#D1FAE5';
  }
}

function NotifRow({ item, onRead }: { item: NotifItem; onRead: (id: string) => void }) {
  return (
    <TouchableOpacity
      style={[styles.row, !item.read && styles.rowUnread]}
      activeOpacity={0.75}
      onPress={() => onRead(item.id)}
    >
      <View style={[styles.iconBox, { backgroundColor: notifIconBg(item.type) }]}>
        {notifIcon(item.type)}
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowHeader}>
          <Text style={[styles.rowTitle, !item.read && styles.rowTitleBold]}>
            {item.title}
          </Text>
          <Text style={styles.rowTime}>{item.time}</Text>
        </View>
        <Text style={styles.rowBody} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

function EmptyNotifs() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Bell color={colors.gold} size={40} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>Aucune notification</Text>
      <Text style={styles.emptySub}>
        Vos alertes de prix, nouveaux biens et messages apparaîtront ici.
      </Text>
    </View>
  );
}

export function NotificationsScreen() {
  const { t } = useLang();
  const navigation = useNavigation();
  const [notifs, setNotifs] = useState<NotifItem[]>(DEMO_NOTIFS);

  const unreadCount = notifs.filter(n => !n.read).length;

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  const renderNotif = ({ item }: { item: NotifItem }) => (
    <NotifRow item={item} onRead={markRead} />
  );

  const SeparatorNotif = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.header.notifications}</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      {/* Badge compteur */}
      {unreadCount > 0 && (
        <View style={styles.countBar}>
          <Text style={styles.countText}>
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Liste */}
      <FlatList
        data={notifs}
        keyExtractor={item => item.id}
        renderItem={renderNotif}
        ListEmptyComponent={<EmptyNotifs />}
        contentContainerStyle={notifs.length === 0 ? styles.listEmpty : undefined}
        ItemSeparatorComponent={SeparatorNotif}
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
  markAllBtn: { paddingHorizontal: 4 },
  markAllText: { color: colors.gold, fontSize: 13, fontWeight: '600' },

  // ── Barre compteur ──────────────────────────────────────
  countBar: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B30',
  },
  countText: { color: '#92400E', fontSize: 13, fontWeight: '600' },

  // ── Row ─────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: 12,
  },
  rowUnread: { backgroundColor: '#F0F4FF' },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowContent: { flex: 1 },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  rowTitle: { fontSize: 14, color: colors.navy, fontWeight: '500', flex: 1 },
  rowTitleBold: { fontWeight: '700' },
  rowTime: { fontSize: 12, color: colors.textMuted, flexShrink: 0 },
  rowBody: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginTop: 4,
    flexShrink: 0,
  },
  separator: { height: 1, backgroundColor: colors.border },

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
