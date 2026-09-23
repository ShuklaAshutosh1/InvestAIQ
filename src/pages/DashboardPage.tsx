import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { PatternBadge } from "../components/PatternBadge";
import { PriceChart } from "../components/PriceChart";
import { StatsPanel } from "../components/StatsPanel";
import { fetchSnapshot } from "../lib/api";
import type { MarketSnapshot } from "../domain/types";

export function DashboardPage() {
  const { symbol = "BTC" } = useParams();
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchSnapshot(symbol);
        if (!cancelled) {
          setSnapshot(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    }

    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [symbol]);

  return (
    <AppShell symbol={symbol}>
      <div className="dashboard-header">
        <h1>{symbol}</h1>
        {snapshot && (
          <div className="price">${snapshot.points[snapshot.points.length - 1].price.toLocaleString()}</div>
        )}
      </div>

      {error && <p className="error">Could not load data: {error}</p>}

      {snapshot && (
        <div className="grid">
          <div className="panel">
            <h2>Price</h2>
            <PriceChart points={snapshot.points} />
          </div>
          <div>
            <div className="panel">
              <h2>Pattern</h2>
              <PatternBadge pattern={snapshot.pattern} />
              <p className="suggestion">{snapshot.suggestion}</p>
            </div>
            <StatsPanel snapshot={snapshot} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
