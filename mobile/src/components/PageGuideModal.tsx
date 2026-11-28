/**
 * PageGuideModal — Guide interactif par étapes pour expliquer chaque bouton d'une page.
 * Se ferme en cliquant sur Passer, Terminer, ou en dehors de la carte.
 */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { HelpCircle, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { colors } from '../theme';
import { useLang } from '../i18n/LangContext';

export interface GuideStep {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface PageGuideModalProps {
  visible: boolean;
  pageTitle: string;
  steps: GuideStep[];
  onClose: () => void;
}

export function PageGuideModal({
  visible,
  pageTitle,
  steps,
  onClose,
}: PageGuideModalProps) {
  const { lang } = useLang();
  const isFr = lang === 'fr';
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (visible) setIndex(0);
  }, [visible]);

  if (!visible || steps.length === 0) return null;

  const step = steps[index] ?? steps[0];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          {/* En-tête */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <HelpCircle size={13} color={colors.navy} />
              <Text style={styles.badgeText}>
                {isFr ? 'GUIDE' : 'GUIDE'} · {pageTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Icône + Contenu de l'étape */}
          <View style={styles.body}>
            <View style={styles.iconCircle}>
              {step.icon ?? <HelpCircle size={26} color={colors.navy} />}
            </View>
            <Text style={styles.stepCounter}>
              {isFr ? `Étape ${index + 1} sur ${steps.length}` : `Step ${index + 1} of ${steps.length}`}
            </Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.description}</Text>
          </View>

          {/* Indicateurs (points) */}
          <View style={styles.dotsRow}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>

          {/* Actions bas */}
          <View style={styles.footer}>
            {isFirst ? (
              <TouchableOpacity onPress={onClose} style={styles.skipBtn}>
                <Text style={styles.skipText}>
                  {isFr ? 'Passer' : 'Skip'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setIndex(i => Math.max(0, i - 1))}
                style={styles.prevBtn}
              >
                <ChevronLeft size={16} color={colors.navy} />
                <Text style={styles.prevText}>
                  {isFr ? 'Précédent' : 'Back'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => {
                if (isLast) {
                  onClose();
                } else {
                  setIndex(i => Math.min(steps.length - 1, i + 1));
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.nextText}>
                {isLast
                  ? (isFr ? 'Compris !' : 'Got it!')
                  : (isFr ? 'Suivant' : 'Next')}
              </Text>
              {!isLast && <ChevronRight size={16} color={colors.navy} />}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 31, 73, 0.58)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.navy,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepCounter: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 13.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    marginBottom: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.gold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  skipText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  prevText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.navy,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 12,
  },
  nextText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.navy,
  },
});
