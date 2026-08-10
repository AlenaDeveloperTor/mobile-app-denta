export interface User {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  email?: string;
  loyalty_balance: number;
  created_at?: string;
}

/** Пара токенов (access + refresh) */
export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

/** Ответ на успешную авторизацию/верификацию */
export interface AuthResponse extends TokenPair {
  token_type: string;
  user: User;
}

/** Статус запроса кода: код уже отправлен в MAX или нужно перейти в MAX по диплинку */
export type CodeRequestStatus = 'sent_to_max' | 'need_redirect';

/** Ответ на запрос кода подтверждения */
export interface CodeRequestResponse {
  /** Идентификатор сессии — нужен для подтверждения кода */
  session_id: string;
  status: CodeRequestStatus;
  /** Сообщение для пользователя */
  message?: string;
  /** Диплинк на бота в MAX (может быть null) */
  deep_link?: string | null;
}

/** Стандартизированные коды ошибок авторизации */
export type AuthErrorCode = 'INVALID_CODE' | 'SESSION_NOT_FOUND';
