import type { MarketSnapshot } from "../domain/types";

export function StatsPanel({ snapshot }: { snapshot: MarketSnapshot }) {
  return <section className="stats-panel" aria-label="Market statistics">
    <div className="stats-title">OBSERVATION DETAILS</div>
    <div className="stat-row"><span className="stat-label">Average observed price</span><span className="stat-value">${snapshot.averagePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
    <div className="stat-row"><span className="stat-label">Observed price range</span><span className="stat-value">${snapshot.volatility.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span></div>
    <div className="stat-row"><span className="stat-label">Movement streak</span><span className="stat-value">{snapshot.pattern.length} points · {snapshot.pattern.direction}</span></div>
  </section>;
}
