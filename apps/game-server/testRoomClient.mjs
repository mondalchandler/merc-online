import { Client } from "colyseus.js";

const API = "http://localhost:2567";
const WS = "ws://localhost:2567";

async function getJwt(userId) {
  const r = await fetch(API + "/auth/dev-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name: "Test User" }),
  });
  const { token } = await r.json();
  return token;
}

async function main() {
  const userId = "guest_" + Date.now();
  const jwt = await getJwt(userId);

  const client = new Client(WS);
  const room = await client.joinOrCreate("city", { jwt });
  console.log("✅ joined as", userId);

  // testRoomClient.mjs (after join)
  room.send("move", { x: 0, y: 0 });
  setInterval(() => {
    room.send("move", { dx: 4, dy: 0 }); // drift to the right
  }, 200);

  // Wait for the first state to arrive, then hook listeners
  room.onStateChange.once((state) => {
    if (!state.players) {
      console.error(
        "state.players is undefined. Check server schema & setState()."
      );
      return;
    }

    state.players.onAdd = (player, key) => {
      console.log("onAdd:", key, player.toJSON());
    };
    state.players.onRemove = (_player, key) => {
      console.log("onRemove:", key);
    };

    // Send a movement update after state is ready
    room.send("move", { x: Math.random() * 50, y: Math.random() * 50, rot: 0 });
  });

  // Keep the room alive briefly so we can see events
  setTimeout(() => {
    room.leave();
    console.log("left");
  }, 8000);
}

main().catch(console.error);
