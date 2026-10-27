const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const publicFiles = new Set([
  "index.html",
  "styles.css",
  "script.js",
  "invitation-personalization.js",
  "sofia-mis-xv.ics",
  "assets/bloomkeep-sofia.png",
  "assets/countdown-florencia-final-v3.png",
  "assets/dress-code-belen-v2.png",
  "assets/fecha-sofia.png",
  "assets/flor-musica.png",
  "assets/mensaje-sofia.png",
  "assets/modal-regalos-sofia.png",
  "assets/musica-sofia-base.png",
  "assets/musica-sofia-disco.png",
  "assets/musica-florencia.png",
  "assets/musica-justin.mp3",
  "assets/portada-sofia.png",
  "assets/regalos-florencia-boton-calendario.png",
  "assets/rsvp-sofia.png",
  "assets/ubicacion-modal-sofia.png",
  "assets/ubicacion-sofia.png",
  "assets/whatsapp-sofia.jpg",
  "assets/fonts/allura-latin-400.woff2",
  "assets/intro-zoe/butterfly-flight-02.png",
  "assets/intro-zoe/butterfly-flight-03.png",
  "assets/intro-zoe/butterfly-main.png",
  "assets/intro-zoe/welcome-floral-bg.png",
]);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".ics": "text/calendar; charset=utf-8",
};

http
  .createServer((request, response) => {
    const relativePath = decodeURIComponent(request.url.split("?")[0]) || "/";
    const requested = relativePath === "/" ? "index.html" : relativePath.slice(1);
    const filePath = path.resolve(root, requested);

    if (!publicFiles.has(requested) || !filePath.startsWith(root + path.sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    if (path.extname(filePath) === ".mp4" && request.headers.range) {
      fs.stat(filePath, (error, stats) => {
        if (error) {
          response.writeHead(404).end("Not found");
          return;
        }

        const [startText, endText] = request.headers.range.replace("bytes=", "").split("-");
        const start = Number.parseInt(startText, 10);
        const end = endText ? Number.parseInt(endText, 10) : stats.size - 1;

        if (!Number.isFinite(start) || start < 0 || end >= stats.size || start > end) {
          response.writeHead(416, { "Content-Range": `bytes */${stats.size}` }).end();
          return;
        }

        response.writeHead(206, {
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${stats.size}`,
          "Content-Length": end - start + 1,
          "Content-Type": "video/mp4",
          "Cache-Control": "no-store",
        });
        fs.createReadStream(filePath, { start, end }).pipe(response);
      });
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404).end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(data);
    });
  })
  .listen(5192, "0.0.0.0", () => {
    const lan = Object.values(require("os").networkInterfaces()).flat()
      .find((net) => net && net.family === "IPv4" && !net.internal);
    console.log(`Invitación disponible en http://${lan ? lan.address : "localhost"}:5192`);
  });
