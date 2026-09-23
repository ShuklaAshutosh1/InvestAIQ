# InvestAIQ

Live crypto price pattern recognition and trade suggestions.

Built with the same architecture as AI-Charya:

- **Frontend:** React + TypeScript + Vite, routed with `react-router-dom`
- **Backend:** Express, serving both a JSON API (`/api/*`) and the built frontend
- **Storage:** SQLite (via Node's built-in `node:sqlite`) — logs every pattern detection to `pattern_history`
- **Domain logic:** kept separate from UI and server, in `src/domain/` — pure functions for pattern detection and stats, unit-tested with Vitest

## Project layout

```
investaiq/
  src/
    domain/         pattern detection + stats (pure logic, unit tested)
    components/      reusable UI pieces
    pages/           routed pages (Landing, Dashboard, History)
    lib/api.ts       client-side fetch helpers
  server/
    index.ts         Express entry point (security headers + static serving)
    api.ts            API routes
    marketService.ts  fetches CoinGecko prices, runs pattern detection, logs history
    database.ts        SQLite schema + connection
```

## Running it

```bash
npm install
npm run dev
```

This builds the frontend once and starts the Express server at `http://127.0.0.1:4173`, which serves both the API and the app.

For frontend development with hot reload against a running backend, run `npm start` in one terminal and `vite` (the dev server) in another — the Vite config already proxies `/api` to port 4173.

## Tests

```bash
npm test
```

## API

- `GET /api/snapshot/:symbol` — fetches live prices (BTC or ETH), returns price points, detected pattern, suggestion, average price, and volatility. Logs the result to history.
- `GET /api/history/:symbol?limit=20` — returns the most recent logged pattern detections for that symbol.
