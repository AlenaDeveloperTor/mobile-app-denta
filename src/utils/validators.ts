import { normalizePhone } from './formatters';

/** Проверяет корректность номера телефона (РФ: +7XXXXXXXXXX) */
export function isValidPhone(phone: string): boolean {
  return /^\+7\d{10}$/.test(normalizePhone(phone));
}

/** Проверяет, что имя не пустое и не короче 2 символов */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

/** Проверяет код подтверждения (4-6 цифр) */
export function isValidCode(code: string): boolean {
  return /^\d{4,6}$/.test(code.trim());
}

/** Проверяет email по простому правилу */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
