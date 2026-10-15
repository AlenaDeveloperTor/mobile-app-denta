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
  checkboxContainer: {
    marginTop: 4,
    marginBottom: 20,
  },
  policyText: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.dark,
    lineHeight: 18,
  },
  policyLink: {
    fontFamily: FONT.medium,
    color: '#1E4A78',
    textDecorationLine: 'underline',
  },
});
