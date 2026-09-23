import type { AppDatabase } from "./database";
import { detectPattern, suggestionFor } from "../src/domain/patternDetector";
import { averagePrice, volatility } from "../src/domain/stats";
import type { MarketSnapshot, PricePoint } from "../src/domain/types";

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
};

export class MarketService {
  constructor(private readonly database: AppDatabase) {}

  async getSnapshot(symbol: string): Promise<MarketSnapshot> {
    const coinId = COINGECKO_IDS[symbol.toUpperCase()];
    if (!coinId) throw new Error(`Unsupported symbol: ${symbol}`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`
    );
    if (!response.ok) throw new Error(`CoinGecko error: ${response.status}`);

    const data = (await response.json()) as { prices: [number, number][] };
    const recent = data.prices.slice(-24);
    const points: PricePoint[] = recent.map(([time, price]) => ({ time, price }));
    const prices = points.map((p) => p.price);

    const pattern = detectPattern(prices);
    const suggestion = suggestionFor(pattern);
    const snapshot: MarketSnapshot = {
      symbol: symbol.toUpperCase(),
      points,
      pattern,
      averagePrice: averagePrice(prices),
      volatility: volatility(prices),
      suggestion,
      capturedAt: new Date().toISOString(),
    };

    this.logSnapshot(snapshot);
    return snapshot;
  }

  private logSnapshot(snapshot: MarketSnapshot) {
    this.database
      .prepare(
        `INSERT INTO pattern_history (symbol, direction, length, average_price, volatility, suggestion, captured_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        snapshot.symbol,
        snapshot.pattern.direction,
        snapshot.pattern.length,
        snapshot.averagePrice,
        snapshot.volatility,
        snapshot.suggestion,
        snapshot.capturedAt
      );
  }

  getHistory(symbol: string, limit = 20) {
    return this.database
      .prepare(
        `SELECT symbol, direction, length, average_price as averagePrice, volatility, suggestion, captured_at as capturedAt
         FROM pattern_history WHERE symbol = ? ORDER BY id DESC LIMIT ?`
      )
      .all(symbol.toUpperCase(), limit);
  }
}
