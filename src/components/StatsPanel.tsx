import type { MarketSnapshot } from "../domain/types";

export function StatsPanel({ snapshot }: { snapshot: MarketSnapshot }) {
  return (
    <div className="panel">
      <h2>Stats</h2>
      <div className="stat-row">
        <span className="stat-label">Average price</span>
        <span className="stat-value">${snapshot.averagePrice.toFixed(2)}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Volatility (range)</span>
        <span className="stat-value">${snapshot.volatility.toFixed(2)}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Streak</span>
        <span className="stat-value">
          {snapshot.pattern.length} ({snapshot.pattern.direction})
        </span>
      </div>
    </div>
  );
}
