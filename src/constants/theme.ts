/**
 * Дизайн-токены бренда labsmile
 * Источник: Руководство по фирменному стилю, страница «Цвет»
 *
 * Точные HEX из брендбука:
 *   #FFFFFF  — белый        (CMYK 0 0 0 0)
 *   #172933  — тёмно-синий  (CMYK 80 50 35 67)
 *   #000000  — чёрный       (CMYK 0 0 0 100)
 *   #AAC6EE  — голубой      (CMYK 36 16 0 0) — начало градиента
 *   #D0C8B5  — бежевый      (CMYK 18 16 25 0) — конец градиента
 */

export const COLORS = {
  /** Основной тёмный — фоны, заголовки, иконки на светлом */
  dark: '#172933',

  /** Чёрный — для вторичного текста при необходимости */
  black: '#000000',

  /** Белый — фон карточек, текст на тёмном */
  white: '#FFFFFF',

  /** Пудрово-голубой — акцент, начало диагонального градиента */
  blue: '#AAC6EE',

  /** Бежевый тёплый — конец диагонального градиента */
  beige: '#D0C8B5',

  /** Производные / вспомогательные */
  /** Светло-голубой — лёгкие фоны, unread-карточки */
  blueTint: '#E4EEF8',

  /** Текстовый серый — вторичный текст, подписи */
  textSecondary: '#6B7A8F',

  /** Фон приложения — почти белый с холодным оттенком */
  background: '#F5F8FC',

  /** Ошибка — сохраняем семантический красный */
  error: '#D32F2F',
  errorBg: '#FFEBEE',
} as const;

/** Диагональный градиент голубой → бежевый */
export const GRADIENT = {
  /** Направление (LinearGradient start/end) — 135° */
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  /** Цвета */
  colors: [COLORS.blue, COLORS.beige] as [string, string],
} as const;

export const RADIUS = {
  /** pill-форма для маленьких кнопок и бейджей */
  pill: 50,
  /** крупные карточки */
  card: 20,
  /** стандартные блоки */
  block: 16,
  /** небольшие элементы */
  sm: 12,
  /** поля ввода */
  input: 14,
} as const;

export const FONT = {
  medium: 'Montserrat-Medium',
  regular: 'Montserrat-Regular',
} as const;

export const SHADOW = {
  soft: {
    shadowColor: '#172933',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  medium: {
    shadowColor: '#172933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
