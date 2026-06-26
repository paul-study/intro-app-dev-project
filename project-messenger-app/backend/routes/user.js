import express from "express";

import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/user.js"
import {
  validatePostUser,
  validatePutUser,
} from "../middleware/validation/user.js";
import jwtAuth from "../middleware/jwtAuth.js";
import { authorize, ownerOrAdmin } from "../middleware/rbac.js";
import rateLimitByRole from "../middleware/rateLimitByRole.js";
import { cacheGet } from "../middleware/cache.js";


const router = express.Router();

router.post("/", validatePostUser, jwtAuth, rateLimitByRole, createUser);
router.get("/", jwtAuth, authorize(["ADMIN", "USER"]), rateLimitByRole, cacheGet, getUsers);
router.get("/:id", jwtAuth, ownerOrAdmin("id"), rateLimitByRole, cacheGet, getUser);
router.put("/:id", validatePutUser, jwtAuth, ownerOrAdmin("id"), rateLimitByRole, updateUser);
router.put("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});
router.delete("/:id", jwtAuth, authorize(["ADMIN"]), deleteUser);
router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});

export default router
