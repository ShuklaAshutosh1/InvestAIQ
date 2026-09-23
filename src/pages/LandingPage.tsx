import { useNavigate } from "react-router-dom";

const SYMBOLS = ["BTC", "ETH"];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>InvestAIQ</h1>
      <p>Live pattern recognition and suggestions for crypto prices.</p>
      <div className="symbol-picker">
        {SYMBOLS.map((symbol) => (
          <button key={symbol} onClick={() => navigate(`/dashboard/${symbol}`)}>
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
