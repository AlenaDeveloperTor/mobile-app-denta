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
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: 24,
    ...SHADOW.medium,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: FONT.medium,
    textAlign: 'center',
    color: COLORS.dark,
    marginBottom: 4,
  },
  promoTitle: {
    fontSize: 19,
    fontFamily: FONT.medium,
    textAlign: 'center',
    color: COLORS.blue,
    marginVertical: 16,
  },
  promoDescription: {
    fontSize: 14,
    fontFamily: FONT.regular,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
});
