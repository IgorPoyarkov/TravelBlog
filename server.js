import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from "path";
import { fileURLToPath } from "url";

const jsonServer = require("json-server");
const auth = require("json-server-auth");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = jsonServer.create();
const PORT = process.env.PORT || 3000;

// CORS: фронт на GitHub Pages обращается к другому origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  // Без этого фронт не сможет прочитать X-Total-Count и не посчитает страницы
  res.header("Access-Control-Expose-Headers", "X-Total-Count,Content-Range");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Правила доступа (Unix-подобные права: owner|logged-in|public).
// 6 = read+write, 4 = read, 0 = none.
// posts/comments: любой читает, авторизованный пишет; users: только владелец.
const rules = auth.rewriter({
  posts: 664,
  comments: 664,
  users: 600,
});

const router = jsonServer.router(path.join(__dirname, "db.json"));

// json-server требует доступа к БД через app.db для работы auth-гвардов
app.db = router.db;

// Порядок middleware критичен: defaults → rules → auth → router
app.use(jsonServer.defaults());
app.use(rules);
app.use(auth);
app.use(router);

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
});
