import type { Banner, Promo, Service } from '@/types/service';
import { api } from './client';

export const servicesAPI = {
  getServices: () => api.get<Service[]>('/services'),
  getBanners: () => api.get<Banner[]>('/banners'),
  getPromos: () => api.get<Promo[]>('/promos'),
};
