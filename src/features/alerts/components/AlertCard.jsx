import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../shared/components';
import { ALERT_TYPE_LABEL, SEVERITY_LABEL } from '../../../shared/constants/clinical';
import { colors, fonts, risk, spacing } from '../../../shared/constants/theme';
import { formatRelative } from '../../../shared/utils/formatters';

const SEVERITY_COLOR = {
  BAJA: risk.bajo,
  MEDIA: risk.medio,
  ALTA: risk.alto,
  CRITICA: risk.critico,
};

export const AlertCard = ({ alert, onMarkAsRead, onDismiss }) => {
  const color = SEVERITY_COLOR[alert.severity];

  return (
    <View style={[styles.card, !alert.isRead && { backgroundColor: `${color}10` }]}>
      <View style={[styles.bar, { backgroundColor: color }]} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Badge color={color}>{SEVERITY_LABEL[alert.severity]}</Badge>
          <Text style={styles.type}>{ALERT_TYPE_LABEL[alert.type] || alert.type}</Text>
        </View>
        <Text style={styles.time}>{formatRelative(alert.createdAt)}</Text>
        <Text style={styles.message}>{alert.message}</Text>
        <View style={styles.actions}>
          {!alert.isRead && (
            <Pressable onPress={() => onMarkAsRead(alert._id)}>
              <Text style={styles.action}>Marcar como leída</Text>
            </Pressable>
          )}
          <Pressable onPress={() => onDismiss(alert._id)}>
            <Text style={styles.action}>Descartar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  bar: {
    width: 6,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  type: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.ink,
  },
  time: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  action: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.lamplight700,
  },
});
