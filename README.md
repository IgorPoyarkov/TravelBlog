# TravelBlog — блог для путешественников

SPA на React 19 + TypeScript: лента постов с пагинацией, страница поста с комментариями,
регистрация/вход, личный кабинет с редактированием профиля и загрузкой аватара.

**Демо:** [ссылка после деплоя]
**Бэкенд:** локальный `json-server-auth` (REST + JWT), входит в репозиторий.

## Возможности

- регистрация и вход, JWT хранится и подставляется автоматически, приватные роуты
  (`/profile/*`) не открываются без сессии и выдерживают F5;
- лента постов с пагинацией, счётчик страниц считается от серверного заголовка;
- страница поста: описание, комментарии, добавление комментария;
- создание поста с валидацией, включая загрузку обложки;
- профиль: смена имени и аватара, аватар сохраняется без нажатия «Сохранить».

## Ключевые решения

### 1. Тип ответа выводится из Zod-схемы, а не пишется руками

Каждый ответ валидируется на границе, а TypeScript-тип получается из той же схемы
через `z.infer`. Схемы — единственный источник правды: если бэкенд изменит контракт,
это упадёт в рантайме на `parse`, а не проявится через три экрана.

```ts
const response = await api.get<unknown>(`/posts?_page=${page}&_limit=${limit}`);
const validatedData = PostListSchema.parse(response.data);

const totalCount =
  Number(response.headers["x-total-count"]) || validatedData.length;

return { data: validatedData, totalCount };
```

Отдельно: `x-total-count` может прийти пустым, поэтому для него предусмотрен
фолбэк на длину массива — иначе пагинация ломается на единственной странице.

### 2. `placeholderData` против «мерцания» при смене страницы

Без этой опции TanStack Query на переходе на новую страницу отдаёт `data: undefined`,
и сетка схлопывается в лоадер на каждый клик. С `placeholderData` остаются старые
данные, пока не пришли новые:

```ts
export const usePosts = (page = 1, limit = 6) =>
  useQuery({
    queryKey: ["posts", { page, limit }],
    queryFn: () => fetchPosts(page, limit),
    placeholderData: (previousData) => previousData,
  });
```

### 3. Одна схема поля для файла из инпута и для строки-ссылки из моков

В поле обложки оказываются два принципиально разных значения: `FileList` из живого
`<input type="file">` и строка-URL из тестовых данных. `z.union` с этим не справляется
из-за порядка проверок, поэтому схема принимает `z.any()` и последовательно сужает его
тремя `refine` — наличие, размер (до 5 МБ), MIME-тип (jpeg/png). Каждый `refine`
возвращает своё сообщение, поэтому пользователь видит, что именно не так, а не «ошибка загрузки».

### 4. Проверка паролей как переиспользуемый обёртка

Сверка «пароль / повторите пароль» нужна и на входе, и на регистрации, и в форме смены
пароля. Вместо дублирования — обёртка над любой схемой:

```ts
export const withPasswordConfirmation = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data, ctx) => {
    const { password, confirmPassword } = data as Record<string, unknown>;
    if (
      typeof password === "string" &&
      password.trim().length > 0 &&
      confirmPassword !== password
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Пароли не совпадают",
        path: ["password"],
      });
    }
  });
```

`superRefine` выбран потому, что ошибка привязывается к конкретному полю через `path` —
подсветка падает на то поле, с которым пользователь сейчас работает.

### 5. Токен подставляется в интерцепторе, а не в каждом запросе

`localStorage` читается в одном месте — в `api.interceptors.request.use`.
Ни один вызов в приложении не знает про авторизацию:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 6. Инвалидация вместо ручного обновления кэша

После создания комментария инвалидируются два ключа — сам список комментариев
и данные поста (там счётчик комментариев):

```ts
queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
queryClient.invalidateQueries({ queryKey: ["posts", postId] });
```

## Что улучшил бы

1. **`baseURL: "http://localhost:3000"` захардкожен.** Правильно —
   `import.meta.env.VITE_API_URL` с дефолтом, иначе демо нельзя выложить ни на один
   хостинг: у посетителя запрос уйдёт на его собственный localhost.
2. **Опечатка в имени папки `src/servises`.** Мелочь, но бросается в глаза при навигации
   по коду.

## Стек

React 19 · TypeScript · Vite · TanStack Query v5 (+ devtools) · Zustand ·
React Hook Form + Zod v4 · Axios · React Router v7 · Sass · oxlint

## Структура

```
src/
├── components/     переиспользуемые UI-компоненты
├── pages/          страницы = точки входа роутера
├── hooks/          утилитарные хуки
├── store/UI/       клиентский UI-стейт (Zustand)
├── servises/       слой работы с API
│   ├── Posts/      post.api.ts + post.schema.ts
│   ├── User/       user.api.ts + user.schema.ts
│   ├── Shared/Schemas/   общие схемы (file, password)
│   └── axios.instance.ts клиент с интерцептором токена
└── scss/           переменные, миксины, глобальные стили
```

Принцип: компонент не знает, откуда данные. `pages` → `hooks` → `servises`, в обратную
сторону зависимости нет.

## Запуск

Нужен Node.js 18+.

```bash
npm install
npm start
```

`npm start` поднимает фронтенд (Vite, порт 5173) и базу из `db.json`
(`json-server-auth`, порт 3000) одной командой через `concurrently`.

Если порты заняты, Vite и json-server переключатся на соседние — адреса будут в выводе терминала.

Тестовые данные для входа лежат в `db.json`.

## Про origin

Проект сделан как учебный-тренировочный, вне учебных курсов: отсюда локальный
`json-server-auth` вместо реального бэкенда — он даёт живые JWT, заголовки пагинации
и задержки сети, то есть те условия, ради которых и писался слой работы с данными.
