import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 15,
    fontFamily: FONT.medium,
    color: COLORS.dark,
  },
  timeText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  statusPending: {
    backgroundColor: COLORS.blueTint,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(170,198,238,0.3)',
  },
  statusCancelled: {
    backgroundColor: COLORS.errorBg,
  },
  statusCompleted: {
    backgroundColor: 'rgba(208,200,181,0.3)',
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: COLORS.dark,
  },
  body: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 4,
  },
  comment: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.errorBg,
  },
  cancelButtonText: {
    color: COLORS.error,
    fontFamily: FONT.medium,
    fontSize: 13,
  },
});
