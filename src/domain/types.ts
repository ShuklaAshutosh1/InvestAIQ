export interface PricePoint {
  time: number;
  price: number;
}

export type PatternDirection = "up" | "down" | "flat";

export interface Pattern {
  direction: PatternDirection;
  length: number;
}

export interface MarketSnapshot {
  symbol: string;
  points: PricePoint[];
  pattern: Pattern;
  averagePrice: number;
  volatility: number;
  suggestion: string;
  capturedAt: string;
}
