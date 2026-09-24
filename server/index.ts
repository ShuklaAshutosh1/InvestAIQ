import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createApiRouter } from "./api.js";
import { createDatabase } from "./database.js";
import { MarketService } from "./marketService.js";

async function main() {
  const app = express();
  const database = createDatabase();
  const marketService = new MarketService(database);
  const port = Number(process.env.PORT ?? 4173);
  const host = process.env.HOST ?? "127.0.0.1";

  app.disable("x-powered-by");
  app.use((_request, response, next) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    );
    next();
  });
  app.use(express.json({ limit: "128kb" }));
  app.use("/api", createApiRouter(marketService));

  const distPath = resolve("dist");
  if (!existsSync(distPath)) {
    throw new Error("Client build not found. Run `npm run build` before starting.");
  }
  app.use(express.static(distPath));
  app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api")) return next();
    response.sendFile(resolve(distPath, "index.html"));
  });

  const server = app.listen(port, host, () => {
    console.log(`InvestAIQ is running at http://${host}:${port}`);
  });

  function shutdown() {
    server.close(() => {
      database.close();
      process.exit(0);
    });
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
