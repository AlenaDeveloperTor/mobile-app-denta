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
