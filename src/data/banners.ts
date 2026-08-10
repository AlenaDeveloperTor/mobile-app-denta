import type { Banner } from '@/types/service';

/**
 * Баннеры-заглушки для карусели на главном экране.
 *
 * Используются, когда API ещё не вернул баннеры (GET /banners).
 * Как добавить баннеры:
 *  1) Через бэкенд — создайте записи в таблице/коллекции баннеров,
 *     они придут в поле `banners` на главном экране.
 *  2) Локально — отредактируйте этот массив (или добавьте сюда новые объекты).
 *
 * `bg_color` — запасной цвет фона слайда, если картинка `image_url`
 * ещё не загрузилась или недоступна.
 */
export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'Скидка 20% на имплантацию',
    subtitle: 'Только до конца месяца',
    image_url: 'https://picsum.photos/seed/denta-imp/800/400',
    button_text: 'Записаться',
    bg_color: '#0A7DFF',
  },
  {
    id: 'banner-2',
    title: 'Бесплатная диагностика',
    subtitle: 'При первом визите — КТ и 3D-снимок в подарок',
    image_url: 'https://picsum.photos/seed/denta-ct/800/400',
    button_text: 'Записаться',
    bg_color: '#2E7D32',
  },
  {
    id: 'banner-3',
    title: 'Детская стоматология',
    subtitle: 'Бережный приём и игровая комната',
    image_url: 'https://picsum.photos/seed/denta-kid/800/400',
    button_text: 'Записаться',
    bg_color: '#FF6B35',
  },
];
