/** Форматирует число как цену в рублях */
export function formatPrice(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

/** Форматирует длительность услуги в минутах */
export function formatDuration(minutes: number): string {
  return `${minutes} мин`;
}

/** Форматирует ISO-дату в «дд.мм.гггг» */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString('ru-RU');
}

/** Форматирует ISO-дату в «дд.мм.гггг, чч:мм» */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Приводит телефон к единому виду: +7XXXXXXXXXX */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  return phone;
}

/**
 * Форматирует телефон при вводе.
 * Правила: только цифры, максимум 10 цифр, автоматически подставляется префикс +7.
 * Примеры: "9991234567" → "+7 (999) 123-45-67"
 */
export function formatPhoneInput(input: string): string {
  // 1) Оставляем только цифры
  let digits = input.replace(/\D/g, '');

  // 2) Отбрасываем ведущий код страны (8 или 7) — префикс +7 подставляется сам
  if (digits.length > 1 && (digits.startsWith('8') || digits.startsWith('7'))) {
    digits = digits.slice(1);
  } else if (digits === '7' || digits === '8') {
    digits = '';
  }

  // 3) Ограничиваем до 10 цифр
  digits = digits.slice(0, 10);

  // 4) Маска: +7 (XXX) XXX-XX-XX
  let formatted = '+7';
  if (digits.length > 0) {
    formatted += ` (${digits.slice(0, 3)}`;
  }
  if (digits.length >= 4) {
    formatted += `) ${digits.slice(3, 6)}`;
  }
  if (digits.length >= 7) {
    formatted += `-${digits.slice(6, 8)}`;
  }
  if (digits.length >= 9) {
    formatted += `-${digits.slice(8, 10)}`;
  }
  return formatted;
}

