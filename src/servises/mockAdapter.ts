import { AxiosError, AxiosHeaders } from "axios";
import type { AxiosAdapter, AxiosResponse } from "axios";

/**
 * Mock adapter эмулирует json-server-auth прямо в браузере.
 * Используется когда VITE_API_URL не задан (GitHub Pages без бэкенда).
 * Данные — из db.json + localStorage для созданных записей.
 */

interface MockUser {
  id: string;
  email: string;
  password?: string;
  full_name?: string;
  city?: string;
  bio?: string;
  photo?: string;
}

interface Stored {
  posts: Record<string, unknown>[];
  comments: Record<string, unknown>[];
  users: MockUser[];
  nextId: number;
}

const STORAGE_KEY = "mock_store";
const TOKEN_KEY = "auth_token";

type Seed = {
  posts: Record<string, unknown>[];
  comments: Record<string, unknown>[];
  users: MockUser[];
};

// Демо-данные подгружаются отдельным файлом (см. scripts/generate-mock-db.mjs),
// чтобы 2 МБ фотографий не попадали в JS-бандл.
let seedPromise: Promise<Seed> | null = null;

function loadDb(): Promise<Seed> {
  if (!seedPromise) {
    seedPromise = fetch(`${import.meta.env.BASE_URL}mock-db.json`).then((r) => {
      if (!r.ok) throw new Error(`mock-db.json: HTTP ${r.status}`);
      return r.json() as Promise<Seed>;
    });
  }
  return seedPromise;
}

async function getStore(): Promise<Stored> {
  const db = await loadDb();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved) as Stored;
    return {
      ...parsed,
      posts: [...db.posts, ...parsed.posts],
      comments: [...db.comments, ...parsed.comments],
      users: [...db.users, ...parsed.users],
    };
  }
  return {
    posts: db.posts,
    comments: db.comments,
    users: db.users,
    nextId: Math.max(0, ...db.posts.map((p) => Number(p.id))) + 1,
  };
}

async function saveStore(store: Stored) {
  // В localStorage пишем только то, чего нет в seed-файле
  const db = await loadDb();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      posts: store.posts.filter((p) => !db.posts.includes(p)),
      comments: store.comments.filter((c) => !db.comments.includes(c)),
      users: store.users.filter((u) => !db.users.includes(u)),
      nextId: store.nextId,
    }),
  );
}

function makeToken(user: MockUser): string {
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 3600000,
    }),
  );
  return `mock.${payload}.sig`;
}

async function decodeToken(header?: string): Promise<MockUser | null> {
  if (!header) return null;
  const parts = header.replace("Bearer ", "").split(".");
  if (parts.length !== 3 || parts[0] !== "mock") return null;
  try {
    const payload = JSON.parse(atob(parts[1])) as {
      sub: string;
      email: string;
      exp: number;
    };
    if (payload.exp < Date.now()) return null;
    const store = await getStore();
    return store.users.find((u) => u.id === payload.sub) ?? null;
  } catch {
    return null;
  }
}

function res<T>(
  config: Parameters<AxiosAdapter>[0],
  data: T,
  status = 200,
  headers: Record<string, string> = {},
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: "OK",
    headers: new AxiosHeaders(headers),
    config,
    request: {} as any,
  };
}

// Возвращаем AxiosError с response: UI проверяет axios.isAxiosError + status
function fail(
  config: Parameters<AxiosAdapter>[0],
  status: number,
  message: string,
): AxiosError {
  const response: AxiosResponse = {
    data: { message },
    status,
    statusText: "Error",
    headers: new AxiosHeaders(),
    config,
    request: {} as any,
  };
  return new AxiosError(message, String(status), config, {}, response);
}

function matchRoute(
  url: string,
): { resource: string; id?: string; query: URLSearchParams } | null {
  const clean = url.replace(/^\/TravelBlog/, "").replace(/^\/+/, "");
  const [path, qs] = clean.split("?");
  const query = new URLSearchParams(qs || "");
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  return { resource: parts[0], id: parts[1], query };
}

export const mockAdapter: AxiosAdapter = async (config) => {
  const method = (config.method || "get").toUpperCase();
  const route = matchRoute(config.url || "");
  if (!route) throw fail(config, 404, "Not found");

  const { resource, id, query } = route;
  const store = await getStore();
  const authUser = await decodeToken(config.headers?.Authorization as string);

  // Auth
  if (resource === "login" || resource === "signin") {
    const body = JSON.parse(config.data || "{}") as {
      email: string;
      password: string;
    };
    const user = store.users.find(
      (u) => u.email === body.email && u.password === body.password,
    );
    if (!user) throw fail(config, 400, "Invalid credentials");
    return res(config, {
      accessToken: makeToken(user),
      user: { ...user, password: undefined },
    });
  }

  if (resource === "register" || resource === "signup") {
    const body = JSON.parse(config.data || "{}") as MockUser;
    if (store.users.some((u) => u.email === body.email))
      throw fail(config, 400, "Email exists");
    const newUser: MockUser = { ...body, id: String(store.nextId) };
    store.users.push(newUser);
    store.nextId++;
    await saveStore(store);
    return res(
      config,
      {
        accessToken: makeToken(newUser),
        user: { ...newUser, password: undefined },
      },
      201,
    );
  }

  if (resource === "logout") {
    localStorage.removeItem(TOKEN_KEY);
    return res(config, {});
  }

  // Posts
  if (resource === "posts") {
    if (method === "POST") {
      if (!authUser) throw fail(config, 401, "Unauthorized");
      const body = JSON.parse(config.data || "{}") as Record<string, unknown>;
      const newPost = { ...body, id: store.nextId++, userId: authUser.id };
      store.posts.push(newPost);
      await saveStore(store);
      return res(config, newPost, 201);
    }
    if (id) {
      const post = store.posts.find((p) => String(p.id) === id);
      if (!post) throw fail(config, 404, "Not found");
      return res(config, post);
    }
    const page = Number(query.get("_page") || 1);
    const limit = Number(query.get("_limit") || 10);
    const total = store.posts.length;
    const start = (page - 1) * limit;
    const slice = store.posts.slice(start, start + limit);
    return res(config, slice, 200, { "x-total-count": String(total) });
  }

  // Comments
  if (resource === "comments") {
    if (method === "POST") {
      if (!authUser) throw fail(config, 401, "Unauthorized");
      const body = JSON.parse(config.data || "{}") as Record<string, unknown>;
      const newComment = { ...body, id: store.nextId++, userId: authUser.id };
      store.comments.push(newComment);
      await saveStore(store);
      return res(config, newComment, 201);
    }
    const postId = query.get("post_id");
    const filtered = postId
      ? store.comments.filter((c) => String(c.post_id) === postId)
      : store.comments;
    return res(config, filtered);
  }

  // Users
  if (resource === "users") {
    if (id && method === "PATCH") {
      if (!authUser || authUser.id !== id) throw fail(config, 403, "Forbidden");
      const body = JSON.parse(config.data || "{}") as Partial<MockUser>;
      const idx = store.users.findIndex((u) => u.id === id);
      if (idx === -1) throw fail(config, 404, "Not found");
      store.users[idx] = { ...store.users[idx], ...body };
      await saveStore(store);
      return res(config, store.users[idx]);
    }
    if (id && method === "GET") {
      if (!authUser) throw fail(config, 401, "Unauthorized");
      if (authUser.id !== id) throw fail(config, 403, "Forbidden");
      const user = store.users.find((u) => u.id === id);
      if (!user) throw fail(config, 404, "Not found");
      return res(config, { ...user, password: undefined });
    }
    throw fail(config, 404, "Not found");
  }

  throw fail(config, 404, "Not found");
};
