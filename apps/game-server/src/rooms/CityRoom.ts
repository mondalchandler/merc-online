import { Room, Client } from "@colyseus/core";
import { CityState, PlayerState } from "./state/GameState";
import { setCityRoomRef, clearCityRoomRef } from "./roomRegistry";

type MoveMsg = { x?: number; y?: number; rot?: number; dx?: number; dy?: number };

export class CityRoom extends Room<CityState> {
  onCreate(_options: any) {
    this.setState(new CityState());
    setCityRoomRef(this);

    this.onMessage<MoveMsg>("move", (client, msg) => {
      const p = this.state.players.get(client.sessionId);
      if (!p) return;

      if (typeof msg.x === "number") p.x = msg.x;
      if (typeof msg.y === "number") p.y = msg.y;
      if (typeof msg.rot === "number") p.rot = msg.rot;
      if (typeof msg.dx === "number") p.x += msg.dx;
      if (typeof msg.dy === "number") p.y += msg.dy;

      p.lastMoveAt = Date.now();
    });
  }

  onJoin(client: Client, options: any) {
    const p = new PlayerState();
    p.id = client.sessionId;
    p.name = options?.name || options?.userId || "guest";
    p.x = Math.floor(Math.random() * 10) * 16;
    p.y = Math.floor(Math.random() * 10) * 16;
    this.state.players.set(client.sessionId, p);
    this.state.count = this.clients.length;
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    this.state.count = this.clients.length;
  }

  onDispose() {
    clearCityRoomRef(this);
  }
}
