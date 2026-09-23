import type { Banner, Service } from '@/types/service';
import { api } from './client';

export const servicesAPI = {
  getServices: () => api.get<Service[]>('/services'),
  getBanners: () => api.get<Banner[]>('/banners'),
};
