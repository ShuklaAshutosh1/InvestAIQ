import type { ReactNode } from "react";
import { Activity, ArrowUpRight, BarChart3, CircleHelp, Clock3, Command, LayoutDashboard, Search, Settings2, WalletCards } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppShell({ symbol, children }: { symbol: string; children: ReactNode }) {
  const location = useLocation();
  const history = location.pathname.startsWith("/history");
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link to="/" className="brand"><span className="brand-mark"><Activity size={17} strokeWidth={2.7} /></span><span>invest<span className="brand-light">aiq</span></span><span className="brand-beta">BETA</span></Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <Link className={!history ? "nav-item active" : "nav-item"} to={`/dashboard/${symbol}`}><LayoutDashboard size={17} /> Overview</Link>
          <Link className={history ? "nav-item active" : "nav-item"} to={`/history/${symbol}`}><Clock3 size={17} /> Signal history</Link>
          <Link className="nav-item" to={`/dashboard/${symbol}`}><WalletCards size={17} /> Watchlist <span className="nav-count">02</span></Link>
          <div className="nav-separator" />
          <span className="nav-heading">MARKETS</span>
          <Link className="asset-link" to="/dashboard/BTC"><span className="coin-icon btc">₿</span><span><b>Bitcoin</b><small>BTC / USD</small></span><span className="asset-chevron"><ArrowUpRight size={14}/></span></Link>
          <Link className="asset-link" to="/dashboard/ETH"><span className="coin-icon eth">◆</span><span><b>Ethereum</b><small>ETH / USD</small></span><span className="asset-chevron"><ArrowUpRight size={14}/></span></Link>
        </nav>
        <div className="sidebar-spacer" />
        <div className="plan-card"><span className="plan-icon"><BarChart3 size={16}/></span><b>Market intelligence</b><p>Signals are built from live market data and transparent price patterns.</p><a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">Data by CoinGecko <ArrowUpRight size={13}/></a></div>
        <a href="mailto:hello@investaiq.com" className="nav-item footer-link"><CircleHelp size={16}/> Help & feedback</a>
        <div className="profile"><div className="avatar">IA</div><span><b>InvestAIQ</b><small>Personal workspace</small></span><Settings2 className="profile-settings" size={17}/></div>
      </aside>
      <section className="main-column">
        <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><b>{history ? "Signal history" : "Market overview"}</b></div><div className="topbar-actions"><div className="search-pill"><Search size={15}/><span>Quick search</span><kbd><Command size={11}/> K</kbd></div><span className="market-status"><i/> Markets live</span><div className="top-avatar">IA</div></div></header>
        <main className="page-content">{children}</main>
        <footer className="app-footer"><span>InvestAIQ <span className="footer-dot">·</span> Market intelligence for a clearer view</span><span>Market data provided by CoinGecko <ArrowUpRight size={12}/></span></footer>
      </section>
    </div>
  );
}
