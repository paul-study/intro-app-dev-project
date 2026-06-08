import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createUserSettings,
  getUserSettingsList,
  getUserSettingsById,
  updateUserSettings,
  deleteUserSettings
} from "../controllers/userSettings.js";

const router = express.Router();

router.post("/", jwtAuth, createUserSettings);
router.get("/", jwtAuth, getUserSettingsList);
router.get("/:id", jwtAuth, getUserSettingsById);
router.put("/:id", jwtAuth, updateUserSettings);
router.delete("/:id", jwtAuth, deleteUserSettings);

export default router;