import express from "express";

import {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser
} from "../controllers/user.js"

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.put("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});
router.delete("/:id", deleteUser);
router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});

export default router
