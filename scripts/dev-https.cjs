const { createServer: createHttpsServer } = require("https");
const { createServer: createHttpServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");

const dev = true;
const hostname = process.env.DEV_HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3001);

const certDir = process.env.DEV_SSL_DIR
  ? path.resolve(process.env.DEV_SSL_DIR)
  : path.resolve(process.cwd(), ".cert");
const keyPath =
  process.env.DEV_SSL_KEY || path.join(certDir, "localhost-key.pem");
const certPath =
  process.env.DEV_SSL_CERT || path.join(certDir, "localhost-cert.pem");

let httpsOptions = null;

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
} else {
  console.warn(
    "\n⚠️  No se encontraron certificados SSL locales.\n" +
      "   Genera certificados auto-firmados (por ejemplo con mkcert) y colócalos en:\n" +
      `   ${keyPath}\n   ${certPath}\n` +
      "   o especifica DEV_SSL_KEY / DEV_SSL_CERT.\n" +
      "   Usaremos HTTP mientras tanto.\n"
  );
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    if (httpsOptions) {
      createHttpsServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      }).listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(
          `➡️  Dev server con HTTPS listo en https://${hostname}:${port}`
        );
      });
    } else {
      createHttpServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      }).listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(
          `➡️  Dev server sin SSL en http://${hostname}:${port} (genera certificados para habilitar HTTPS)`
        );
      });
    }
  })
  .catch((err) => {
    console.error("Error iniciando el dev server:", err);
    process.exit(1);
  });

