import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { cityRouter } from "./routes/city.js";
import { rewardsRouter } from "./routes/rewards.js";
import { authRouter, authMiddleware } from "./routes/auth.js";
import { CityRoom } from "./rooms/CityRoom.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/rewards", authMiddleware, rewardsRouter);
app.use("/city", authMiddleware, cityRouter);

const port = Number(process.env.PORT || 2567);
const httpServer = app.listen(port, () => console.log(`HTTP listening on :${port}`));

const server = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

// v0.16: this overload is (name, roomClass)
server.define("city", CityRoom);
console.log("Colyseus room 'city' defined");
