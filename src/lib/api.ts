import type { MarketSnapshot } from "../domain/types";

export async function fetchSnapshot(symbol: string): Promise<MarketSnapshot> {
  const response = await fetch(`/api/snapshot/${symbol}`);
  if (!response.ok) throw new Error(`Failed to load snapshot for ${symbol}`);
  return response.json();
}

export interface HistoryEntry {
  symbol: string;
  direction: string;
  length: number;
  averagePrice: number;
  volatility: number;
  suggestion: string;
  capturedAt: string;
}

export async function fetchHistory(symbol: string): Promise<HistoryEntry[]> {
  const response = await fetch(`/api/history/${symbol}`);
  if (!response.ok) throw new Error(`Failed to load history for ${symbol}`);
  return response.json();
}
