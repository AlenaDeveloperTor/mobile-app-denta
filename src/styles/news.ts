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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#172933',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
