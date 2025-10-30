import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";

import { authRouter } from "./routes/auth";
import { CityRoom } from "./rooms/CityRoom";
import { getCityRoomRef } from "./rooms/roomRegistry";

const PORT = Number(process.env.PORT || 2567);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/debug/state", (_req, res) => {
  const room = getCityRoomRef();
  if (!room) return res.json({ error: "no city room active" });
  const state = room.state?.toJSON ? room.state.toJSON() : null;
  if (state) return res.json(state);

  const players: any[] = [];
  room.state.players.forEach((p: any, key: string) => {
    players.push({ id: p.id ?? key, name: p.name, x: p.x, y: p.y, rot: p.rot });
  });
  return res.json({ count: players.length, players });
});

const httpServer = createServer(app);
const gameServer = new Server({ transport: new WebSocketTransport({ server: httpServer }) });

gameServer.define("city", CityRoom);

gameServer.listen(PORT).then(() => {
  console.log("Colyseus: Listening for connections");
  console.log(`HTTP listening on :${PORT}`);
});
