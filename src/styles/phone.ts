import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontFamily: FONT.medium,
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.dark,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginBottom: 28,
    textAlign: 'center',
  },
});
