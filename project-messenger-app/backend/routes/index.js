import express from "express";
import { getPersonInfo, getProgLangs } from "../controllers/index.js";

const router = express.Router();

router.get("/", getPersonInfo);
router.get("/progLangs", getProgLangs);

export default router;
