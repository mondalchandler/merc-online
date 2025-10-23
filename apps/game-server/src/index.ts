import { Server, Room } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/core/transport/WebSocketTransport";

class CityRoom extends Room {
  maxClients = 16;
  onCreate() { this.setState({}); }
  onJoin(client) { console.log('join', client.sessionId); }
  onLeave(client) { console.log('leave', client.sessionId); }
  onDispose() { console.log('dispose'); }
}

const port = Number(process.env.PORT || 2567);
const server = new Server({
  transport: new WebSocketTransport({})
});

server.define("city", CityRoom);
server.listen(port).then(() => console.log(`Colyseus listening on :${port}`));
