# Групове завдання v2: Розширення клону X (Twitter)

## Опис завдання

Продовжити розробку мобільного додатку **X (Twitter) Clone**, додавши функціонал, який ми реалізували на уроці.

---

## Що ми робили на уроці (і що потрібно повторити)

### ✅ Частина 1: Рефакторинг провайдерів

- Винесення `ClerkProvider` та `ConvexProviderWithClerk` в окремий файл
- Створення `providers/ClerkAndConvexProvider.tsx`
- Спрощення `app/_layout.tsx`

### ✅ Частина 2: Схема бази даних (Convex)

- Створення `convex/schema.ts` з таблицями:
  - `users` — користувачі
  - `posts` — пости (твіти)
  - `likes` — лайки
  - `comments` — коментарі
  - `follows` — підписки
  - `notifications` — сповіщення
  - `bookmarks` — закладки
- Визначення індексів для швидкого пошуку

### ✅ Частина 3: Convex Mutations

- Створення `convex/users.ts` з mutation `createUser`
- Перевірка існуючого користувача перед створенням
- Ініціалізація полів `followers`, `following`, `posts` нулями

### ✅ Частина 4: Clerk Webhooks

- Створення `convex/http.ts` з HTTP Action
- Обробка події `user.created` від Clerk
- Верифікація webhook через Svix
- Автоматичне створення користувача в Convex при реєстрації

### ✅ Частина 5: Sign Out

- Додавання кнопки Sign Out на головному екрані
- Використання хука `useAuth` від Clerk

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

### 👨‍💼 Team Lead / Refactoring

**Що робить (як на уроці):**

- Створює `providers/ClerkAndConvexProvider.tsx`
- Рефакторить `app/_layout.tsx`
- Координує роботу команди
- Мержить Pull Requests

**Файли:**

- `providers/ClerkAndConvexProvider.tsx`
- `app/_layout.tsx` (оновлення)

**Код для `providers/ClerkAndConvexProvider.tsx`:**

```tsx
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function ClerkAndConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

**Код для оновленого `app/_layout.tsx`:**

```tsx
import { SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <InitialLayout />
      </SafeAreaView>
    </ClerkAndConvexProvider>
  );
}
```

---

### 🗄️ Schema Developer

**Що робить (як на уроці):**

- Створює `convex/schema.ts` зі всіма таблицями
- Визначає поля та типи
- Додає індекси для пошуку

**Файли:**

- `convex/schema.ts`

**Код для `convex/schema.ts`:**

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  posts: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    storageId: v.id("storage"),
    caption: v.optional(v.string()),
    likes: v.number(),
    comments: v.number(),
  }).index("by_user", ["userId"]),

  likes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),

  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
  }).index("by_post", ["postId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),

  notifications: defineTable({
    receiverId: v.id("users"),
    senderId: v.id("users"),
    type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
  }).index("by_receiver", ["receiverId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_both", ["userId", "postId"]),
});
```

---

### 🔧 Backend Developer

**Що робить (як на уроці):**

- Створює `convex/users.ts` з mutation `createUser`
- Створює `convex/http.ts` для обробки Clerk Webhooks
- Налаштовує Webhook в Clerk Dashboard
- Додає `CLERK_WEBHOOK_SECRET` в Convex

**Файли:**

- `convex/users.ts`
- `convex/http.ts`

**Код для `convex/users.ts`:**

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Перевірка чи користувач вже існує
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    // Створення нового користувача
    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});
```

**Код для `convex/http.ts`:**

```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    // Перевірка svix headers
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: any;

    // Верифікація webhook
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
```

**Налаштування Webhook в Clerk:**

1. **Clerk Dashboard** → **Webhooks** → **Add Endpoint**
2. **Endpoint URL:** `https://[your-convex-deployment].convex.site/clerk-webhook`
3. **Events:** вибрати `user.created`
4. Скопіювати **Signing Secret**
5. Додати в Convex:
   ```bash
   npx convex env set CLERK_WEBHOOK_SECRET whsec_xxxxx
   ```

> ⚠️ **Важливо:** Локальний `.env` файл НЕ працює для Convex серверних функцій! Потрібно використовувати `npx convex env set`

---

### 🎨 UI Developer

**Що робить (як на уроці):**

- Додає кнопку Sign Out на головний екран
- Використовує хук `useAuth` від Clerk

**Файли:**

- `app/(tabs)/index.tsx` (оновлення)

**Код для `app/(tabs)/index.tsx`:**

```tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#1DA1F2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
```

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
# Team Lead
git checkout -b feature/providers-refactor

# Schema Developer
git checkout -b feature/convex-schema

# Backend Developer
git checkout -b feature/webhooks

# UI Developer
git checkout -b feature/signout
```

### Крок 3: Після завершення роботи

```bash
git add .
git commit -m "feat: add convex schema with all tables"
git push origin feature/convex-schema
```

### Крок 4: Pull Request

1. Створити PR на GitHub
2. Team Lead робить review та merge

---

## Порядок виконання

```
┌─────────────────────────────────────────────────────────────┐
│              Паралельна робота                               │
├───────────────┬───────────────┬───────────────┬─────────────┤
│  Team Lead    │ Schema Dev    │ Backend Dev   │ UI Developer│
│               │               │               │             │
│  • providers/ │  • schema.ts  │  • users.ts   │  • Sign Out │
│  • _layout.tsx│  • 7 таблиць  │  • http.ts    │  • useAuth  │
│               │  • індекси    │  • Webhook    │             │
└───────────────┴───────────────┴───────────────┴─────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Інтеграція                                │
│         Team Lead мержить всі гілки                         │
│         Команда тестує Webhook                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Що має працювати в кінці

### ✅ Обов'язково:

1. **Провайдери винесені** — `ClerkAndConvexProvider.tsx` існує
2. **`_layout.tsx` спрощений** — використовує `ClerkAndConvexProvider`
3. **Схема БД створена** — `convex/schema.ts` з 7 таблицями
4. **Mutation працює** — `convex/users.ts` з `createUser`
5. **Webhook налаштований** — `convex/http.ts` обробляє `user.created`
6. **Користувач створюється автоматично** — при реєстрації через Google
7. **Sign Out працює** — кнопка виходу на головному екрані

---

## Структура проєкту (оновлена)

```
x-clone/
├── app/
│   ├── _layout.tsx              # Використовує ClerkAndConvexProvider
│   ├── index.tsx
│   ├── (auth)/
│   │   └── login.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx            # + Sign Out кнопка
│       ├── create.tsx
│       ├── notifications.tsx
│       └── profile.tsx
├── components/
│   └── InitialLayout.tsx
├── providers/                   # НОВА ПАПКА
│   └── ClerkAndConvexProvider.tsx
├── constants/
│   └── theme.ts
├── styles/
│   └── auth.styles.ts
├── convex/
│   ├── auth.config.ts
│   ├── schema.ts                # НОВИЙ ФАЙЛ
│   ├── users.ts                 # НОВИЙ ФАЙЛ
│   └── http.ts                  # НОВИЙ ФАЙЛ
├── assets/
│   └── images/
└── .env
```

---

## Критерії оцінювання

### Оцінка команди (спільна)

| Критерій                                   | Бали    |
| ------------------------------------------ | ------- |
| **Рефакторинг провайдерів**                |         |
| `ClerkAndConvexProvider.tsx` створено      | 10      |
| `_layout.tsx` використовує новий провайдер | 5       |
| **Схема бази даних**                       |         |
| `schema.ts` створено                       | 5       |
| Таблиця `users` з усіма полями             | 10      |
| Таблиця `posts` з індексом                 | 5       |
| Таблиці `likes`, `comments`                | 5       |
| Таблиці `follows`, `notifications`         | 5       |
| Таблиця `bookmarks`                        | 5       |
| **Convex Functions**                       |         |
| `users.ts` з mutation `createUser`         | 10      |
| Перевірка існуючого користувача            | 5       |
| **Webhook**                                |         |
| `http.ts` створено                         | 10      |
| Верифікація через Svix                     | 5       |
| Обробка події `user.created`               | 5       |
| `CLERK_WEBHOOK_SECRET` додано в Convex     | 5       |
| **UI**                                     |         |
| Кнопка Sign Out на головному екрані        | 5       |
| Sign Out працює                            | 5       |
| **Всього**                                 | **100** |

### Оцінка роботи з GitHub (обов'язково)

| Критерій                     | Так/Ні |
| ---------------------------- | ------ |
| Використано feature branches | ☐      |
| Є Pull Requests              | ☐      |
| Коміти мають зрозумілі назви | ☐      |

> Якщо GitHub не використано — **мінус 20 балів**

---

## Тестування Webhook

### Як перевірити, що Webhook працює:

1. Відкрий **Convex Dashboard** → **Data**
2. Вибери таблицю `users`
3. Зареєструй нового користувача через Google OAuth
4. Перевір, що користувач з'явився в таблиці `users`

### Можливі помилки:

| Помилка                        | Причина                   | Рішення                                                       |
| ------------------------------ | ------------------------- | ------------------------------------------------------------- |
| `Missing CLERK_WEBHOOK_SECRET` | Секрет не додано в Convex | `npx convex env set CLERK_WEBHOOK_SECRET whsec_xxx`           |
| `Error verifying webhook`      | Неправильний секрет       | Перевір Signing Secret в Clerk Dashboard                      |
| Користувач не створюється      | Webhook URL неправильний  | Перевір URL: `https://[deployment].convex.site/clerk-webhook` |

---

## Чек-лист перед здачею

### Team Lead

- [ ] `providers/ClerkAndConvexProvider.tsx` створено
- [ ] `app/_layout.tsx` оновлено
- [ ] Всі гілки змержені в `main`
- [ ] Проєкт запускається без помилок

### Schema Developer

- [ ] `convex/schema.ts` створено
- [ ] 7 таблиць визначено (users, posts, likes, comments, follows, notifications, bookmarks)
- [ ] Індекси додані до всіх таблиць
- [ ] `npx convex dev` працює без помилок

### Backend Developer

- [ ] `convex/users.ts` з mutation `createUser`
- [ ] `convex/http.ts` з HTTP Action
- [ ] Webhook створено в Clerk Dashboard
- [ ] `CLERK_WEBHOOK_SECRET` додано через `npx convex env set`
- [ ] При реєстрації користувач створюється в Convex

### UI Developer

- [ ] Кнопка Sign Out додана на `app/(tabs)/index.tsx`
- [ ] `useAuth` імпортовано з `@clerk/clerk-expo`
- [ ] Sign Out працює (виходить на екран логіну)

---

## Здача роботи

### Що потрібно здати:

1. **Посилання на GitHub репозиторій**
2. **Скріншот** таблиці `users` в Convex Dashboard з даними користувача

### Формат здачі:

```
Команда: [Назва команди]
Репозиторій: https://github.com/[username]/x-clone

Учасники:
- [Ім'я] — Team Lead
- [Ім'я] — Schema Developer
- [Ім'я] — Backend Developer
- [Ім'я] — UI Developer

Скріншот Convex Dashboard: [посилання або прикріплений файл]
```

---

## Корисні команди

| Команда                        | Опис                         |
| ------------------------------ | ---------------------------- |
| `npx convex dev`               | Запустити Convex dev server  |
| `npx convex env set KEY value` | Додати env variable в Convex |
| `npx convex env list`          | Переглянути env variables    |
| `npx convex dashboard`         | Відкрити Convex Dashboard    |

---

## Питання?

Якщо виникли питання — звертайтесь до викладача або в чат групи.

**Успіхів команді!** 🚀
