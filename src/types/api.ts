/** Стандартная обёртка ответа API */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Пагинированный ответ API */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

/** Структура ошибки API */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}
