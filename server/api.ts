import { Router } from "express";
import type { MarketService } from "./marketService";

export function createApiRouter(marketService: MarketService): Router {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.json({ status: "ok", service: "investaiq-api", time: new Date().toISOString() });
  });

  router.get("/snapshot/:symbol", async (request, response) => {
    try {
      const snapshot = await marketService.getSnapshot(request.params.symbol);
      response.json(snapshot);
    } catch (error) {
      response.status(502).json({ error: "Market data is temporarily unavailable." });
    }
  });

  router.get("/history/:symbol", (request, response) => {
    const parsedLimit = Number(request.query.limit ?? 20);
    const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(100, Math.floor(parsedLimit))) : 20;
    response.json(marketService.getHistory(request.params.symbol, limit));
  });

  return router;
}
