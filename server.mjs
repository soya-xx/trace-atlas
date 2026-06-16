import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 4174);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const target = resolve(join(root, clean === "/" ? "index.html" : clean));
  return target.startsWith(root) ? target : join(root, "index.html");
}

createServer((request, response) => {
  const target = safePath(request.url || "/");
  const file = existsSync(target) ? target : join(root, "index.html");
  response.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream"
  });
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Trace Atlas available at http://127.0.0.1:${port}/`);
});
