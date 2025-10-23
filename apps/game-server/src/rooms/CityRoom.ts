import { Room, Client } from "@colyseus/core";

type V2 = { x: number, y: number };
type Player = { id: string, pos: V2, vel: V2 };

export class CityRoom extends Room<any> {
  maxClients = 16;
  private players: Map<string, Player> = new Map();
  private tickInterval: any;

  onCreate(options: any) {
    this.setState({}); // no schema for brevity
    this.setPatchRate(50); // 20Hz approx
    this.tickInterval = this.clock.setInterval(() => this.update(), 50);
  }

  onJoin(client: Client, options: any) {
    this.players.set(client.sessionId, { id: client.sessionId, pos: {x:0, y:0}, vel:{x:0, y:0} });
  }

  onLeave(client: Client, consented: boolean) {
    this.players.delete(client.sessionId);
  }

  onDispose() {
    this.clock.clear();
    if (this.tickInterval) clearInterval(this.tickInterval);
  }

  // super-naive update loop; replace with authoritative sim and snapshots
  update(){
    for (const p of this.players.values()){
      p.pos.x += p.vel.x * 0.05;
      p.pos.y += p.vel.y * 0.05;
    }
    this.broadcast("snapshot", { t: Date.now(), players: Array.from(this.players.values()) });
  }

  // Example message handlers
  onMessage(client: Client, type: string | number, message: any) {
    if (type === "input") {
      const p = this.players.get(client.sessionId);
      if (p) p.vel = message.vel || {x:0,y:0};
    }
  }
}
