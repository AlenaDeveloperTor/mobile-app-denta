import { Dimensions, StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  carouselWrapper: {
    marginVertical: 10,
  },
  carousel: {
    height: 210,
  },
  bannerSlide: {
    width: width - 40,
    height: 210,
    marginHorizontal: 20,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 41, 51, 0.52)',
    justifyContent: 'center',
    padding: 22,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 26,
    fontFamily: FONT.medium,
    color: COLORS.white,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  bannerSubtitle: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 14,
  },
  bannerButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: COLORS.dark,
    fontFamily: FONT.medium,
    fontSize: 13,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
