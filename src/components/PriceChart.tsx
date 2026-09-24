import type { PricePoint } from "../domain/types";

/** Lightweight responsive SVG market chart. */
export function PriceChart({ points }: { points: PricePoint[] }) {
  if (points.length < 2) return <div className="chart-empty">Not enough data yet.</div>;
  const width = 720, height = 205, left = 4, right = 4, top = 8, bottom = 8;
  const values = points.map((point) => point.price);
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
  const coords = points.map((point, index) => {
    const x = left + (index / (points.length - 1)) * (width - left - right);
    const y = height - bottom - ((point.price - min) / range) * (height - top - bottom);
    return `${x},${y}`;
  });
  const rising = values.at(-1)! >= values[0];
  const color = rising ? "#58d7a1" : "#f37a7a";
  const fillCoords = `${left},${height} ${coords.join(" ")} ${width - right},${height}`;
  const last = coords.at(-1)!.split(",").map(Number);
  return <svg viewBox={`0 0 ${width} ${height}`} className="price-chart" role="img" aria-label="Price movement over the past 24 hours" preserveAspectRatio="none">
    <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".2"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    {[.2,.4,.6,.8].map((fraction) => <line key={fraction} x1="0" x2={width} y1={height*fraction} y2={height*fraction} stroke="#292c35" strokeDasharray="3 6"/>)}
    <polygon points={fillCoords} fill="url(#chart-fill)"/>
    <polyline points={coords.join(" ")} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
    <circle cx={last[0]} cy={last[1]} r="5" fill={color} opacity=".17"/><circle cx={last[0]} cy={last[1]} r="2.5" fill={color}/>
  </svg>;
}
