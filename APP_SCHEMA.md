# Denta — схема приложения (APP_SCHEMA)

> Документация по архитектуре, пользовательскому пути и подключению FCM.
> Стек: **Expo SDK 57**, **React Native 0.86.2**, **React 19.2.3**, **TypeScript ~6.0.3**, **expo-router**, **zustand**, **axios**.

---

## 1. Обзор архитектуры

Приложение построено на `expo-router` (файловая навигация) и разделено на слои:

```
mobile-app-denta/
├── app/                        # ЭКРАНЫ (роуты expo-router)
│   ├── _layout.tsx             # Корневой Stack + проверка авторизации
│   ├── modal.tsx               # Модальный экран (обёртка над ModalRenderer)
│   ├── appointment-success.tsx # Экран «Запись создана»
│   ├── (auth)/                 # Группа авторизации
│   │   ├── _layout.tsx
│   │   ├── phone.tsx           # Ввод телефона
│   │   ├── max-link.tsx        # Переход в MAX (диплинк на бота)
│   │   └── verify.tsx          # Ввод кода из MAX
│   └── (tabs)/                 # Основные вкладки
│       ├── _layout.tsx         # Tabs (4 вкладки)
│       ├── index.tsx           # Главная (услуги, баннеры, акции)
│       ├── appointments.tsx    # Мои записи
│       ├── news.tsx            # Новости
│       └── profile.tsx         # Профиль
├── src/
│   ├── api/                    # HTTP-слой (axios)
│   │   ├── client.ts           # Экземпляр axios + перехватчики (токен, auto-refresh при 401)
│   │   ├── auth.ts             # authAPI: requestCode / verifyCode / refresh / getProfile
│   │   ├── services.ts         # servicesAPI: услуги, баннеры, акции
│   │   ├── appointments.ts     # appointmentsAPI: список / создание / отмена
│   │   ├── loyalty.ts          # loyaltyAPI: баланс / история
│   │   └── push.ts             # pushAPI: регистрация push-токена
│   ├── components/
│   │   ├── home/               # BannerCarousel, ServiceCard, PromoSection
│   │   ├── common/             # Button, Input, Card, LoadingSpinner
│   │   ├── appointments/       # AppointmentCard
│   │   ├── modals/             # BookingModal, ConfirmModal, PromoModal + index (рендерер)
│   │   └── Themed.tsx          # Text/View с темой
│   ├── hooks/                  # useAppointments, useAuth, usePushNotifications
│   ├── store/                  # zustand: useAuthStore, useAppointmentStore, useLoyaltyStore
│   ├── types/                  # TS-типы: user, service, appointment, api (+ env.d.ts)
│   ├── utils/                  # storage, formatters, validators, constants
│   └── config/env.ts           # API_URL и др. из .env
└── .env                        # API_URL, MAX_BOT_DEEP_LINK, FCM_SENDER_ID
```

**Правило**: экраны (`app/`) только рендерят и передают данные; вся логика/API — в `src/`. Стили вынесены в отдельные файлы `*.styles.ts` рядом с компонентом/экраном.

---

## 2. Кто за что отвечает

| Файл / компонент | Ответственность |
|---|---|
| `app/_layout.tsx` | Корневой `Stack`. При старте вызывает `checkAuth()`, показывает спиннер пока `isLoading`. ⚠️ Редирект неавторизованного на `/(auth)/phone` ещё не реализован — TODO. |
| `app/(auth)/phone.tsx` | Ввод телефона → `requestCode(phone)`. При `status='need_redirect'` → `max-link`, иначе → `verify`. |
| `app/(auth)/max-link.tsx` | «Подтвердите номер в MAX»: диплинк на бота, «Продолжить» → `verify` (передаёт `session_id`). |
| `app/(auth)/verify.tsx` | Ввод кода из MAX → `verifyCode(session_id, code)` → `router.replace('/(tabs)')`. |
| `app/(tabs)/index.tsx` | Главная: приветствие, `BannerCarousel`, `PromoSection`, список `ServiceCard`. Данные через `servicesAPI`. |
| `app/(tabs)/appointments.tsx` | Список записей через хук `useAppointments`, пустые/ошибочные состояния, pull-to-refresh, отмена записи. |
| `app/(tabs)/news.tsx` | Лента новостей (сейчас статический массив). |
| `app/(tabs)/profile.tsx` | Профиль: имя/телефон, бонусный баланс (`useLoyaltyStore`), выход (`logout`). |
| `app/modal.tsx` | Модальный экран-обёртка: читает `type`, `serviceId`, `message`, `promoId` и рендерит `ModalRenderer`. |
| `src/components/modals/index.tsx` | `ModalRenderer` — switch по `type` (booking / confirm / promo). |
| `src/components/modals/BookingModal.tsx` | Форма записи: валидация, `appointmentsAPI.create`, переход на `appointment-success`. |
| `src/components/modals/ConfirmModal.tsx` | Подтверждение действия (кнопки Отмена/Подтвердить, `onConfirm`). |
| `src/components/modals/PromoModal.tsx` | Карточка акции (данные по `promoId`, кнопка «Записаться»). |
| `src/components/home/BannerCarousel.tsx` | Автопрокручиваемая карусель баннеров. |
| `src/components/home/ServiceCard.tsx` | Карточка услуги с ценой/длительностью, кнопка «Записаться». |
| `src/components/home/PromoSection.tsx` | Секция акций (fallback-акции, если API пуст). |
| `src/components/appointments/AppointmentCard.tsx` | Карточка записи со статусом и отменой. |
| `src/components/common/Button.tsx` | Кнопка (variants, loading, disabled, style). |
| `src/components/common/Input.tsx` | Поле ввода с label/error/multiline. |
| `src/components/common/Card.tsx`, `LoadingSpinner.tsx` | Карточка-контейнер и спиннер. |
| `src/api/client.ts` | Axios: baseURL из `env`, подстановка Bearer-токена, авто-обновление токена при 401 (single-flight) + `setUnauthorizedHandler`, `getErrorMessage`. |
| `src/store/useAuthStore.tsx` | user / isAuthenticated / isLoading; `checkAuth`, `requestCode`, `verifyCode`, `logout`; сброс сессии при 401. |
| `src/store/useAppointmentStore.ts` | Состояние списка записей. |
| `src/store/useLoyaltyStore.ts` | Бонусный баланс и история. |
| `src/hooks/usePushNotifications.ts` | Получение и регистрация push-токена (expo-notifications). |

---

## 3. Пользовательский путь (user flow)

```mermaid
flowchart TD
    A[Запуск приложения] --> B{_layout: checkAuth}
    B -->|нет токена| C[/(auth)/phone]
    B -->|есть токен| G[/(tabs) Главная]
    C -->|ввод телефона| C1{requestCode}
    C1 -->|need_redirect| D1[/(auth)/max-link]
    C1 -->|sent_to_max| D[/(auth)/verify]
    D1 -->|Продолжить| D
    D -->|ввод кода из MAX| E{verifyCode}
    E -->|успех| F["записать токен + user в store"]
    F --> G
    G -->|тап по услуге| H["/modal?type=booking&serviceId=..."]
    G -->|тап по акции| I["/modal?type=promo&promoId=..."]
    H -->|заполнить форму → create| J[/appointment-success]
    I -->|кнопка Записаться| H
    J -->|На главную| G
    G -->|вкладка Записи| K[/(tabs)/appointments]
    K -->|отмена| K
    G -->|вкладка Профиль| L[/(tabs)/profile]
    L -->|Выйти| M[/(auth)/phone]
```

**Ключевые сценарии UX:**

1. **Авторизация (через MAX, без SMS)** — телефон → `POST /auth/request-code` → сервер возвращает `session_id` + `status`. Если `need_redirect` — пользователь открывает бота MAX по диплинку и получает код в чат; если `sent_to_max` — код уже отправлен. Затем `POST /auth/verify-code` c `{session_id, code}` → пара токенов `access_token` + `refresh_token` в `AsyncStorage` (`STORAGE_KEYS`), пользователь в `useAuthStore`. При 401 клиент автоматически обновляет токен через `POST /auth/refresh`.
2. **Запись к врачу** — с Главной (услуга/акция) → модалка `booking` → валидация → `POST /appointments` → экран успеха → возврат на Главную.
3. **Управление записями** — вкладка «Мои записи»: список, статусы (pending/confirmed/cancelled/completed), отмена, pull-to-refresh.
4. **Профиль и бонусы** — баланс лояльности, выход из аккаунта.
5. **Push-уведомления** — о статусе записи (подтверждение/напоминание) — см. раздел FCM.

---

## 4. Навигация (expo-router)

| Путь | Экран | Комментарий |
|---|---|---|
| `/` → `(tabs)/index` | Главная | Вкладка «Главная» |
| `/(tabs)/appointments` | Мои записи | Вкладка «Мои записи» |
| `/(tabs)/news` | Новости | Вкладка «Новости» |
| `/(tabs)/profile` | Профиль | Вкладка «Профиль» |
| `/(auth)/phone` | Вход | Группа (auth) — без табов |
| `/(auth)/max-link` | Подтверждение в MAX | Параметры: `phone`, `deep_link`, `session_id` |
| `/(auth)/verify` | Код | Параметры: `phone`, `session_id` |
| `/modal` | Модалка | Параметры: `type`, `serviceId`, `message`, `promoId` |
| `/appointment-success` | Успех записи | После создания записи |

---

## 5. FCM (Firebase Cloud Messaging) — что нужно и как реализовать

### 5.1 Текущее состояние проекта

- Установлены **оба** подхода: `@react-native-firebase/app@17.4.2` + `@react-native-firebase/messaging@17.4.2` (нативные модули) **и** `expo-notifications` + `expo-device` (мягкий путь).
- Хук `usePushNotifications()` (expo-notifications) уже написан и регистрирует токен через `pushAPI.registerToken()`.
- В `.env` есть `FCM_SENDER_ID=your_fcm_sender_id` (заглушка).
- В `app.json` **нет** ни `android.package`/`ios.bundleIdentifier`, ни плагинов Firebase/notifications.
- ⚠️ Использовать одновременно `@react-native-firebase/messaging` и `expo-notifications` **не стоит** — будут конфликты. Выберите один путь (см. ниже).

### 5.2 Что нужно (обязательный чек-лист)

1. **Проект в Firebase** — [console.firebase.google.com](https://console.firebase.google.com):
   - создать приложение **Android** (имя пакета, напр. `com.denta.mobile`) → скачать `google-services.json`;
   - создать приложение **iOS** (Bundle ID, напр. `com.denta.mobile`) → скачать `GoogleService-Info.plist`.
2. **Добавить идентификаторы в `app.json`**:
   ```json
   {
     "expo": {
       "android": { "package": "com.denta.mobile" },
       "ios": { "bundleIdentifier": "com.denta.mobile" }
     }
   }
   ```
3. **Положить файлы креденшелов в корень проекта**: `google-services.json` (Android), `GoogleService-Info.plist` (iOS).
4. **Добавить конфиг-плагины** в `app.json` (зависит от выбранного пути, см. 5.3/5.4).
5. **Development build** — FCM-нативные модули **не работают в Expo Go**. Нужно собрать: `npx expo prebuild` (локально) или **EAS Build** (`npx eas build --platform android`).
6. **Бэкенд**: эндпоинт для регистрации токена уже есть — `POST /push/register` (`src/api/push.ts`), хук его вызывает.
7. **Отправка** уведомлений — через **FCM API** (серверная часть) или **Expo Push Service** (если путь через `expo-notifications`).

### 5.3 Путь A — `expo-notifications` (рекомендуется для Expo)

Проще, хук уже готов. FCM-токен получается через сервис Expo.

В `app.json`:
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "color": "#007AFF",
          "defaultChannel": "default"
        }
      ]
    ]
  }
}
```

Порядок:
1. Добавить `android.package` и плагин `expo-notifications`.
2. Положить `google-services.json` (для Android) — Expo использует его для FCM.
3. Собрать dev build (`npx expo run:android` / EAS).
4. Подключить `usePushNotifications()` в корневом лэйауте, сохранять токен.
5. Отправка: сервер шлёт запрос в **Expo Push API** (`https://exp.host/--/api/v2/push/send`) с `to: <ExpoPushToken>` (этот токен возвращает `getExpoPushTokenAsync`).

### 5.4 Путь B — `@react-native-firebase/messaging` (нативный FCM)

Уже установлен, даёт полный доступ к FCM (data-сообщения, темы и т.д.), но требует больше настройки.

В `app.json`:
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging"
    ]
  }
}
```

Порядок:
1. Добавить плагины Firebase и `android.package`.
2. Положить `google-services.json` / `GoogleService-Info.plist` в корень.
3. Собрать dev build.
4. Токен: `import messaging from '@react-native-firebase/messaging'; await messaging().getToken();`
5. Подписка на сообщения: `messaging().onMessage(...)`, `messaging().setBackgroundMessageHandler(...)`.
6. Отправка: сервер шлёт напрямую в **FCM** с `to: <FCM token>`.

> Совет: если не нужны специфичные FCM-фичи — выберите **путь A** (`expo-notifications`), а `@react-native-firebase/*` можно удалить, чтобы не раздувать сборку.

### 5.5 Что осталось доработать в коде

- [ ] В `app/_layout.tsx` добавить редирект: неавторизованный → `/(auth)/phone`.
- [ ] Вызвать `usePushNotifications()` в корневом лэйауте (сейчас хук нигде не подключён).
- [ ] В `useAuthStore` при логине/логауте согласовать токен push с сессией (регистрировать/удалять).
- [ ] Обработка **тапа по уведомлению** → навигация (например, на `/(tabs)/appointments`).
- [ ] Обработка **foreground**-уведомлений (показ баннера/алерта) через `setNotificationHandler`.

---

## 6. Очередь задач (next steps)

1. Редирект по авторизации в `_layout.tsx` (+ защита экранов).
2. Подключить `usePushNotifications` и настроить FCM по пути A или B.
3. Наполнить `news.tsx` данными из API (сейчас статично).
4. Добавить иконки/сплэш в `assets/images` и вернуть ссылки в `app.json`.
5. Реализовать выбор даты/времени в `BookingModal` (сейчас фиксированные `date`/`time`).
6. Вынести общие цвета/тему из хардкода в единый файл.
