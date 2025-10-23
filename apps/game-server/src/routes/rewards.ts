import express from "express";
import crypto from "crypto";

export const rewardsRouter = express.Router();
const CLAIM_SECRET = process.env.CLAIM_SECRET || "dev_claim_secret";

// In-memory grant log (persist in DB in prod)
const grants = new Map<string, any>();

function signToken(payload: string){
  const sig = crypto.createHmac("sha256", CLAIM_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
function verifyToken(tok: string){
  const [payload, sig] = tok.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", CLAIM_SECRET).update(payload).digest("base64url");
  return sig === expected ? payload : false;
}

// GET /rewards/token?chapter=1
rewardsRouter.get("/token", (req:any, res) => {
  const userId = req.user?.sub;
  const chapter = Number(req.query.chapter || 0);
  if (!chapter) return res.status(400).json({ error: "chapter required" });
  const payload = JSON.stringify({ userId, chapter, iat: Date.now() });
  const token = signToken(payload);
  res.json({ token });
});

// POST /rewards/claim { token }
rewardsRouter.post("/claim", (req:any, res) => {
  const userId = req.user?.sub;
  const { token } = req.body || {};
  const payloadStr = verifyToken(token);
  if (!payloadStr) return res.status(400).json({ error: "invalid token" });
  const payload = JSON.parse(payloadStr);
  if (payload.userId !== userId) return res.status(400).json({ error: "token not for this user" });
  const key = `${userId}:${payload.chapter}`;
  if (grants.has(key)) return res.status(409).json({ error: "already claimed" });
  const itemId = `chapter-${payload.chapter}-jacket`;
  const grant = { userId, chapter: payload.chapter, itemId, grantedAt: Date.now() };
  grants.set(key, grant);
  res.json({ ok: true, grant });
});
