import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  bannerCard: {
    width: '100%',
    height: 190,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.blueTint,
    ...SHADOW.medium,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 41, 51, 0.52)',
    justifyContent: 'flex-end',
    padding: 18,
  },
  bannerContent: {
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: FONT.medium,
    color: COLORS.white,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.88)',
    marginBottom: 12,
    lineHeight: 18,
  },
  bannerButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    ...SHADOW.soft,
  },
  bannerButtonText: {
    color: COLORS.dark,
    fontFamily: FONT.medium,
    fontSize: 13,
  },
});
