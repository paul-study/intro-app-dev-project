import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage
} from "../controllers/messages.js";

const router = express.Router();

router.post("/", jwtAuth, createMessage);
router.get("/", jwtAuth, getMessages);
router.get("/:id", jwtAuth, getMessage);
router.put("/:id", jwtAuth, updateMessage);
router.delete("/:id", jwtAuth, deleteMessage);

export default router;