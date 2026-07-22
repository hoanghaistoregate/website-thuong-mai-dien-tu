// Custom wrapper quanh json-server để fix lỗi 500 giả (known bug của json-server 0.17.x
// trên DELETE: bản ghi đã bị xóa thành công trong db.json nhưng response vẫn trả 500).
//
// Chạy bằng: node server.mjs  (thay cho: json-server --watch db.json --port 3000)

import jsonServer from "json-server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "db.json");

const server = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware chặn riêng cho DELETE: tự verify lại bằng cách đọc thẳng db.json
// sau khi router xử lý xong. Nếu record thực sự đã biến mất khỏi resource đó,
// coi là thành công (200) bất kể router có lỡ trả lỗi gì.
server.use((req, res, next) => {
  if (req.method !== "DELETE") return next();

  const originalStatus = res.status.bind(res);
  const originalJson = res.json ? res.json.bind(res) : null;
  const originalSend = res.send.bind(res);

  const match = req.path.match(/^\/([^/]+)\/([^/]+)$/);
  if (!match) return next();
  const [, resource, id] = match;

  const verifyAndFix = (body) => {
    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
      const list = db[resource];
      const stillExists =
        Array.isArray(list) &&
        list.some((item) => String(item.id) === String(id));

      if (!stillExists) {
        // Record đã thực sự bị xóa khỏi db.json -> coi là thành công dù router nói gì.
        originalStatus(200);
        return originalJson ? originalJson({}) : originalSend("{}");
      }
    } catch (err) {
      console.error("Lỗi khi verify lại db.json sau DELETE:", err);
    }
    // Không xác minh được, hoặc record vẫn còn -> trả nguyên trạng.
    return body;
  };

  res.json = (body) => {
    const fixed = verifyAndFix(body);
    if (fixed !== body) return fixed; // đã tự xử lý xong ở trên
    return originalJson
      ? originalJson(body)
      : originalSend(JSON.stringify(body));
  };

  res.send = (body) => {
    const fixed = verifyAndFix(body);
    if (fixed !== body) return fixed;
    return originalSend(body);
  };

  next();
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(
    `JSON Server (custom, đã fix lỗi 500 giả trên DELETE) đang chạy tại http://localhost:${PORT}`,
  );
});
