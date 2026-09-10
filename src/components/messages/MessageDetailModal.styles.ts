import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 41, 51, 0.6)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: 24,
    ...SHADOW.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: COLORS.blueTint,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: FONT.medium,
    color: COLORS.dark,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: '#9AA5B4',
    marginBottom: 16,
  },
  bannerWrap: {
    borderRadius: RADIUS.block,
    overflow: 'hidden',
    marginBottom: 16,
    height: 160,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    fontSize: 15,
    fontFamily: FONT.regular,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  notFound: {
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
