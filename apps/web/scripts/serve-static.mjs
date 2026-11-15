// Serves the static export like Firebase Hosting: files, directory index pages and 404.html.
// Used by `pnpm start` and the end-to-end tests. Usage: node scripts/serve-static.mjs <dir> <port>
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const isFile = (path) => path.startsWith(root + sep) && existsSync(path) && statSync(path).isFile();

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  const candidates = pathname.endsWith("/") ? [`${pathname}index.html`] : [pathname, `${pathname}/index.html`];
  for (const candidate of candidates) {
    const file = join(root, candidate);
    if (isFile(file)) {
      response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
      createReadStream(file)
        .on("error", () => response.end())
        .pipe(response);
      return;
    }
  }
  response.writeHead(404, { "content-type": TYPES[".html"] });
  createReadStream(join(root, "404.html"))
    .on("error", () => response.end())
    .pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Serving ${root} at http://127.0.0.1:${port}/`));
