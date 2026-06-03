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


const router = express.Router();

// router.post("/", createUser);
// router.post("/", validatePostUser, createUser);
router.post("/", validatePostUser, jwtAuth, createUser);
// router.get("/", getUsers);
// router.get("/:id", getUser);
router.get("/", jwtAuth, authorize(["ADMIN"]), getUsers);
router.get("/:id", jwtAuth, ownerOrAdmin("id"), getUser);
// router.put("/:id", updateUser);
// router.put("/:id", validatePutUser, updateUser);
router.put("/:id", validatePutUser, jwtAuth, ownerOrAdmin("id"), updateUser);
router.put("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});
// router.delete("/:id", deleteUser);
router.delete("/:id", jwtAuth, authorize(["ADMIN"]), deleteUser);
router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});

export default router
