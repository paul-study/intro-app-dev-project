import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createFriendship,
  getFriendships,
  getFriendship,
  updateFriendship,
  deleteFriendship
} from "../controllers/friendships.js";

const router = express.Router();

router.post("/", jwtAuth, createFriendship);
router.get("/", jwtAuth, getFriendships);
router.get("/:id", jwtAuth, getFriendship);
router.patch("/:id", jwtAuth, updateFriendship);
router.delete("/:id", jwtAuth, deleteFriendship);

export default router;