import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

export const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOW.soft,
  },
  serviceImage: {
    width: '100%',
    height: 140,
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 17,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    flex: 1,
    marginRight: 8,
  },
  servicePrice: {
    backgroundColor: COLORS.blueTint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  servicePriceText: {
    color: COLORS.dark,
    fontFamily: FONT.medium,
    fontSize: 13,
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDurationText: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  bookingButton: {
    overflow: 'hidden',
    borderRadius: RADIUS.pill,
  },
  bookingButtonGradient: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingButtonText: {
    color: COLORS.dark,
    fontFamily: FONT.medium,
    fontSize: 13,
  },
});
