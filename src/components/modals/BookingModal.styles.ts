import { Dimensions, StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 10;
const CARD_HORIZONTAL_PADDING = 20; // padding inside modalCard on each side
const CARD_WIDTH = (SCREEN_WIDTH - 40 - CARD_HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  backdrop: {
    flex: 1,
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalPositioner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    ...SHADOW.medium,
  },

  // ─── Header ───────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },

  // ─── Step 1: Service Grid ──────────────────────────────────
  gridScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  serviceCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.15,
    borderRadius: RADIUS.block,
    overflow: 'hidden',
    backgroundColor: COLORS.blueTint,
    ...SHADOW.soft,
  },
  serviceCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  serviceCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 28,
  },
  serviceCardName: {
    fontSize: 13,
    fontFamily: FONT.medium,
    color: COLORS.white,
    lineHeight: 17,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
  },

  // ─── Step 2: Form ──────────────────────────────────────────
  formScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blueTint,
    borderRadius: RADIUS.block,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(170,198,238,0.5)',
  },
  chipImage: {
    width: 64,
    height: 64,
    resizeMode: 'cover',
  },
  chipInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipLabel: {
    fontSize: 11,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipName: {
    fontSize: 14,
    fontFamily: FONT.medium,
    color: COLORS.dark,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONT.regular,
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  cancelButton: {
    marginTop: 10,
  },
});
