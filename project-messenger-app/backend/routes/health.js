import express from "express";
import prisma from "../prisma/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // quick DB check
    return res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      db: "ok",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(503).json({
      status: "fail",
      uptime: process.uptime(),
      db: "error",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;