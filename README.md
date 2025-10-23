# MERC Starter — Godot + Colyseus Monorepo

This starter includes:
- **apps/web** — Static site + reward claim demo UI (Netlify, `publish = apps/web`).
- **apps/game-client** — Godot 4 skeleton with a trivial chunk streamer script.
- **apps/game-server** — Colyseus (Node/TS) with:
  - **Auth stub** (`POST /auth/dev-login`) issuing JWTs.
  - **Rewards** (`GET /rewards/token`, `POST /rewards/claim`) using signed tokens.
  - **Room sample** (`"city"` room) broadcasting simple snapshots.

## Quickstart

### 1) Server
```bash
cd apps/game-server
npm i
JWT_SECRET=dev_secret CLAIM_SECRET=dev_claim_secret npm run dev
# HTTP + WebSocket on :2567
```

### 2) Web
Serve `apps/web` (Netlify or local):
```bash
# Local preview (any static server)
npx http-server apps/web -p 8080
# Or Netlify CLI
netlify dev --dir=apps/web
```

Open http://localhost:8080 and click **Get Claim Token** then **Claim Reward** to test.

### 3) Godot Export
- Open `apps/game-client` in **Godot 4**, build your game, and export a **Web** build into `apps/web/play/` (replacing the placeholder).

## API Summary

- `POST /auth/dev-login` → `{ token }` (JWT; dev-only)
- `GET /rewards/token?chapter=1` (Auth: Bearer) → `{ token }`
- `POST /rewards/claim` (Auth: Bearer, JSON `{ token }`) → `{ ok, grant }`
- `GET /city/status` (Auth: Bearer) → health check

> Replace in-memory rewards with a real DB (e.g., Postgres/Supabase) in production.

## Notes
- Web page auto-detects localhost and calls `http://localhost:2567` for API during local dev, otherwise relative path.
- Colyseus room `"city"` is minimal: add schema, authoritative physics, snapshot interpolation, and input handling.
