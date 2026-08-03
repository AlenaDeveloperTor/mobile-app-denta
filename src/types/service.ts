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
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  button_text: string;
}
