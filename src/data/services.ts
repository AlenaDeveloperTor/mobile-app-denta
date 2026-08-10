import type { Service } from '@/types/service';

/**
 * Демо-услуги для тестирования.
 *
 * Используются как запасной вариант, когда API (GET /services) ещё не вернул
 * услуги или недоступен — чтобы можно было посмотреть, как выглядит список
 * услуг в модалке записи.
 *
 * Как заменить на реальные данные:
 *  1) Через бэкенд — создайте записи в таблице/коллекции услуг,
 *     они придут в модалку записи автоматически.
 *  2) Локально — отредактируйте этот массив (или добавьте сюда новые объекты).
 */
export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'service-1',
    name: 'Консультация стоматолога',
    description: 'Осмотр, план лечения и консультация врача',
    price: 1500,
    duration: 30,
    image_url: 'https://picsum.photos/seed/denta-consult/400/300',
    is_active: true,
  },
  {
    id: 'service-2',
    name: 'Профессиональная гигиена полости рта',
    description: 'Ультразвуковая чистка, полировка, фторирование',
    price: 4000,
    duration: 60,
    image_url: 'https://picsum.photos/seed/denta-clean/400/300',
    is_active: true,
  },
  {
    id: 'service-3',
    name: 'Лечение кариеса',
    description: 'Лечение кариеса под анестезией с пломбированием',
    price: 3500,
    duration: 45,
    image_url: 'https://picsum.photos/seed/denta-caries/400/300',
    is_active: true,
  },
  {
    id: 'service-4',
    name: 'Отбеливание зубов',
    description: 'Профессиональное отбеливание на 2-3 тона',
    price: 12000,
    duration: 90,
    image_url: 'https://picsum.photos/seed/denta-white/400/300',
    is_active: true,
  },
  {
    id: 'service-5',
    name: 'Установка винира',
    description: 'Керамический винир на передний зуб',
    price: 18000,
    duration: 60,
    image_url: 'https://picsum.photos/seed/denta-veneer/400/300',
    is_active: true,
  },
  {
    id: 'service-6',
    name: 'Имплантация зуба',
    description: 'Установка имплантата с анестезией',
    price: 35000,
    duration: 120,
    image_url: 'https://picsum.photos/seed/denta-implant/400/300',
    is_active: true,
  },
];
