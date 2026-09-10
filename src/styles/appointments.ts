import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS } from '@/constants/theme';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginTop: 14,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONT.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});
