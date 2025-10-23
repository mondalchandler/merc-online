import express from "express";
export const cityRouter = express.Router();

cityRouter.get("/status", (req:any, res) => {
  res.json({ ok: true, time: Date.now(), user: req.user?.sub });
});
