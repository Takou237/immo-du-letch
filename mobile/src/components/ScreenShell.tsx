import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

interface ScreenShellProps {
  title: string;
  subtitle: string;
}

export function ScreenShell({ title, subtitle }: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>IDL • IMMO DU LETCH</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  brand: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.navy,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
