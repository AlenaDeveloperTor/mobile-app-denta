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
  confirmMessage: {
    fontSize: 15,
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginVertical: 18,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
