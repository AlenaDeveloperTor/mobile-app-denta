export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  image_url: string;
  description: string;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  /** Запасной цвет фона слайда, если картинка не загрузилась (опционально) */
  bg_color?: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  button_text: string;
}
