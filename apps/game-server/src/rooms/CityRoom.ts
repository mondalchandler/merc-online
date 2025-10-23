import { Room, Client } from "@colyseus/core";

type V2 = { x: number; y: number };
type Player = { id: string; pos: V2; vel: V2 };

export class CityRoom extends Room {
  maxClients = 16;
  private players = new Map<string, Player>();
  private tickInterval?: NodeJS.Timeout;

  onCreate(_options: any) {
    this.setState({});           // (add Schema later if you like)
    this.setPatchRate(50);       // ~20Hz

    // v0.16 pattern: register message handlers in onCreate
    this.onMessage<{ vel?: V2 }>("input", (client, message) => {
      const p = this.players.get(client.sessionId);
      if (p) p.vel = message?.vel ?? { x: 0, y: 0 };
    });

    // simple server tick (replace with your authoritative sim)
    this.tickInterval = setInterval(() => this.update(), 50);
  }

  onJoin(client: Client) {
    this.players.set(client.sessionId, {
      id: client.sessionId,
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
    });
  }

  onLeave(client: Client) {
    this.players.delete(client.sessionId);
  }

  onDispose() {
    if (this.tickInterval) clearInterval(this.tickInterval);
  }

  private update() {
    for (const p of this.players.values()) {
      p.pos.x += p.vel.x * 0.05;
      p.pos.y += p.vel.y * 0.05;
    }
    this.broadcast("snapshot", {
      t: Date.now(),
      players: Array.from(this.players.values()),
    });
  }
}
