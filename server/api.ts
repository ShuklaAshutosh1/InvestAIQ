import { Router } from "express";
import type { MarketService } from "./marketService";

export function createApiRouter(marketService: MarketService): Router {
  const router = Router();

  router.get("/snapshot/:symbol", async (request, response) => {
    try {
      const snapshot = await marketService.getSnapshot(request.params.symbol);
      response.json(snapshot);
    } catch (error) {
      response.status(502).json({ error: (error as Error).message });
    }
  });

  router.get("/history/:symbol", (request, response) => {
    const limit = Number(request.query.limit ?? 20);
    response.json(marketService.getHistory(request.params.symbol, limit));
  });

  return router;
}
