import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: 14,
    marginBottom: 10,
    ...SHADOW.soft,
  },
  cardUnread: {
    backgroundColor: COLORS.blueTint,
    borderWidth: 1,
    borderColor: COLORS.blue,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(170,198,238,0.2)',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: COLORS.dark,
    marginBottom: 2,
  },
  titleUnread: {
    fontFamily: FONT.medium,
  },
  body: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: '#9AA5B4',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.blue,
  },
});
