import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Clock3, RefreshCw, TrendingUp } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { PatternBadge } from "../components/PatternBadge";
import { PriceChart } from "../components/PriceChart";
import { StatsPanel } from "../components/StatsPanel";
import { fetchSnapshot } from "../lib/api";
import type { MarketSnapshot } from "../domain/types";

const formatMoney = (value: number, digits = 2) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

export function DashboardPage() {
  const { symbol = "BTC" } = useParams();
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchSnapshot(symbol);
        if (!cancelled) { setSnapshot(data); setError(null); }
      } catch (err) { if (!cancelled) setError((err as Error).message); }
      finally { if (!cancelled) setRefreshing(false); }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [symbol]);

  const assetName = symbol.toUpperCase() === "ETH" ? "Ethereum" : "Bitcoin";
  const points = snapshot?.points ?? [];
  const first = points[0]?.price ?? 0;
  const latest = points[points.length - 1]?.price ?? 0;
  const change = first ? ((latest - first) / first) * 100 : 0;

  return (
    <AppShell symbol={symbol}>
      <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-square"><TrendingUp size={13}/></span> MARKET OVERVIEW <span className="heading-sep">/</span> 24H</div><h1>Market at a glance<span className="heading-period">.</span></h1><p className="heading-subtitle">A clearer view of what’s moving.</p></div><button className="refresh-button" onClick={() => { setRefreshing(true); fetchSnapshot(symbol).then(setSnapshot).catch((err) => setError(err.message)).finally(() => setRefreshing(false)); }}><RefreshCw size={14} className={refreshing ? "spin" : ""}/> Refresh data</button></div>

      {error && <div className="error-banner">Market data is temporarily unavailable. {error}</div>}
      {!snapshot && !error && <div className="loading-panel"><span className="loading-spinner"/> Connecting to live market data…</div>}

      {snapshot && <>
        <section className="metric-grid">
          <article className="metric-card lead-metric"><div className="metric-top"><span>Tracked asset</span><span className="live-chip"><i/> LIVE</span></div><div className="asset-title"><span className={`coin-icon large ${symbol.toLowerCase()}`}>{symbol.toUpperCase() === "BTC" ? "₿" : "◆"}</span><span><b>{assetName}</b><small>{symbol.toUpperCase()} <span>·</span> USD</small></span></div><div className="metric-value">{formatMoney(latest, latest > 100 ? 2 : 3)}</div><div className={change >= 0 ? "metric-change positive" : "metric-change negative"}>{change >= 0 ? <ArrowUpRight size={15}/> : <ArrowDownRight size={15}/>} {Math.abs(change).toFixed(2)}% <span>over 24 hours</span></div></article>
          <article className="metric-card"><div className="metric-top"><span>Pattern signal</span><span className="metric-icon"><TrendingUp size={16}/></span></div><div className="signal-area"><PatternBadge pattern={snapshot.pattern}/></div><p className="metric-note">{snapshot.pattern.length} consecutive price movements detected</p><div className="card-foot"><span>AIQ pattern scan</span><span>Just updated</span></div></article>
          <article className="metric-card"><div className="metric-top"><span>24h average</span><span className="metric-icon"><BarChartMini/></span></div><div className="metric-value secondary-value">{formatMoney(snapshot.averagePrice, snapshot.averagePrice > 100 ? 2 : 3)}</div><p className="metric-note">Mean price across observed data points</p><div className="card-foot"><span>{points.length} data points</span><span>USD</span></div></article>
          <article className="metric-card"><div className="metric-top"><span>Price range</span><span className="metric-icon"><ActivityMini/></span></div><div className="metric-value secondary-value">{formatMoney(snapshot.volatility, snapshot.volatility > 100 ? 2 : 4)}</div><p className="metric-note">High-to-low movement in this sample</p><div className="card-foot"><span>24 hour window</span><span>USD</span></div></article>
        </section>

        <section className="content-grid">
          <article className="surface chart-surface"><div className="section-title-row"><div><div className="section-kicker">PRICE ACTION</div><h2>{symbol.toUpperCase()} price movement</h2></div><div className="range-selector"><button className="selected">24H</button><button disabled>7D</button><button disabled>30D</button></div></div><div className="chart-price-row"><b>{formatMoney(latest, latest > 100 ? 2 : 3)}</b><span className={change >= 0 ? "change-text positive" : "change-text negative"}>{change >= 0 ? "+" : "−"}{Math.abs(change).toFixed(2)}%</span><span className="chart-interval">Past 24 hours</span></div><PriceChart points={points}/><div className="chart-axis"><span>24h ago</span><span>12h ago</span><span>Now</span></div></article>
          <article className="surface signal-surface"><div className="section-kicker">AIQ INSIGHT</div><h2>Pattern analysis</h2><div className="signal-illustration"><div className="signal-orbit orbit-one"/><div className="signal-orbit orbit-two"/><div className="signal-center"><TrendingUp size={23}/></div><span className="signal-node node-one"/><span className="signal-node node-two"/><span className="signal-node node-three"/></div><div className="signal-status"><span>Current signal</span><PatternBadge pattern={snapshot.pattern}/></div><p className="signal-copy">{snapshot.suggestion}</p><div className="signal-disclaimer"><span><Clock3 size={13}/></span><p>Pattern recognition is descriptive, not a prediction. Always make independent decisions.</p></div></article>
        </section>
        <StatsPanel snapshot={snapshot}/>
        <p className="data-caption"><span className="data-dot"/> Market data last updated {new Date(snapshot.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} <span>·</span> Refreshes every minute</p>
      </>}
    </AppShell>
  );
}

function BarChartMini() { return <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 14V9m4 5V4m4 10V7m4 7V2" strokeLinecap="round"/></svg>; }
function ActivityMini() { return <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9h3l2-5 3 10 2-5h4" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
