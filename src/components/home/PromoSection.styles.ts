import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

export const styles = StyleSheet.create({
  promoSection: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  promoCard: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.card,
    padding: 18,
    marginBottom: 12,
    ...SHADOW.medium,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontFamily: FONT.medium,
    color: COLORS.white,
    marginBottom: 6,
  },
  promoDescription: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.72)',
    marginBottom: 14,
    lineHeight: 20,
  },
  promoButton: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  promoButtonText: {
    color: COLORS.blue,
    fontFamily: FONT.medium,
    fontSize: 13,
  },
});
