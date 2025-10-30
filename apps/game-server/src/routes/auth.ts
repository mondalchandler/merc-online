import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

authRouter.post("/dev-login", (req: Request, res: Response) => {
  let { userId, name } = (req.body as any) || {};
  if (!userId) {
    userId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
  const token = jwt.sign(
    { sub: userId, name },
    JWT_SECRET,
    { expiresIn: "2h", audience: "merc", issuer: "merc-server" }
  );
  return res.json({ token });
});

export function authMiddleware(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      audience: "merc",
      issuer: "merc-server",
    });
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
