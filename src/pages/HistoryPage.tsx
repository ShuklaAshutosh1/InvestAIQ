import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { HistoryList } from "../components/HistoryList";
import { fetchHistory, type HistoryEntry } from "../lib/api";

export function HistoryPage() {
  const { symbol = "BTC" } = useParams();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    fetchHistory(symbol).then(setEntries).catch(() => setEntries([]));
  }, [symbol]);

  return (
    <AppShell symbol={symbol}>
      <h1>Pattern history — {symbol}</h1>
      <div className="panel">
        <HistoryList entries={entries} />
      </div>
    </AppShell>
  );
}
