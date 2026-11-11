// Builds public/mock-db.json from db.json for the backend-less demo mode.
// Keeps photos so the demo looks real, but drops password hashes.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const db = JSON.parse(fs.readFileSync(path.join(root, "db.json"), "utf8"));

const mock = {
  posts: db.posts,
  comments: db.comments,
  users: db.users.map(({ password, confirmPassword, ...rest }) => rest),
};

const out = path.join(root, "public", "mock-db.json");
fs.writeFileSync(out, JSON.stringify(mock));
console.log(
  `mock-db.json: ${mock.posts.length} posts, ${mock.comments.length} comments, ` +
    `${mock.users.length} users, ${fs.statSync(out).size} bytes`
);