# InvestAIQ

InvestAIQ is a crypto market intelligence dashboard for exploring Bitcoin and Ethereum price movement. It pairs a responsive React interface with an Express API, live CoinGecko market data, descriptive pattern signals, and a local SQLite history.

> **Important:** Signals describe patterns in observed prices. They are not price forecasts, investment recommendations, or personalized financial advice. Market data can be delayed or unavailable.

## Features

- Responsive landing page and market dashboard
- Bitcoin (BTC) and Ethereum (ETH) 24-hour market snapshots
- Price movement chart, average price, observed range, and consecutive-movement pattern
- Plain-language signal context and an explicit non-predictive disclaimer
- Signal history persisted in SQLite
- Express API with health endpoint, input bounds, security headers, and static production serving

## Requirements

- Node.js 22 or newer (uses the built-in `node:sqlite` module)
- npm
- Network access to the CoinGecko public API for live market data

## Run locally

```bash
npm install
npm run dev
```

The `dev` script builds the frontend and starts the combined app at `http://127.0.0.1:4173`. For a production-style run, use:

```bash
npm run build
npm start
```

Set `PORT` to change the server port and `HOST` to change the bind address. The server binds to `127.0.0.1` by default; set `HOST=0.0.0.0` behind a secure reverse proxy when your deployment platform needs an externally reachable listener.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API status and server timestamp |
| `GET` | `/api/snapshot/BTC` | Fetch a BTC 24-hour snapshot, analyze the observed series, and record the signal |
| `GET` | `/api/snapshot/ETH` | Fetch an ETH 24-hour snapshot, analyze the observed series, and record the signal |
| `GET` | `/api/history/BTC?limit=20` | Return recent BTC signal records (limit is capped at 100) |
| `GET` | `/api/history/ETH?limit=20` | Return recent ETH signal records (limit is capped at 100) |

Snapshot fields include the observed price points, detected direction and streak length, average, observed range, explanatory suggestion, and capture time. Each successful snapshot is written to the local SQLite database.

## Project structure

```text
src/
  components/   Shared dashboard, chart, stats, and history UI
  domain/       Pure pattern detection and statistics functions
  lib/          Frontend API client
  pages/        Landing, market dashboard, and signal history pages
  styles.css    Responsive visual system
server/
  api.ts             Express API routes
  database.ts        SQLite schema and connection
  index.ts           HTTP server, security headers, and static app
  marketService.ts   CoinGecko integration and signal persistence
```

## Data and deployment notes

- The public CoinGecko endpoint may enforce rate limits. A failed upstream request returns a `502` response with a generic availability message.
- SQLite stores history in the server's local database file. Use persistent disk storage for deployments that need history to survive restarts; SQLite on ephemeral hosting will not.
- The API currently has no user accounts or per-user portfolios. History is shared by the single app instance.
- Put the app behind HTTPS and a reverse proxy for public deployments. Add authentication, request throttling, observability, and durable database backups before using it as a multi-user service.

## Project scripts

```bash
npm run dev       # Build the frontend and start the combined app
npm run build     # Build the frontend into dist/
npm start         # Start the Express server (requires dist/)
npm test          # Run the domain and UI unit tests
```
