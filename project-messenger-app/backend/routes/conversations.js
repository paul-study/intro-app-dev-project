import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createConversation,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation
} from "../controllers/conversations.js";

const router = express.Router();

router.post("/", jwtAuth, createConversation);
router.get("/", jwtAuth, getConversations);
router.get("/:id", jwtAuth, getConversation);
router.put("/:id", jwtAuth, updateConversation);
router.delete("/:id", jwtAuth, deleteConversation);

export default router;