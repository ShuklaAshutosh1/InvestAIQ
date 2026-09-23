import type { PricePoint } from "../domain/types";

/** Lightweight inline SVG line chart — no external charting library required. */
export function PriceChart({ points }: { points: PricePoint[] }) {
  if (points.length < 2) return <div className="chart-empty">Not enough data yet.</div>;

  const width = 600;
  const height = 240;
  const padding = 16;
  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((p.price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const rising = points[points.length - 1].price >= points[0].price;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="price-chart" role="img" aria-label="Price chart">
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={rising ? "#2ecf7a" : "#e6524d"}
        strokeWidth="2"
      />
    </svg>
  );
}
