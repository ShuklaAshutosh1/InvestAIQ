import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AppShell({ symbol, children }: { symbol: string; children: ReactNode }) {
  return (
    <div className="shell">
      <header className="shell-header">
        <Link to="/" className="brand">InvestAIQ</Link>
        <nav>
          <Link to={`/dashboard/${symbol}`}>Dashboard</Link>
          <Link to={`/history/${symbol}`}>History</Link>
        </nav>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
