import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

const CARD_GAP = 10;

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
    height: '90%',
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
  label: {
    fontSize: 14,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  closeButton: {
    padding: 4,
  },
  stepContainer: {
    flex: 1,
    maxHeight: '100%',
  },

  // ─── Step 1: Service Grid ──────────────────────────────────
  serviceStep: {
    flex: 1,
  },
  serviceList: {
    flex: 1,
  },
  serviceGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  serviceCard: {
    flex: 1,
    aspectRatio: 0.88,
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
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 32,
  },
  serviceCardName: {
    fontSize: 13,
    fontFamily: FONT.medium,
    color: COLORS.white,
    lineHeight: 17,
  },
  serviceCardPrice: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 3,
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
  selectedServiceChip: {
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
