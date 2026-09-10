import { StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SHADOW } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  name: {
    fontSize: 22,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    letterSpacing: 0.2,
  },
  phone: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },

  // ── Кнопка редактировать профиль ──────────────────────────────────────
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blueTint,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginBottom: 20,
    gap: 6,
  },
  editProfileBtnText: {
    fontSize: 13,
    fontFamily: FONT.medium,
    color: COLORS.dark,
  },

  // ── Форма редактирования ───────────────────────────────────────────────
  editForm: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: 20,
    marginBottom: 16,
    ...SHADOW.soft,
  },
  editFormTitle: {
    fontSize: 16,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginBottom: 5,
    marginTop: 10,
  },
  fieldInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: '#DDE4EF',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    fontFamily: FONT.regular,
    color: COLORS.dark,
  },
  fieldInputFocused: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.white,
  },
  editFormError: {
    color: COLORS.error,
    fontFamily: FONT.regular,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  editFormButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  editFormBtn: {
    flex: 1,
  },

  // ── Карточка бонусного баланса ─────────────────────────────────────────
  balanceCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.card,
    padding: 18,
    marginBottom: 16,
    ...SHADOW.medium,
  },
  balanceInfo: {
    marginLeft: 14,
    flex: 1,
  },
  balanceLabel: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: 'rgba(255,255,255,0.65)',
  },
  balanceValue: {
    fontSize: 22,
    fontFamily: FONT.medium,
    color: COLORS.white,
    marginTop: 2,
  },

  // ── История баллов ─────────────────────────────────────────────────────
  historySection: {
    width: '100%',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 10,
  },
  historyEmpty: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.block,
    padding: 14,
    marginBottom: 8,
    ...SHADOW.soft,
  },
  historyDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyDotPlus: {
    backgroundColor: '#E8F5E9',
  },
  historyDotMinus: {
    backgroundColor: '#FFEBEE',
  },
  historyReason: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.dark,
  },
  historyDate: {
    fontSize: 11,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 15,
    fontFamily: FONT.medium,
  },
  historyAmountPlus: {
    color: '#388E3C',
  },
  historyAmountMinus: {
    color: COLORS.error,
  },

  // ── Меню ──────────────────────────────────────────────────────────────
  menuItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.block,
    padding: 16,
    marginBottom: 14,
    ...SHADOW.soft,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLORS.dark,
    marginLeft: 12,
  },

  // ── Подтверждение выхода ───────────────────────────────────────────────
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 41, 51, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 10,
    elevation: 10,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: 24,
  },
  confirmTitle: {
    fontSize: 18,
    fontFamily: FONT.medium,
    color: COLORS.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontFamily: FONT.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmError: {
    color: COLORS.error,
    fontFamily: FONT.regular,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
  },
});
