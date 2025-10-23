# MERC Online — Monorepo

This repository hosts:
- **apps/web** — the website & webcomic (Netlify).
- **apps/game-client** — the browser-playable game client (Godot or Phaser).
- **apps/game-server** — the multiplayer backend (Colyseus, Node/TS).
- **packages/proto** — shared types/schemas.

## Getting Started

### Prerequisites
- Node 20+
- (If using Godot) Godot 4.x
- pnpm or npm

### Install
```bash
# game server deps
cd apps/game-server && npm i
```

### Run game server (dev)
```bash
cd apps/game-server
npm run dev
```

### Web (Netlify)
Netlify is configured to publish from `apps/web`. Keep static assets and HTML there.
You can embed the game client by either:
- exporting a Godot web build into `apps/web/play/`, or
- hosting the client elsewhere and embedding via iframe.

## Deploy Targets
- **Web**: Netlify (`apps/web` as publish directory).
- **Server**: Fly.io/Render/Hetzner (Docker).

## Project Board & Issues
Use GitHub Projects (Board) for PBIs/Spikes. Labels used:
- `epic:*`, `priority:P1|P2|P3`, `type:PBI|Spike`, `area:web|game-client|game-server|infra|combat|missions|world|ui-ux|observability|moderation|cosmetics|rewards`.

## Local Development Flow
1. Run the server (`apps/game-server`).
2. Open the site from `apps/web/index.html` (or via Netlify dev).
3. The `/play` page/route loads the client and connects to your local server.

## Notes
- Keep `apps/web` lightweight for fast first render.
- Asset atlases and tilemap chunks should live under the game client project and be exported for the web build.
