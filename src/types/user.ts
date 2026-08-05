export interface User {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  email?: string;
  loyalty_balance: number;
  created_at?: string;
}

/** Ответ на успешную авторизацию/верификацию */
export interface AuthResponse {
  token: string;
  user: User;
}

/** Ответ на запрос кода подтверждения */
export interface CodeRequestResponse {
  success: boolean;
  expires_in?: number;
  /** true — нужно сначала привязать телефон через бота в MAX */
  needs_link?: boolean;
  /** Ссылка на бота в MAX (deep link) */
  deep_link?: string;
}
