import type { HistoryEntry } from "../lib/api";

export function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) return <p className="muted">No history recorded yet.</p>;

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Direction</th>
          <th>Streak</th>
          <th>Avg price</th>
          <th>Volatility</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={i}>
            <td>{new Date(entry.capturedAt).toLocaleTimeString()}</td>
            <td className={entry.direction}>{entry.direction}</td>
            <td>{entry.length}</td>
            <td>${entry.averagePrice.toFixed(2)}</td>
            <td>${entry.volatility.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
