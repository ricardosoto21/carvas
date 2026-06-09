const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4173);
const root = path.resolve(__dirname, "..");
const normalizedRoot = path.normalize(root);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendFile(filePath, response) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Error interno del servidor");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const rawUrl = request.url || "/";
  const safePath = decodeURIComponent(rawUrl.split("?")[0]);
  const requestedPath = safePath === "/" ? "index.html" : safePath.replace(/^\/+/, "");
  const resolvedPath = path.normalize(path.join(normalizedRoot, requestedPath));

  if (!resolvedPath.startsWith(normalizedRoot)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Acceso denegado");
    return;
  }

  fs.stat(resolvedPath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("No encontrado");
      return;
    }

    sendFile(resolvedPath, response);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Carvas site running at http://127.0.0.1:${port}`);
});
