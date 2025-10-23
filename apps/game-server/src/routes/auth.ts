import express from "express";
import jwt from "jsonwebtoken";

export const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// Dev login — in production replace with real auth provider
authRouter.post("/dev-login", (req, res) => {
  const { userId, name } = req.body || {};
  if (!userId) return res.status(400).json({ error: "userId required" });
  const token = jwt.sign({ sub: userId, name }, JWT_SECRET, { expiresIn: "2h", audience: "merc", issuer: "merc-server" });
  return res.json({ token });
});

export function authMiddleware(req, res, next){
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try{
    const payload = jwt.verify(token, JWT_SECRET, { audience: "merc", issuer: "merc-server" });
    req.user = payload;
    next();
  } catch(e){
    return res.status(401).json({ error: "Invalid token" });
  }
}
