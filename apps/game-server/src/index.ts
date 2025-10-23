import { Server, Room } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/core/transport/WebSocketTransport";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { cityRouter } from "./routes/city.js";
import { rewardsRouter } from "./routes/rewards.js";
import { authRouter, authMiddleware } from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// Auth & routes
app.use("/auth", authRouter);
app.use("/rewards", authMiddleware, rewardsRouter);
app.use("/city", authMiddleware, cityRouter); // sample API

const port = Number(process.env.PORT || 2567);
const httpServer = app.listen(port, () => console.log(`HTTP listening on :${port}`));

// Colyseus
const server = new Server({
  transport: new WebSocketTransport({ server: httpServer })
});

// Dynamic import to avoid circular
import("./rooms/CityRoom.js").then(({ CityRoom }) => {
  server.define("city", CityRoom);
  console.log("Colyseus room 'city' defined");
});
