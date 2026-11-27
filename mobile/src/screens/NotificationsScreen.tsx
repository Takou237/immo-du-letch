/**
 * NotificationsScreen — IMMO DU LETCH Mobile
 * Centre de notifications : lorsqu'une notification est lue, elle disparaît
 * et met à jour le badge sur Paramètres et la cloche.
 */
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
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
import { useNotifications } from '../hooks/useNotifications';
import { NotifItem, NotifType } from '../providers/NotificationsProvider';

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
    case 'price':    return '#FEF3C7';
    case 'favorite': return '#FEE2E2';
    case 'message':  return '#EFF6FF';
    case 'new':      return '#D1FAE5';
  }
}

function NotifRow({ item, onRead }: { item: NotifItem; onRead: (id: string) => void }) {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.75}
      onPress={() => onRead(item.id)}
    >
      <View style={[styles.iconBox, { backgroundColor: notifIconBg(item.type) }]}>
        {notifIcon(item.type)}
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowHeader}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowTime}>{item.time}</Text>
        </View>
        <Text style={styles.rowBody} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
      <View style={styles.unreadDot} />
    </TouchableOpacity>
  );
}

function EmptyNotifs({ isFr }: { isFr: boolean }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Bell color={colors.gold} size={40} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>
        {isFr ? 'Aucune notification' : 'No notifications'}
      </Text>
      <Text style={styles.emptySub}>
        {isFr
          ? 'Vous êtes à jour. Vos prochaines alertes prix et nouveaux biens apparaîtront ici.'
          : 'You are all caught up. Price alerts and new listings will appear here.'}
      </Text>
    </View>
  );
}

const SeparatorNotif = () => <View style={styles.separator} />;

export function NotificationsScreen() {
  const { lang, t } = useLang();
  const isFr = lang === 'fr';
  const navigation = useNavigation();
  const { notifications, markReadAndRemove, clearAll } = useNotifications();

  const renderNotif = useCallback(
    ({ item }: { item: NotifItem }) => (
      <NotifRow item={item} onRead={markReadAndRemove} />
    ),
    [markReadAndRemove],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.header.notifications}</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={clearAll} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>
              {isFr ? 'Tout lire' : 'Read all'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.markAllSpacer} />
        )}
      </View>

      {/* Liste */}
      <View style={styles.body}>
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotif}
          ListEmptyComponent={<EmptyNotifs isFr={isFr} />}
          contentContainerStyle={notifications.length === 0 ? styles.listEmpty : undefined}
          ItemSeparatorComponent={SeparatorNotif}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  body: { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  markAllBtn: { paddingHorizontal: 4, minWidth: 64, alignItems: 'flex-end' },
  markAllText: { color: colors.gold, fontSize: 13, fontWeight: '600' },
  markAllSpacer: { minWidth: 64 },

  // ── Row ─────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: 12,
  },
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
  rowTitle: { fontSize: 14, color: colors.navy, fontWeight: '700', flex: 1 },
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
    paddingTop: 60,
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
