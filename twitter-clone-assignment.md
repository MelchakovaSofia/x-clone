# Групове завдання: Створення клону X (Twitter)

## Опис проєкту

Створити мобільний додаток — клон соціальної мережі **X (Twitter)** з використанням технологій, вивчених на занятті.

---

## Що ми робили на уроці (і що потрібно повторити)

### ✅ Частина 1: Базова структура (Expo Router)

- Створення проєкту `npx create-expo-app`
- `app/_layout.tsx` — Stack Navigator + SafeAreaView
- `app/(tabs)/_layout.tsx` — Tab Navigator з іконками (MaterialIcons)
- `app/(tabs)/*.tsx` — екрани табів (placeholder)
- `constants/theme.ts` — кольори темної теми

### ✅ Частина 2: Авторизація (Clerk)

- Створення проєкту в Clerk Dashboard
- `.env` з `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `ClerkProvider` в `app/_layout.tsx`
- `app/(auth)/login.tsx` — Google OAuth через `useSSO`
- `components/InitialLayout.tsx` — захист роутів (редіректи)
- `styles/auth.styles.ts` — стилі для екрану логіну

### ✅ Частина 3: База даних (Convex)

- `npx convex dev` — ініціалізація
- JWT Template в Clerk Dashboard (назва: `convex`)
- `convex/auth.config.ts` — інтеграція Clerk + Convex
- `ConvexProviderWithClerk` в `app/_layout.tsx`

---

## Формат роботи

|                             |                                  |
| --------------------------- | -------------------------------- |
| **Тип завдання**            | Групове                          |
| **Розмір команди**          | 4 особи                          |
| **Система контролю версій** | GitHub                           |
| **Методологія**             | Feature branches + Pull Requests |

---

## Розподіл ролей у команді

### 👨‍💼 Team Lead / Project Setup

**Що робить (як на уроці):**

- Створює репозиторій на GitHub
- `npx create-expo-app x-clone`
- Налаштовує Expo Router
- Створює `app/_layout.tsx` з SafeAreaView
- Створює `constants/theme.ts`

**Файли:**

- `app/_layout.tsx` (базова версія)
- `app/index.tsx`
- `constants/theme.ts`
- `README.md`

---

### 🔐 Auth Developer

**Що робить (як на уроці):**

- Створює проєкт в Clerk Dashboard
- Увімкнює Google OAuth
- Додає `.env` з ключем
- Обгортає додаток в `ClerkProvider`
- Створює `login.tsx` з `useSSO`
- Створює `InitialLayout.tsx` з логікою редіректів - не потрібно робити

**Файли:**

- `app/(auth)/login.tsx`
- `components/InitialLayout.tsx` - не потрібно створювати
- `styles/auth.styles.ts`
- `.env`

---

### 🗄️ Backend Developer

**Що робить (як на уроці):**

- `npx convex dev` — ініціалізація
- Створює JWT Template в Clerk (назва: `convex`)
- Налаштовує `auth.config.ts`
- Додає `ConvexProviderWithClerk` в `_layout.tsx`

**Файли:**

- `convex/auth.config.ts`
- Оновлює `app/_layout.tsx` (додає Convex)
- `.env` (додає Convex змінні)

---

### 🎨 UI Developer

**Що робить (як на уроці):**

- Створює `app/(tabs)/_layout.tsx` з Tab Navigator
- Налаштовує іконки (MaterialIcons)
- Налаштовує темну тему таб-бара
- Створює placeholder екрани для всіх табів

**Файли:**

- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx` (Feed)
- `app/(tabs)/create.tsx`
- `app/(tabs)/notifications.tsx`
- `app/(tabs)/profile.tsx`

---

## Робота з GitHub

### Крок 1: Team Lead створює репозиторій

```bash
# Створити проєкт
npx create-expo-app x-clone --template blank-typescript
cd x-clone

# Ініціалізувати git
git init
git add .
git commit -m "Initial commit: project setup"

# Створити репозиторій на GitHub і підключити
git remote add origin https://github.com/[username]/x-clone.git
git push -u origin main
```

### Крок 2: Додати учасників команди

1. GitHub → Repository → Settings → Collaborators
2. Додати всіх учасників команди
3. Кожен учасник клонує репозиторій:
   ```bash
   git clone https://github.com/[username]/x-clone.git
   cd x-clone
   npm install
   ```

### Крок 3: Робота з гілками

**Кожен учасник працює у своїй гілці:**

```bash
# Auth Developer
git checkout -b feature/auth

# Backend Developer
git checkout -b feature/convex

# UI Developer
git checkout -b feature/ui
```

```bash
git push origin feature/auth
git push origin feature/convex
git push origin feature/ui
```

### Крок 4: Pull Requests

1. Після завершення роботи — push гілки:

   ```bash
   git add .
   git commit -m "feat: add Google OAuth login"
   git push origin feature/auth
   ```

   git pull

2. Створити Pull Request на GitHub:
   - Base: `main`
   - Compare: `feature/auth`
   - Додати опис змін
   - Призначити Team Lead як reviewer

3. Team Lead робить code review та merge

---

## Порядок виконання

```
┌─────────────────────────────────────────────────────────────┐
│                    Team Lead                                 │
│         1. Створює репозиторій                              │
│         2. npx create-expo-app                              │
│         3. Базовий _layout.tsx + theme.ts                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Паралельна робота                               │
├───────────────────┬─────────────────┬───────────────────────┤
│  Auth Developer   │ Backend Developer│   UI Developer        │
│                   │                  │                       │
│  • Clerk Dashboard│  • npx convex dev│  • Tab Navigator      │
│  • ClerkProvider  │  • JWT Template  │  • Іконки             │
│  • login.tsx      │  • auth.config.ts│  • Темна тема         │
│  • InitialLayout  │  • ConvexProvider│  • Placeholder екрани │
└───────────────────┴─────────────────┴───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Інтеграція                                │
│         Team Lead мержить всі гілки                         │
│         Команда тестує разом                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Що має працювати в кінці

### ✅ Обов'язково (те, що робили на уроці):

1. **Запуск додатку** — `npm start` працює без помилок
2. **Екран логіну** — відображається з кнопкою "Continue with Google"
3. **Google OAuth** — натискаємо кнопку → відкривається Google → входимо
4. **Редірект після входу** — автоматично переходимо на таби
5. **Захист роутів** — неавторизований користувач не може потрапити на таби
6. **Tab Navigator** — 4 таби з іконками (Feed, Create, Notifications, Profile)
7. **Темна тема** — чорний фон, кольорові іконки

---

## Структура проєкту

```
x-clone/
├── app/
│   ├── _layout.tsx              # ClerkProvider + ConvexProvider + SafeAreaView
│   ├── index.tsx                # Redirect
│   ├── (auth)/
│   │   └── login.tsx            # Google OAuth (useSSO)
│   └── (tabs)/
│       ├── _layout.tsx          # Tab Navigator
│       ├── index.tsx            # Feed (placeholder)
│       ├── create.tsx           # Create (placeholder)
│       ├── notifications.tsx    # Notifications (placeholder)
│       └── profile.tsx          # Profile (placeholder)
├── components/
│   └── InitialLayout.tsx        # Захист роутів
├── constants/
│   └── theme.ts                 # Кольори
├── styles/
│   └── auth.styles.ts           # Стилі login
├── convex/
│   └── auth.config.ts           # Clerk + Convex
├── assets/
│   └── images/                  # Ілюстрація для login
└── .env                         # API ключі
```

---

## Дизайн (темна тема)

### Кольорова палітра

```ts
// constants/theme.ts
export const COLORS = {
  primary: "#1DA1F2", // Twitter Blue
  background: "#000000", // Чорний фон
  surface: "#16181C", // Темно-сірий
  surfaceLight: "#2F3336", // Світліший сірий
  white: "#E7E9EA", // Білий текст
  grey: "#71767B", // Сірий
} as const;
```

### Іконки табів (MaterialIcons)

| Таб           | Іконка               |
| ------------- | -------------------- |
| Feed          | `home`               |
| Create        | `add-circle-outline` |
| Notifications | `notifications-none` |
| Profile       | `person-outline`     |

### Налаштування Tab Navigator

```ts
// Як на уроці
tabBarStyle: {
  backgroundColor: COLORS.background,
  borderTopWidth: 0,
  position: "absolute",
  elevation: 0,
  height: 40,
}
```

---

## Критерії оцінювання

### Оцінка команди (спільна)

| Критерій                        | Бали    |
| ------------------------------- | ------- |
| **Expo Router**                 |         |
| Проєкт запускається без помилок | 10      |
| Tab Navigator з 4 табами        | 10      |
| Іконки на табах (MaterialIcons) | 5       |
| **Clerk (авторизація)**         |         |
| Екран логіну відображається     | 10      |
| Google OAuth працює             | 15      |
| Редірект після входу на таби    | 10      |
| Захист роутів (InitialLayout)   | 10      |
| **Convex**                      |         |
| Convex ініціалізовано           | 5       |
| auth.config.ts налаштовано      | 5       |
| ConvexProviderWithClerk додано  | 5       |
| **Дизайн**                      |         |
| Темна тема (чорний фон)         | 5       |
| Стилі login екрану              | 5       |
| Кольори з theme.ts              | 5       |
| **Всього**                      | **100** |

### Оцінка роботи з GitHub (обов'язково)

| Критерій                     | Так/Ні |
| ---------------------------- | ------ |
| Репозиторій публічний        | ☐      |
| Використано feature branches | ☐      |
| Є Pull Requests              | ☐      |
| README.md заповнений         | ☐      |

> Якщо GitHub не використано — **мінус 20 балів**

### Індивідуальна оцінка

Кожен учасник отримує оцінку на основі:

1. **Виконання своєї частини** — чи зроблено всі файли з розподілу
2. **Кількість комітів** — активність у репозиторії

## Корисні ресурси

### Документація

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Clerk + Expo](https://clerk.com/docs/quickstarts/expo)
- [Convex](https://docs.convex.dev/)
- [Convex + Clerk](https://docs.convex.dev/auth/clerk)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)

## Здача роботи

### Що потрібно здати:

1. **Посилання на GitHub репозиторій** (публічний)
2. **README.md** має містити:
   - Назву проєкту
   - Список учасників команди з ролями
   - Інструкцію запуску
   - Скріншоти додатку

### Формат здачі:

```
Команда: [Назва команди]
Репозиторій: https://github.com/[username]/x-clone

Учасники:
- [Ім'я] — Team Lead
- [Ім'я] — Auth Developer
- [Ім'я] — Backend Developer
- [Ім'я] — UI Developer
```

---

## Чек-лист перед здачею

### Team Lead

- [ ] Всі гілки змержені в `main`
- [ ] `npm start` працює без помилок
- [ ] README.md заповнений (назва, учасники, інструкція)
- [ ] Репозиторій публічний

### Auth Developer

- [ ] `.env` з `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `ClerkProvider` обгортає додаток
- [ ] `login.tsx` з кнопкою Google
- [ ] `useSSO` з `strategy: "oauth_google"`
- [ ] `InitialLayout.tsx` з логікою редіректів
- [ ] Google OAuth працює (можна увійти)

### Backend Developer

- [ ] `npx convex dev` виконано
- [ ] JWT Template створено в Clerk (назва: `convex`)
- [ ] `convex/auth.config.ts` з правильним domain
- [ ] `ConvexProviderWithClerk` додано в `_layout.tsx`
- [ ] `.env` містить `EXPO_PUBLIC_CONVEX_URL`

### UI Developer

- [ ] `app/(tabs)/_layout.tsx` з Tab Navigator
- [ ] 4 таби: Feed, Create, Notifications, Profile
- [ ] Іконки MaterialIcons на кожному табі
- [ ] Темна тема таб-бара (backgroundColor: #000000)
- [ ] Placeholder екрани для всіх табів

---

## Питання?

Якщо виникли питання — звертайтесь до викладача або в чат групи.

**Успіхів команді!** 🚀
