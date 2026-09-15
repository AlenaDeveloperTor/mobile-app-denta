import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: COLORS.dark,
  },
  logoCircle: {
    width: 240,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontFamily: FONT.medium,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  slogan: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.blue,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: 'rgba(170,198,238,0.75)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  hint: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 20,
  },
});
