import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: COLORS.blue,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10,
  },
  boxChecked: {
    backgroundColor: COLORS.dark,
    borderColor: COLORS.dark,
  },
  boxError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },
  boxDisabled: {
    opacity: 0.5,
  },
  labelContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.dark,
    lineHeight: 18,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: FONT.regular,
    marginTop: 2,
    marginLeft: 32,
  },
});
