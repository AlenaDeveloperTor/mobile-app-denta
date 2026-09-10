import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT.medium,
    marginBottom: 6,
    color: COLORS.dark,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: RADIUS.input,
    padding: 13,
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLORS.dark,
    backgroundColor: COLORS.background,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: FONT.regular,
    marginTop: 4,
  },
});
