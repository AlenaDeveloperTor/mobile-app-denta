import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS } from '@/constants/theme';

export const styles = StyleSheet.create({
  /** Обёртка — нужна для задания borderRadius на TouchableOpacity */
  button: {
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  /** Внутренний слой для Primary (LinearGradient) */
  primaryInner: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: RADIUS.pill,
  },
  /** Внутренний слой для Secondary */
  secondary: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    color: COLORS.dark,
    fontSize: 16,
    fontFamily: FONT.medium,
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: COLORS.dark,
    fontFamily: FONT.medium,
  },
});
