import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

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
    padding: 24,
    ...SHADOW.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT.medium,
    marginBottom: 8,
    color: COLORS.dark,
  },
  serviceList: {
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(170,198,238,0.4)',
    borderRadius: RADIUS.block,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#FAFCFF',
  },
  serviceItemSelected: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.blueTint,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 8,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 2,
  },
  serviceMeta: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONT.regular,
    fontSize: 12,
    marginBottom: 8,
  },
  cancelButton: {
    marginTop: 10,
  },
});
