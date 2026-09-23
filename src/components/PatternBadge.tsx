import type { Pattern } from "../domain/types";

export function PatternBadge({ pattern }: { pattern: Pattern }) {
  const label =
    pattern.direction === "flat"
      ? "Flat"
      : `${pattern.direction === "up" ? "Uptrend" : "Downtrend"} · ${pattern.length} streak`;

  return <span className={`pattern-badge ${pattern.direction}`}>{label}</span>;
}
