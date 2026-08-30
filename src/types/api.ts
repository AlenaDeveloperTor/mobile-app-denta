/** Стандартная обёртка ответа API */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Пагинированный ответ API */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/** Структура ошибки API */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
