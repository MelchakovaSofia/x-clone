# Групове завдання v10: Stories та Реальний Чат (Stories & Real-time Chat)

## Опис завдання

Продовжити розробку мобільного додатку **X (Twitter) Clone**, замінивши статичні mock-дані Stories на реальні дані з Convex, а також реалізувати повноцінний чат між користувачами.

---

## Що ми робили на уроці (і що потрібно повторити)

### ✅ Частина 1: Backend — Stories

- Додавання таблиці `stories` у `convex/schema.ts`
- Створення `convex/stories.ts` з функціями: `createStory`, `getActiveStories`, `getStoriesByUser`, `incrementViews`
- Оновлення `getStoriesUsers` у `convex/users.ts` для реальної перевірки `hasStory`

### ✅ Частина 2: Backend — Chat

- Додавання таблиць `conversations` та `messages` у `convex/schema.ts`
- Створення `convex/chat.ts` з функціями: `getConversations`, `getOrCreateConversation`, `sendMessage`, `getMessages`

### ✅ Частина 3: Stories UI

- Оновлення компонента `StoriesSection.tsx` для отримання реальних даних
- Додавання кнопки "Add Story" з використанням `expo-image-picker`
- Створення повноекранного `StoryViewerModal.tsx` з прогрес-баром та анімацією переходу

### ✅ Частина 4: Chat List UI

- Додавання кнопки переходу до чатів у Профілі користувача (`app/(tabs)/profile.tsx`)
- Додавання кнопки "Message" на сторінці профілю іншого користувача (`app/user/[id].tsx`)
- Створення екрану списку чатів `app/chats.tsx`

### ✅ Частина 5: Chat Conversation UI

- Створення екрану переписки `app/chat/[id].tsx`
- Використання інвертованого `FlatList` для повідомлень
- Поле вводу з `KeyboardAvoidingView` та кнопкою відправки

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

### 👨‍💼 Team Lead / Backend Developer

**Що робить (як на уроці):**

- Оновлює `convex/schema.ts` (додає `stories`, `conversations`, `messages`)
- Створює бекенд для Stories (`convex/stories.ts` та оновлює `getStoriesUsers` у `users.ts`)
- Створює бекенд для Чату (`convex/chat.ts`)
- Координує роботу команди
- Мержить Pull Requests

**Файли:**

- `convex/schema.ts`
- `convex/stories.ts`
- `convex/users.ts`
- `convex/chat.ts`

---

### 📱 Stories UI Developer

**Що робить (як на уроці):**

- Оновлює `components/StoriesSection.tsx` для отримання даних з Convex
- Реалізує завантаження нових stories через `expo-image-picker`
- Створює компонент `StoryViewerModal.tsx` для перегляду stories
- Додає обробку натискань (`onPress`) до `Story.tsx`
- Видаляє `constants/mock-date.ts`

**Файли:**

- `components/StoriesSection.tsx`
- `components/StoryViewerModal.tsx`
- `components/Story.tsx`
- `constants/mock-date.ts`

---

### 💬 Chat List UI Developer

**Що робить (як на уроці):**

- Додає іконку/кнопку чатів у власний профіль `app/(tabs)/profile.tsx`
- Додає кнопку "Message" у профіль іншого користувача `app/user/[id].tsx` (і логіку `getOrCreateConversation`)
- Створює екран `app/chats.tsx` (список всіх чатів користувача)

**Файли:**

- `app/(tabs)/profile.tsx`
- `app/user/[id].tsx`
- `app/chats.tsx`

---

### ✉️ Chat Conversation UI Developer

**Що робить (як на уроці):**

- Створює екран `app/chat/[id].tsx`
- Реалізує інвертований `FlatList` для відображення повідомлень
- Налаштовує `KeyboardAvoidingView` для поля вводу
- Стилізує бульбашки повідомлень (свої — сині, чужі — сірі)
- Реалізує логіку відправки повідомлень через `sendMessage`

**Файли:**

- `app/chat/[id].tsx`

---

## Робота з GitHub

### Крок 1: Оновити локальний репозиторій

```bash
cd x-clone
git checkout main
git pull origin main
```

### Крок 2: Створити нові гілки

```bash
# Team Lead / Backend Developer
git checkout -b feature/backend-stories-chat

# Stories UI Developer
git checkout -b feature/stories-ui

# Chat List UI Developer
git checkout -b feature/chat-list-ui

# Chat Conversation UI Developer
git checkout -b feature/chat-conversation-ui
```

### Крок 3: Після завершення роботи

```bash
git add .
git commit -m "feat: add chat conversation screen"
git push origin feature/chat-conversation-ui
```

### Крок 4: Pull Request

1. Створити PR на GitHub
2. Team Lead робить review та merge

---

## Порядок виконання

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Паралельна робота                             │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┤
│  Team Lead      │ Stories UI Dev   │ Chat List Dev   │ Chat Conv Dev   │
│  (Backend)      │                  │                 │                 │
│                 │                  │                 │                 │
│  • schema.ts    │ • StoriesSection │ • profile.tsx   │ • chat/[id].tsx │
│  • stories.ts   │ • StoryViewer    │   (кнопка)      │ • FlatList      │
│  • chat.ts      │   Modal.tsx      │ • user/[id].tsx │   (inverted)    │
│  • users.ts     │ • Story.tsx      │   (Message btn) │ • TextInput     │
│                 │                  │ • chats.tsx     │ • Бульбашки     │
└─────────────────┴──────────────────┴─────────────────┴─────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                            Інтеграція                                  │
│               Team Lead мержить всі гілки в main                       │
│           Команда тестує створення Stories та чат                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Що має працювати в кінці

### ✅ Обов'язково:

1. **Завантаження Story** — натиснути на "Add Story", вибрати фото, Story має з'явитись у стрічці.
2. **Перегляд Story** — натиснути на кружечок користувача зі Story, має відкритись повноекранний Modal з прогрес-баром.
3. **Видалення Mock-даних** — додаток більше не використовує `constants/mock-date.ts`.
4. **Кнопка "Message"** — у профілі іншого користувача кнопка створює або відкриває існуючий чат.
5. **Список чатів** — доступний з власного профілю, відображає список розмов з останнім повідомленням.
6. **Екран чату** — повідомлення відображаються знизу-вгору, свої — праворуч сині, чужі — ліворуч сірі.
7. **Відправка повідомлень** — нові повідомлення миттєво з'являються у чаті (Real-time).
8. **Клавіатура не перекриває поле** — поле вводу піднімається разом з клавіатурою (`KeyboardAvoidingView`).

---

## Структура проєкту (оновлена)

```text
x-clone/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── chats.tsx                    # НОВИЙ ФАЙЛ (Список чатів)
│   ├── chat/                        # НОВА ПАПКА
│   │   └── [id].tsx                 # НОВИЙ ФАЙЛ (Екран переписки)
│   ├── (auth)/
│   ├── (tabs)/
│   │   └── profile.tsx              # ОНОВЛЕНИЙ (Кнопка чатів)
│   └── user/
│       └── [id].tsx                 # ОНОВЛЕНИЙ (Кнопка Message)
├── components/
│   ├── StoriesSection.tsx           # ОНОВЛЕНИЙ (Реальні дані + Add)
│   ├── StoryViewerModal.tsx         # НОВИЙ ФАЙЛ
│   ├── Story.tsx                    # ОНОВЛЕНИЙ (onPress)
│   └── ...
├── convex/
│   ├── schema.ts                    # ОНОВЛЕНИЙ (+stories, conversations, messages)
│   ├── stories.ts                   # НОВИЙ ФАЙЛ
│   ├── chat.ts                      # НОВИЙ ФАЙЛ
│   ├── users.ts                     # ОНОВЛЕНИЙ (getStoriesUsers)
│   └── ...
└── constants/
    └── mock-date.ts                 # ВИДАЛЕНИЙ (або очищений)
```

---

## Критерії оцінювання

### Оцінка команди (спільна)

| Критерій                                | Бали    |
| --------------------------------------- | ------- |
| **Backend (Team Lead)**                 |         |
| Оновлено схему (stories, chat)          | 10      |
| `stories.ts` (всі мутації та квері)     | 10      |
| `chat.ts` (всі мутації та квері)        | 10      |
| **Stories UI**                          |         |
| Додавання нової Story (завантаження)    | 10      |
| Modal перегляду Story з прогрес-баром   | 10      |
| **Chat List UI**                        |         |
| Кнопка Message (створення розмови)      | 10      |
| Екран списку чатів (`chats.tsx`)        | 10      |
| **Chat Conversation UI**                |         |
| Екран переписки (inverted FlatList)     | 10      |
| Надсилання та відображення повідомлень  | 10      |
| Правильна робота клавіатури             | 5       |
| **Всього**                              | **95**  |

> **Примітка:** Максимум 100 балів. Додаткові 5 балів — бонус за якість або додаткові фічі (наприклад, видалення повідомлень).

### Оцінка роботи з GitHub (обов'язково)

| Критерій                     | Так/Ні |
| ---------------------------- | ------ |
| Використано feature branches | ☐      |
| Є Pull Requests              | ☐      |
| Коміти мають зрозумілі назви | ☐      |

> Якщо GitHub не використано — **мінус 20 балів**

---

## Тестування

### Як перевірити, що все працює:

1. **Запустити додаток** — `npm start`
2. Створити Story: Натиснути "Add Story", вибрати фото. Перевірити, чи з'явилася вона у стрічці.
3. Переглянути Story: Натиснути на свою або чужу Story, дочекатись завершення прогрес-бару.
4. Написати повідомлення: Перейти в профіль іншого користувача -> Натиснути "Message".
5. Відправити текст: Набрати текст, натиснути Send. Переконатись, що повідомлення з'явилось.
6. Перевірити список чатів: Перейти у власний профіль -> натиснути на іконку чатів. Переконатись, що чат є у списку.
7. Real-time: Відкрити додаток на двох симуляторах (з різними акаунтами), перевірити миттєву доставку повідомлень.

---

## Чек-лист перед здачею

### Team Lead / Backend Developer
- [ ] Оновлено `convex/schema.ts`
- [ ] Створено `convex/stories.ts`
- [ ] Створено `convex/chat.ts`
- [ ] Оновлено `getStoriesUsers` в `users.ts`
- [ ] Всі гілки успішно змержені

### Stories UI Developer
- [ ] Компонент `StoriesSection` відображає реальні дані
- [ ] Працює завантаження картинок
- [ ] `StoryViewerModal` працює коректно
- [ ] Очищено `mock-date.ts`

### Chat List UI Developer
- [ ] У профілі іншого користувача є кнопка "Message", яка веде в чат
- [ ] У власному профілі є кнопка переходу до `chats.tsx`
- [ ] Список чатів відображає ім'я, аватар та останнє повідомлення

### Chat Conversation UI Developer
- [ ] Екран `chat/[id].tsx` відображає повідомлення знизу
- [ ] Дизайн бульбашок відповідає вимогам (свої сині, чужі сірі)
- [ ] Відправка повідомлень працює
- [ ] `KeyboardAvoidingView` налаштовано правильно

---

## Здача роботи

### Що потрібно здати:

1. **Посилання на GitHub репозиторій**
2. **Скріншот** списку чатів
3. **Скріншот** екрану переписки з повідомленнями
4. **Скріншот** перегляду Story (`StoryViewerModal`)
5. **Відео** (бажано) — демонстрація чату або додавання Story

### Формат здачі:

```text
Команда: [Назва команди]
Репозиторій: https://github.com/[username]/x-clone

Учасники:
- [Ім'я] — Team Lead / Backend Developer
- [Ім'я] — Stories UI Developer
- [Ім'я] — Chat List UI Developer
- [Ім'я] — Chat Conversation UI Developer

Скріншоти/Відео:
- Список чатів: [посилання]
- Чат (переписка): [посилання]
- Перегляд Story: [посилання]
```
