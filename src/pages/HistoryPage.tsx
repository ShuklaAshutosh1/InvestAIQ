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
      <div className="history-heading"><div><div className="eyebrow"><span className="eyebrow-square">◷</span> ACTIVITY LOG <span className="heading-sep">/</span> {symbol.toUpperCase()}</div><h1>Signal history</h1><p>Recent patterns detected for {symbol.toUpperCase()}.</p></div></div>
      <div className="surface history-surface">
        <HistoryList entries={entries} />
      </div>
    </AppShell>
  );
}
