import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createParticipant,
  getParticipants,
  getParticipant,
  updateParticipant,
  deleteParticipant
} from "../controllers/conversationParticipants.js";

const router = express.Router();

router.post("/", jwtAuth, createParticipant);
router.get("/", jwtAuth, getParticipants);
router.get("/:id", jwtAuth, getParticipant);
router.put("/:id", jwtAuth, updateParticipant);
router.delete("/:id", jwtAuth, deleteParticipant);

export default router;